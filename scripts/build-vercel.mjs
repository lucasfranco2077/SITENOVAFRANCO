import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const input=root, output=path.join(root,'public-vercel');
if(path.dirname(output)!==root || path.basename(output)!=='public-vercel' || (fs.existsSync(output)&&fs.lstatSync(output).isSymbolicLink())) throw Error('Unsafe output path');
const pending=['index.html','galeria.html','previa-celular.html','privacidade.html','robots.txt','sitemap.xml'];
const files=new Map();
const allowed=new Set(['.html','.css','.js','.svg','.png','.jpg','.jpeg','.webp','.woff','.woff2','.ttf','.ico','.txt','.xml']);
function local(ref,from){
 ref=ref.replaceAll('&amp;','&').trim();
 if(!ref||ref.startsWith('#')||/^(?:https?:|tel:|mailto:|data:)/i.test(ref))return;
 if(/^[a-z][a-z\d+.-]*:|^\/\//i.test(ref))throw Error('Unsupported reference in '+from);
 ref=ref.split(/[?#]/)[0];
 const target=path.posix.normalize(ref.startsWith('/')?ref.slice(1):path.posix.join(path.posix.dirname(from),ref)).replace(/\/+$/,'');
 let file=target==='.'||target===''?'index.html':target;
 if(file.startsWith('..')||file.split('/').some(x=>x.startsWith('.')))throw Error('Private or traversal path in '+from);
 if(!path.posix.extname(file))file+='.html';
 if(!allowed.has(path.posix.extname(file)))throw Error('Disallowed file type '+file);
 pending.push(file);
}
while(pending.length){
 const file=pending.shift(); if(files.has(file))continue;
 const full=path.resolve(input,file);
 if(!full.startsWith(input+path.sep)||!fs.existsSync(full)||fs.lstatSync(full).isSymbolicLink())throw Error('Missing or unsafe asset: '+file);
 const buffer=fs.readFileSync(full); files.set(file,buffer);
 if(/\.(html|svg|css)$/.test(file)){
  const text=buffer.toString('utf8');
  if(file.endsWith('.html')){
   for(const m of text.matchAll(/\b(?:src|href|data-image)\s*=\s*["']([^"']+)["']/gi))local(m[1],file);
   for(const m of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi))for(const item of m[1].split(','))local(item.trim().split(/\s+/)[0],file);
  }
  if(file.endsWith('.css'))for(const m of text.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)){
   if(/^(?:https?:)?\/\//i.test(m[1]))throw Error('Remote CSS dependency: '+file);
   local(m[1],file);
  }
  if(file.endsWith('.svg')&&/<script\b|\bon[a-z]+\s*=|<foreignObject\b|(?:href|xlink:href)\s*=\s*["'](?:https?:|javascript:|\/\/)/i.test(text))throw Error('Active SVG: '+file);
 }
}
// Replace only this generated build directory, never the source tree.
fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
for(const [file,buffer] of files){const dest=path.join(output,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,buffer);}
console.log(JSON.stringify({files:files.size,bytes:[...files.values()].reduce((n,b)=>n+b.length,0),output:'public-vercel'},null,2));
