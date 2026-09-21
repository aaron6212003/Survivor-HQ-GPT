import {NextResponse} from 'next/server';
import {adminClient} from '@/lib/hq/server.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
const MAX_BYTES=2*1024*1024;
export async function POST(req:Request){
 try{
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/,'');if(!token)return NextResponse.json({error:'Please sign in to continue.'},{status:401});
  const client=adminClient();const {data,error}=await client.auth.getUser(token);if(error||!data.user)return NextResponse.json({error:'Your session has expired. Please sign in again.'},{status:401});
  const form=await req.formData();const image=form.get('image');if(!(image instanceof File))throw new Error('Choose an image file.');
  if(!['image/jpeg','image/png','image/webp'].includes(image.type))throw new Error('Use a JPG, PNG, or WebP image.');
  if(image.size>MAX_BYTES)throw new Error('Choose an image smaller than 2 MB.');
  const extension=image.type==='image/png'?'png':image.type==='image/webp'?'webp':'jpg';const path=`${data.user.id}/profile.${extension}`;
  const upload=await client.storage.from('profile-photos').upload(path,image,{upsert:true,contentType:image.type,cacheControl:'3600'});if(upload.error)throw new Error('Photo storage is not ready yet. Run the latest Supabase migration, then try again.');
  const {data:url}=client.storage.from('profile-photos').getPublicUrl(path);
  return NextResponse.json({avatar:`${url.publicUrl}?v=${Date.now()}`});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to upload photo.'},{status:400});}
}
