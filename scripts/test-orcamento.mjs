import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validateQuote,buildMessage,createWhatsAppUrl} from '../assets/js/orcamento.js';
const valid={name:'Cliente Teste',phone:'(21) 96999-9737',region:'Recreio',property:'Apartamento',service:'Reforma parcial',description:'Pintar sala e trocar o piso.\nÁrea de 40 m².',timeline:'Em 30 dias'};
let checks=0;
function test(label,fn){fn();checks++;console.log('PASS',label);}
test('required fields',()=>{const r=validateQuote({});assert.deepEqual(Object.keys(r.errors).sort(),['name','phone','region']);});
test('valid complete input',()=>assert.equal(validateQuote(valid).valid,true));
test('minimal valid input',()=>assert.equal(validateQuote({name:'João Silva',phone:'2133334444',region:'Centro'}).valid,true));
test('accented names and punctuation',()=>assert.equal(validateQuote({...valid,name:"Ana D’Ávila-Souza"}).valid,true));
test('country code',()=>assert.equal(validateQuote({...valid,phone:'+55 (21) 96999-9737'}).valid,true));
for(const [field,value] of [['name','<img src=x onerror=alert(1)>'],['region','<script>alert(1)</script>'],['description','<svg onload=alert(1)>'],['phone','javascript:alert(1)'],['name','Cliente'],['phone','123'],['region','   '],['property','<script>'],['service','inexistente'],['timeline','inexistente'],['region','Centro\nNome: Outro']]){
 test('reject '+field+' invalid input '+checks,()=>assert.ok(validateQuote({...valid,[field]:value}).errors[field]));
}
for(const [field,max] of [['name',100],['phone',20],['region',100],['description',1000]])test(field+' length bound',()=>assert.ok(validateQuote({...valid,[field]:'a'.repeat(max+1)}).errors[field]));
test('description at bound',()=>assert.equal(validateQuote({...valid,description:'a'.repeat(1000)}).valid,true));
test('fixed HTTPS destination and encoding',()=>{const input={...valid,description:'Quero pintura & piso? 50% + acabamento #sala 😊'};const u=new URL(createWhatsAppUrl(input));assert.equal(u.origin,'https://wa.me');assert.equal(u.pathname,'/5521969999737');assert.equal(u.searchParams.get('text'),buildMessage(input));assert.equal([...u.searchParams].length,1);assert.equal(u.hash,'');assert.ok(createWhatsAppUrl(input).includes(encodeURIComponent('50% +')));});
test('invalid inputs never produce navigation URL',()=>assert.throws(()=>createWhatsAppUrl({...valid,phone:'123'})));
// Browser integration harness: exercises submit and events without contacting WhatsApp.
const source=fs.readFileSync(new URL('../assets/js/orcamento.js',import.meta.url),'utf8').replaceAll('export function ','function ');
function mount(input){
 const listeners={},events=[],navigations=[];
 const fields=Object.fromEntries(['name','phone','region','property','service','description','timeline'].map(key=>[key,{setAttribute(){},removeAttribute(){},focus(){this.focused=true;}}]));
 const errors=Object.fromEntries(Object.keys(fields).map(k=>['#nf-error-'+k,{textContent:'',hidden:true}]));
 const status={textContent:''},button={disabled:true};
 const form={elements:{namedItem:k=>fields[k]},querySelector:s=>s==='button[type="submit"]'?button:s==='[role="alert"]'?status:errors[s],addEventListener:(k,f)=>listeners[k]=f};
 const context={document:{querySelector:()=>form,dispatchEvent:e=>events.push(e.detail),addEventListener(){}},window:{location:{assign:u=>navigations.push(u)}},CustomEvent:class{constructor(type,args){this.detail=args.detail;}},FormData:class{*[Symbol.iterator](){yield*Object.entries(input);}},URL,encodeURIComponent};
 vm.runInNewContext(source,context);
 return {submit(){listeners.submit({preventDefault(){}});},events,navigations,button,fields,status};
}
test('browser submit invalid: focused error, no navigation',()=>{const app=mount({...valid,phone:'123'});app.submit();assert.equal(app.navigations.length,0);assert.equal(app.fields.phone.focused,true);assert.ok(app.status.textContent);});
test('browser submit valid: one navigation, no PII in events',()=>{const app=mount(valid);assert.equal(app.button.disabled,false);app.submit();assert.equal(app.navigations.length,1);assert.equal(app.events.length,2);assert.equal(app.events[1].event,'whatsapp_open_requested');for(const e of app.events){assert.deepEqual(Object.keys(e).sort(),['channel','event','source','version']);const t=JSON.stringify(e);for(const v of Object.values(valid))assert.ok(!t.includes(v));assert.ok(!/sent|enviada|conversion/.test(t));}});
test('no storage, HTML sinks or tracker calls',()=>assert.ok(!/localStorage|sessionStorage|document\.cookie|innerHTML|\beval\(|fetch\(|gtag\(|dataLayer/.test(source)));
console.log('Completed:',checks,'checks');
