const DESTINATION = 'https://wa.me/5521969999737';
const OPTIONS = Object.freeze({property:['Casa','Apartamento','Comercial'],service:['Reforma completa','Reforma parcial','Construção','Pintura','Elétrica','Hidráulica','Outros'],timeline:['Imediatamente','Em 30 dias','Em 60 dias','Apenas pesquisando']});
const LIMITS = Object.freeze({name:100,phone:20,region:100,description:1000});
const clean = value => String(value ?? '').normalize('NFC').trim();
export function validateQuote(input) {
  const data = Object.fromEntries(['name','phone','region','property','service','description','timeline'].map(key=>[key,clean(input[key])]));
  const errors = {};
  for (const [key,max] of Object.entries(LIMITS)) {
    if (key!=='description' && /[\r\n\t]/.test(data[key])) errors[key] = 'Use uma única linha neste campo.';
    else if (data[key].length > max) errors[key] = `Use no máximo ${max} caracteres.`;
    else if (/[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/u.test(data[key])) errors[key] = 'Use apenas texto, sem códigos HTML ou caracteres de controle.';
  }
  if (!data.name || !/^[\p{L}\p{M}][\p{L}\p{M} .'’-]*\s+[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u.test(data.name)) errors.name = 'Informe seu nome e sobrenome.';
  let digits=data.phone.replace(/\D/g,'');
  if (digits.length>11 && digits.startsWith('55')) digits=digits.slice(2);
  if (!/^[\d\s()+.-]+$/.test(data.phone) || !/^[1-9]\d(?:9\d{8}|[2-5]\d{7})$/.test(digits)) errors.phone='Informe um telefone válido com DDD, como (21) 96999-9737.';
  if (!data.region) errors.region='Informe o bairro ou a região da obra.';
  for(const [key,values] of Object.entries(OPTIONS)) if(data[key] && !values.includes(data[key])) errors[key]='Selecione uma das opções disponíveis.';
  return {data,errors,valid:Object.keys(errors).length===0};
}
export function buildMessage(input) {
  const result=validateQuote(input);
  if(!result.valid) throw new Error('Dados de orçamento inválidos.');
  const d=result.data;
  return ['Olá, NOVA FRANCO! Gostaria de solicitar um orçamento.','','Nome: '+d.name,'Telefone com DDD: '+d.phone,'Bairro ou região: '+d.region,'Tipo de imóvel: '+(d.property||'Não informado'),'Serviço desejado: '+(d.service||'Não informado'),'Prazo para iniciar: '+(d.timeline||'Não informado'),'','Descrição da obra:',d.description||'Não informada'].join('\n');
}
export function createWhatsAppUrl(input) { return DESTINATION+'?text='+encodeURIComponent(buildMessage(input)); }
function emit(event,source) {
  // Local integration hook only: no network, analytics SDK or personal values.
  document.dispatchEvent(new CustomEvent('nf:quote-event',{detail:Object.freeze({event,source,channel:'whatsapp',version:1})}));
}
if(typeof document!=='undefined') {
  const form=document.querySelector('#nf-quote-form');
  if(form) {
    const button=form.querySelector('button[type="submit"]');
    const status=form.querySelector('[role="alert"]');
    button.disabled=false;
    form.addEventListener('submit',event=>{
      event.preventDefault();
      emit('quote_cta_click','quote_form');
      const input=Object.fromEntries(new FormData(form));
      const result=validateQuote(input);
      for(const key of ['name','phone','region','property','service','description','timeline']) {
        const field=form.elements.namedItem(key);
        const error=form.querySelector('#nf-error-'+key);
        const message=result.errors[key]||'';
        field.setAttribute('aria-invalid',String(Boolean(message)));
        error.textContent=message;
        error.hidden=!message;
      }
      if(!result.valid) {
        status.textContent='Confira os campos destacados antes de continuar.';
        form.elements.namedItem(Object.keys(result.errors)[0]).focus();
        return;
      }
      status.textContent='';
      const url=createWhatsAppUrl(result.data);
      emit('whatsapp_open_requested','quote_form');
      // Navigation request is not proof that WhatsApp opened or a message was sent.
      window.location.assign(url);
    });
    form.addEventListener('input',event=>{
      const key=event.target.name;
      if(!key)return;
      const error=form.querySelector('#nf-error-'+key);
      if(error){error.textContent='';error.hidden=true;event.target.removeAttribute('aria-invalid');}
      status.textContent='';
    });
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href]');
    if(!link)return;
    const url=new URL(link.href,window.location.href);
    if(url.origin==='https://wa.me' && url.pathname==='/5521969999737') {
      emit('quote_cta_click','direct_link');
      emit('whatsapp_open_requested','direct_link');
    }
  });
}
