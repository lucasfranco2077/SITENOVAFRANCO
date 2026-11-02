
const device=document.querySelector('.device');const frame=document.querySelector('iframe');const status=document.querySelector('.dimensions');const buttons=[...document.querySelectorAll('[data-width]')];
buttons.forEach(button=>button.addEventListener('click',()=>{device.style.setProperty('--phone-width',button.dataset.width+'px');buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));
new ResizeObserver(entries=>{status.textContent='Largura da página: '+Math.round(entries[0].contentRect.width)+' px';}).observe(frame);
frame.addEventListener('load',()=>{try{frame.contentDocument.querySelectorAll('a[href]').forEach(link=>{const href=link.getAttribute('href');if(/^(https?:|tel:|mailto:)/i.test(href)&&link.origin!==location.origin){link.target='_blank';link.rel='noopener';}});}catch(error){}});
