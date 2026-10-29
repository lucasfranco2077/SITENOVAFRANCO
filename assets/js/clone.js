document.querySelectorAll('.swiper-galleries').forEach(gallery=>{const slides=[...gallery.querySelectorAll('.swiper-slide')];let index=0;const pager=gallery.querySelector('.swiper-pagination');function show(i){index=(i+slides.length)%slides.length;slides.forEach((slide,n)=>{slide.classList.toggle('is-current',n===index);slide.setAttribute('aria-hidden',n!==index)});pager?.querySelectorAll('button').forEach((b,n)=>b.setAttribute('aria-current',n===index));}slides.forEach((s,i)=>{const b=document.createElement('button');b.className='clone-dot';b.setAttribute('aria-label','Ver transformação '+(i+1));b.onclick=()=>show(i);pager?.append(b)});[['.swiper-button-next',1],['.swiper-button-prev',-1]].forEach(([selector,dir])=>{const b=gallery.querySelector(selector);if(b){b.setAttribute('role','button');b.tabIndex=0;b.setAttribute('aria-label',dir===1?'Próxima transformação':'Transformação anterior');b.onclick=()=>show(index+dir);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(index+dir)}}}});let x;gallery.addEventListener('touchstart',e=>x=e.changedTouches[0].clientX,{passive:true});gallery.addEventListener('touchend',e=>{const d=x-e.changedTouches[0].clientX;if(Math.abs(d)>50)show(index+(d>0?1:-1))},{passive:true});show(0)});
document.querySelectorAll('form').forEach(form=>{form.removeAttribute('novalidate');form.querySelectorAll('[aria-required="true"]').forEach(i=>i.required=true);form.addEventListener('submit',e=>{e.preventDefault();let msg=form.querySelector('.clone-feedback');if(!msg){msg=document.createElement('p');msg.className='clone-feedback';msg.setAttribute('role','status');form.append(msg)}msg.textContent='Esta é uma demonstração. Seus dados não foram enviados.';msg.scrollIntoView({block:'nearest',behavior:'smooth'})})});
document.querySelector('.js-nav-toggle')?.addEventListener('click',e=>{const open=document.body.classList.toggle('nav-mobile-open');e.currentTarget.setAttribute('aria-expanded',open)});
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(b=>b.onclick=()=>{const target=document.querySelector(b.dataset.bsTarget);target?.classList.toggle('show');b.setAttribute('aria-expanded',target?.classList.contains('show'))});
document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(b=>b.onclick=()=>b.nextElementSibling?.classList.toggle('show'));
document.querySelectorAll('[data-bs-toggle="modal"]').forEach(b=>b.onclick=()=>{const m=document.querySelector(b.dataset.bsTarget);if(m){m.style.display='block';m.classList.add('show');m.removeAttribute('aria-hidden');m.setAttribute('role','dialog');m.querySelector('input')?.focus()}});
document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(b=>b.onclick=()=>{const m=b.closest('.modal');m.classList.remove('show');m.style.display='none'});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal.show').forEach(m=>{m.classList.remove('show');m.style.display='none'})});

// Keep navigation inside the local clone. Only the gallery has been copied.
document.querySelectorAll('a[href]').forEach(link=>{
  const url=new URL(link.getAttribute('href'),location.href);
  if(!/^https?:$/.test(url.protocol)||url.origin===location.origin||url.hostname==='wa.me')return;
  link.dataset.originalHref=url.href;
  link.removeAttribute('target');
  if(/^(www\.)?novafranco\.com\.br$/.test(url.hostname)&&['/','/results/before-after-gallery/'].includes(url.pathname)){
    link.setAttribute('href',url.pathname==='/'?'index.html':'galeria.html#content');
    return;
  }
  link.setAttribute('href','#');
  link.addEventListener('click',event=>{
    event.preventDefault();
    let notice=document.querySelector('#clone-navigation-notice');
    if(!notice){
      notice=document.createElement('div');
      notice.id='clone-navigation-notice';
      notice.setAttribute('role','status');
      Object.assign(notice.style,{position:'fixed',bottom:'20px',left:'50%',transform:'translateX(-50%)',zIndex:'10000',background:'#fff',color:'#333',padding:'16px 24px',boxShadow:'0 3px 20px #0003',maxWidth:'90vw',borderRadius:'8px'});
      document.body.append(notice);
    }
    notice.textContent='Esta página ainda não foi criada no clone local.';
    clearTimeout(notice.dismissTimer);
    notice.dismissTimer=setTimeout(()=>notice.remove(),4500);
  });
});
