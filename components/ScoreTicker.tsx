'use client';

import {useEffect,useState} from 'react';

type Game={id:string;status?:string;status_detail?:string;clock_display?:string;away_team?:{code?:string;logo_url?:string};home_team?:{code?:string;logo_url?:string};away_score?:number;home_score?:number};

export default function ScoreTicker(){
 const [games,setGames]=useState<Game[]>([]);
 const [label,setLabel]=useState('NFL scores');
 useEffect(()=>{let live=true;const load=async()=>{try{const res=await fetch('/api/schedule',{cache:'no-store'});const data=await res.json();if(live&&Array.isArray(data.games)){setGames(data.games);setLabel(`NFL · Week ${data.week}`);}}catch{}};void load();const timer=window.setInterval(load,30000);return()=>{live=false;window.clearInterval(timer);};},[]);
 const featured=games.filter(game=>game.status==='in_progress'||game.status==='final').concat(games.filter(game=>game.status!=='in_progress'&&game.status!=='final')).slice(0,8);
 const tickerGames=[...featured,...featured];
 return <div className="score-ticker" aria-label="NFL score ticker"><div className="score-ticker__label"><span className="score-ticker__dot"/> {label}</div><div className="score-ticker__track">{featured.length?<div className="score-ticker__marquee">{tickerGames.map((game,index)=><div className="score-ticker__game" key={`${game.id}-${index}`}><span>{game.away_team?.code}</span><strong>{game.away_score ?? 0}</strong><span className="score-ticker__at">@</span><span>{game.home_team?.code}</span><strong>{game.home_score ?? 0}</strong><em className={game.status==='in_progress'?'is-live':''}>{game.status==='in_progress'?'LIVE':game.status==='final'?'FINAL':game.status_detail||'UPCOMING'}</em></div>)}</div>:<span className="text-slate-500">Scores will appear here when the NFL schedule is available.</span>}</div></div>;
}
