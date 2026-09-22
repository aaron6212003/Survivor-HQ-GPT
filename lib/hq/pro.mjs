const OWNER_EMAIL='aaron6212003@hotmail.com';
const profileThemes=new Set(['default','blackout','midnight','ice','classic']);
const banners=new Set(['none','sideline','stadium','film-room']);
const accents=new Set(['emerald','ice','gold','crimson','violet']);
const frames=new Set(['none','line','champion','classic']);
const icons=new Set(['default','midnight','ice']);
const missing=(error)=>error?.code==='42P01';
export async function proAccess(client,user){
 const [entitlement,override]=await Promise.all([client.from('hq_user_entitlements').select('plan,active_until').eq('user_id',user.id).maybeSingle(),client.from('hq_developer_pro_overrides').select('enabled').eq('user_id',user.id).maybeSingle()]);
 if((entitlement.error&&!missing(entitlement.error))||(override.error&&!missing(override.error))) throw new Error('Pro access could not be checked.');
 const paid=entitlement.data?.plan==='pro'&&(!entitlement.data.active_until||Date.parse(entitlement.data.active_until)>Date.now());
 const owner=String(user.email||'').toLowerCase()===OWNER_EMAIL;
 const developerOverride=owner&&Boolean(override.data?.enabled);
 return {isPro:Boolean(paid||developerOverride),paid:Boolean(paid),owner,developerOverride,ready:!missing(entitlement.error)&&!missing(override.error)};
}
export async function profileCustomization(client,user){
 const {data,error}=await client.from('hq_profile_customizations').select('*').eq('user_id',user.id).maybeSingle();
 if(error){if(missing(error))return {theme:'default',banner:'none',accent:'emerald',frame:'none',app_icon:'default',badge_preferences:[]};throw new Error('Profile customization could not be loaded.');}
 return data||{theme:'default',banner:'none',accent:'emerald',frame:'none',app_icon:'default',badge_preferences:[]};
}
export async function saveProfileCustomization(client,user,input,pro){
 if(!pro.isPro) throw new Error('Pickem HQ Pro is required for profile customization.');
 const value={theme:String(input.theme||'default'),banner:String(input.banner||'none'),accent:String(input.accent||'emerald'),frame:String(input.frame||'none'),app_icon:String(input.appIcon||'default'),badge_preferences:Array.isArray(input.badges)?input.badges.slice(0,4):[],updated_at:new Date().toISOString()};
 if(!profileThemes.has(value.theme)||!banners.has(value.banner)||!accents.has(value.accent)||!frames.has(value.frame)||!icons.has(value.app_icon))throw new Error('Choose a valid Pro customization.');
 const {error}=await client.from('hq_profile_customizations').upsert({user_id:user.id,...value});if(error)throw new Error('Run the latest Pickem HQ Pro migration, then try again.');return value;
}
export async function setDeveloperOverride(client,user,enabled){
 if(String(user.email||'').toLowerCase()!==OWNER_EMAIL) throw new Error('Developer settings are not available for this account.');
 const {error}=await client.from('hq_developer_pro_overrides').upsert({user_id:user.id,enabled:Boolean(enabled),updated_at:new Date().toISOString()});if(error)throw new Error('Run the latest Pickem HQ Pro migration, then try again.');
 return proAccess(client,user);
}
export function requirePro(pro){if(!pro.isPro)throw new Error('Pickem HQ Pro is required for this feature.');}
