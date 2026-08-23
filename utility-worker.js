const CDN='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm';
let api=null; const pipes=new Map();
const post=(type,payload={})=>self.postMessage({type,...payload});
async function getPipe(direction){
  if(pipes.has(direction)) return pipes.get(direction);
  api??=await import(CDN); api.env.useBrowserCache=true; api.env.allowRemoteModels=true;
  const model=direction==='ja-en'?'Xenova/opus-mt-jap-en':'Xenova/opus-mt-en-jap';
  const promise=api.pipeline('translation',model,{dtype:'q4',device:'wasm',progress_callback(info){let p=.05;if(typeof info?.progress==='number')p=.05+Math.min(1,Math.max(0,info.progress/100))*.78;post('progress',{progress:p,detail:String(info?.file||info?.status||'翻訳モデルを端末に保存中')})}});
  pipes.set(direction,promise); try{return await promise}catch(e){pipes.delete(direction);throw e}
}
self.onmessage=async e=>{const m=e.data||{};if(m.type!=='TRANSLATE')return;try{const pipe=await getPipe(m.direction);post('progress',{progress:.88,detail:'文章を翻訳中'});const out=await pipe(String(m.text||''),{max_new_tokens:256,num_beams:3});const text=String(out?.[0]?.translation_text??out?.[0]?.generated_text??'').trim();post('result',{id:m.id,text,direction:m.direction})}catch(error){post('error',{id:m.id,message:error?.message||String(error)})}};
