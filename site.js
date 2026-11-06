/* Luxury Cars Huelva — piezas comunes de la web pública */
const ICON = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.5 6.5 0 0 0 1.4 3.4 14.8 14.8 0 0 0 5.6 5c2.1.9 2.9 1 4 .8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.9 17.8L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.6 1.4A11.8 11.8 0 0 0 20.4 3.6z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2"/></svg>',
};

// Tarjeta de coche para portada y listado
function carCard(c) {
  const t = LCH.esc(LCH.titulo(c));
  const estado = c.estado !== 'stock' ? `<span class="badge ${c.estado}">${LCH.ESTADOS[c.estado]}</span>` : '';
  const foto = c.fotos && c.fotos[0];
  const sample = foto && foto.startsWith('img/') ? '<span class="sample">Imagen de muestra</span>' : '';
  return `<a class="car rv is-${c.estado}" href="coche.html?id=${encodeURIComponent(c.id)}">
    <div class="ph">${estado}${foto ? `<img src="${LCH.esc(foto)}" alt="${t} ${c.anio || ''} en venta" loading="lazy">` : ''}${sample}</div>
    <div class="body">
      <h3>${t}<small>${LCH.esc(c.version || '')}</small></h3>
      <div class="specs num"><span>${c.anio || '—'}</span><span>${LCH.num(c.km)} km</span>${c.cv ? `<span>${c.cv} CV</span>` : ''}<span>${LCH.esc(c.combustible || '')}</span></div>
      <div class="foot"><span class="price num">${c.estado === 'vendido' ? 'Vendido' : LCH.eur(c.precio)}</span>${c.estado === 'vendido' ? '' : '<span class="origin">Ver ficha →</span>'}</div>
    </div></a>`;
}

// Cabecera: fondo al bajar y menú del móvil
function initTop() {
  const top = document.querySelector('.top');
  if (!top) return;
  const solid = () => top.classList.toggle('solid', scrollY > 40 || top.dataset.solid === '1');
  solid(); addEventListener('scroll', solid, { passive: true });
  const b = top.querySelector('.menu-btn');
  b && b.addEventListener('click', () => { const o = top.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  top.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => top.classList.remove('open')));
}

// Aparición suave al entrar en pantalla
let io;
function reveal(root = document) {
  io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  root.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = LCH.wa(a.dataset.wa || 'Hola, os escribo desde la web.'); a.target = '_blank'; a.rel = 'noopener'; });
  document.querySelectorAll('[data-icon]').forEach(el => el.insertAdjacentHTML('afterbegin', ICON[el.dataset.icon] || ''));
  initTop(); reveal();
});
