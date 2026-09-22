import { NextResponse } from 'next/server';
import { getTeamByCode } from '@/lib/db';

export const revalidate = 1800;

type Story={title:string;source:string;publishedAt:string;url:string};
const clean=(value:string)=>value.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/<[^>]*>/g,'').trim();
const tag=(block:string,name:string)=>{const match=block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'));return match?clean(match[1]):''};
function stories(xml:string):Story[]{return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)).slice(0,5).map(match=>{const item=match[1];const raw=tag(item,'title');const split=raw.lastIndexOf(' - ');const title=split>0?raw.slice(0,split):raw;const source=split>0?raw.slice(split+3):'News';return {title,source,publishedAt:tag(item,'pubDate'),url:tag(item,'link')};}).filter(story=>story.title&&story.url)}

export async function GET(_:Request,{params}:{params:{code:string}}){
 const team=getTeamByCode(params.code.toUpperCase());
 if(!team)return NextResponse.json({error:'Team not found'},{status:404});
 try{
  const query=encodeURIComponent(`\"${team.name}\" NFL`);
  const response=await fetch(`https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`,{next:{revalidate:1800},headers:{'User-Agent':'PickemHQ/1.0'}});
  if(!response.ok)throw new Error('News feed unavailable');
  return NextResponse.json({team:team.code,stories:stories(await response.text()),updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'public, s-maxage=1800, stale-while-revalidate=3600'}});
 }catch{return NextResponse.json({team:team.code,stories:[],updatedAt:null},{headers:{'Cache-Control':'public, s-maxage=300'}})}
}
