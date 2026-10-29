const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter; if (!card.hidden) count++; });
  document.querySelector('.nf-result-count').textContent = count + (count === 1 ? ' referência' : ' referências');
}));
const dialog = document.querySelector('.nf-image-dialog');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  const image = dialog.querySelector('img'); image.src = button.dataset.image; image.alt = button.querySelector('img').alt;
  dialog.querySelector('h2').textContent = button.dataset.title; dialog.showModal();
}));
dialog.querySelector('.nf-dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
