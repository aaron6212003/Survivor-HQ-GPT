import {NextResponse} from 'next/server';
import {adminClient} from '@/lib/hq/server.mjs';
import {currentNfl,nflWeek} from '@/lib/hq/espn.mjs';
import {bingoCatalog,completedCardIds,findMondayGame,linesFor,liveBingoStats} from '@/lib/bingo.mjs';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=30;

async function userFor(request:Request) {
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 if(!token) throw new Error('Please sign in to play Bingo.');
 const client=adminClient();const {data,error}=await client.auth.getUser(token);
 if(error||!data.user) throw new Error('Your session has expired. Please sign in again.');
 return {client,user:data.user};
}
async function featuredEvent(client:any) {
 const meta=await currentNfl();
 for(const week of [meta.week,...Array.from({length:18-meta.week},(_,index)=>meta.week+index+1)]) {
  const snapshot=await nflWeek(client,meta.season,week);const monday=findMondayGame(snapshot.games);
  if(monday&&Date.parse(monday.kickoff)>Date.now()-6*60*60_000) return {meta,week,game:monday};
 }
 throw new Error('The next Monday Night Football matchup has not been posted yet.');
}
async function savedBoards(client:any,userId:string) {
 const {data,error}=await client.from('hq_bingo_boards').select('event_id,season,week,board,updated_at').eq('user_id',userId).order('updated_at',{ascending:false});
 if(error) throw new Error('Bingo storage is not configured yet.');
 return (data||[]).filter((item:any)=>Array.isArray(item.board));
}
async function savedEvent(client:any,row:any) {
 const snapshot=await nflWeek(client,Number(row.season),Number(row.week));
 const game=snapshot.games.find((item:any)=>item.id===row.event_id);
 return game?{game,board:row.board}:null;
}
function serialize(game:any,stats:any,board:string[]|null) {
 const cards=bingoCatalog(game);const completed=stats?completedCardIds(game,stats):[];const lines=board?.length===25?linesFor(board,completed):[];
 return {event:{id:game.id,season:game.season,week:game.week,kickoff:game.kickoff,home:game.home,away:game.away,status:stats?.final?'final':game.status,detail:stats?.detail||game.detail},cards:cards.map((card:any)=>({id:card.id,team:card.team,label:card.label,complete:completed.includes(card.id)})),board:board||[],completed,lines,locked:Date.parse(game.kickoff)<=Date.now(),updatedAt:stats?.updatedAt||null};
}

export async function GET(request:Request) {
 try {
  const {client,user}=await userFor(request);const url=new URL(request.url);const boards=await savedBoards(client,user.id);const requested=url.searchParams.get('event');const recap=url.searchParams.get('recap')==='1';
  const row=requested?boards.find((item:any)=>item.event_id===requested):boards[0];
  const saved=row?await savedEvent(client,row):null;
  // Events are opt-in. We never create a new Monday Night board just because the calendar changed.
  const isRecent=saved&&Date.now()-Date.parse(saved.game.kickoff)<=36*60*60_000;
  if(!saved||(!requested&&!recap&&!isRecent)) return NextResponse.json({event:null,cards:[],board:[],completed:[],lines:[],locked:true,updatedAt:null,statsError:'',history:boards.map((item:any)=>({eventId:item.event_id,season:item.season,week:item.week,updatedAt:item.updated_at}))},{headers:{'Cache-Control':'no-store'}});
  let stats=null;let statsError='';try{stats=await liveBingoStats(saved.game);}catch{statsError='Live game statistics are temporarily unavailable. Pull to refresh and try again.';}
  return NextResponse.json({...serialize(saved.game,stats,saved.board),statsError,history:boards.map((item:any)=>({eventId:item.event_id,season:item.season,week:item.week,updatedAt:item.updated_at}))},{headers:{'Cache-Control':'no-store'}});
 } catch(error) {return NextResponse.json({error:error instanceof Error?error.message:'Unable to load Bingo.'},{status:400});}
}

export async function POST(request:Request) {
 try {
  const {client,user}=await userFor(request);const input=await request.json();const {game}=await featuredEvent(client);
  if(Date.parse(game.kickoff)<=Date.now()) throw new Error('Boards lock at kickoff.');
  const board=input?.board;
  if(!Array.isArray(board)||board.length!==25||board[12]!=='free') throw new Error('Build a 5×5 board with the Free Space in the middle.');
  const available=new Set(bingoCatalog(game).map((card:any)=>card.id));const chosen=board.filter((item:any)=>item!=='free');
  if(chosen.length!==24||new Set(chosen).size!==24||chosen.some((item:any)=>!available.has(item))) throw new Error('Choose 24 different Bingo squares.');
  const teamCounts={home:chosen.filter((id:any)=>id.startsWith('home:')).length,away:chosen.filter((id:any)=>id.startsWith('away:')).length,game:chosen.filter((id:any)=>id.startsWith('game:')).length};
  if(teamCounts.home!==10||teamCounts.away!==10||teamCounts.game!==4) throw new Error('Choose exactly 10 squares for each team and 4 game squares.');
  const {error}=await client.from('hq_bingo_boards').upsert({user_id:user.id,event_id:game.id,season:game.season,week:game.week,board,updated_at:new Date().toISOString()},{onConflict:'user_id,event_id'});
  if(error) throw new Error('Your Bingo board could not be saved.');
  let stats=null;try{stats=await liveBingoStats(game);}catch{}
  return NextResponse.json(serialize(game,stats,board));
 } catch(error) {return NextResponse.json({error:error instanceof Error?error.message:'Unable to save your Bingo board.'},{status:400});}
}
