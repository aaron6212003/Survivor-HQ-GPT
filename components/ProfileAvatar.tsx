export function isPhotoAvatar(value?:string){return typeof value==='string'&&/^https:\/\//.test(value);}
export default function ProfileAvatar({avatar,name,className='h-12 w-12 text-xl'}:{avatar?:string;name?:string;className?:string}){
 if(isPhotoAvatar(avatar)) return <img src={avatar} alt={`${name||'User'} profile photo`} className={`${className} object-cover rounded-full border border-white/20 bg-slate-900`} />;
 return <span aria-label={`${name||'User'} avatar`} className={`grid place-items-center rounded-full border border-white/20 bg-slate-900 ${className}`}>{avatar||name?.slice(0,1).toUpperCase()||'🏈'}</span>;
}
