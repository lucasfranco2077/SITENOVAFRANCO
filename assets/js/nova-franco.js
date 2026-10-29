const toggle = document.querySelector('.nf-menu-toggle');
const navigation = document.querySelector('#nf-navigation');
function closeMenu() { toggle?.setAttribute('aria-expanded', 'false'); }
toggle?.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') !== 'true');
});
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu(); toggle.focus();
  }
});
document.addEventListener('click', event => { if (!event.target.closest('.nf-header')) closeMenu(); });

