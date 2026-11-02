import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const target=new URL(process.argv[2]||'https://www.novafranco.com.br');
if(target.protocol!=='https:'||target.username||target.password)throw Error('Use an HTTPS origin without credentials');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const headers=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).headers[0].headers;
let failures=0;
for(const [route,expected] of [['/',200],['/galeria',200],['/privacidade',200],['/previa-celular',200],['/assets/js/nova-franco.js',200],['/.env',404],['/.git/config',404],['/scripts/build-vercel.mjs',404],['/does-not-exist',404]]){
 try{
  const response=await fetch(new URL(route,target.origin),{signal:AbortSignal.timeout(15000)});
  if(new URL(response.url).protocol!=='https:'||response.status!==expected)throw Error('Unexpected HTTP status or protocol');
  for(const header of headers){
   const value=response.headers.get(header.key);
   if(header.key==='Strict-Transport-Security'){
    if(!value||Number(value.match(/max-age=(\d+)/)?.[1])<31536000)throw Error('Missing or weak HSTS');
   }else if(value!==header.value)throw Error('Header mismatch: '+header.key);
  }
  console.log('PASS',route,response.status);
 }catch(error){failures++;console.log('FAIL',route,error.message);}
}
process.exitCode=failures?1:0;
