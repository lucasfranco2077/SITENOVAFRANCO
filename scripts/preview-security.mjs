// Local verification harness. Vercel must still be checked after deployment.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'public-vercel');
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
const server=http.createServer((req,res)=>{
 for(const h of config.headers[0].headers)res.setHeader(h.key,h.value);
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(pathname.split('/').some(x=>x.startsWith('.'))||pathname.includes('\\')){res.writeHead(404);res.end();return;}
 if(pathname.endsWith('.html')){res.writeHead(308,{Location:pathname==='/index.html'?'/':pathname.slice(0,-5)});res.end();return;}
 let file=pathname==='/'?'index.html':pathname.slice(1);
 if(!path.extname(file))file+='.html';
 const full=path.resolve(output,file);
 if(!full.startsWith(output+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',types[path.extname(full)]||'application/octet-stream');res.writeHead(200);
 res.end(req.method==='HEAD'?undefined:fs.readFileSync(full));
});
server.listen(4173,'127.0.0.1',()=>console.log('Local security preview: http://127.0.0.1:4173'));
