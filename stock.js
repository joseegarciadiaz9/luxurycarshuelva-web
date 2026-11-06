/* Luxury Cars Huelva — stock de coches.
   Lo usan la web pública (index, coches, coche) y el panel (panel/).

   Sin SUPABASE_URL funciona en MODO DEMOSTRACIÓN: el stock vive en el navegador
   (localStorage) y arranca con los coches de ejemplo de SEED.
   Con SUPABASE_URL y SUPABASE_KEY (la clave pública "anon") lee y escribe en la
   base de datos real. Ver backend/LEEME.md. */

const LCH = (() => {
  const CONFIG = {
    SUPABASE_URL: '',
    SUPABASE_KEY: '',
    BUCKET: 'fotos',
    PHONE: '634814264',
    WHATSAPP: '34634814264',
    EMAIL: 'luxurycarshuelva@gmail.com',
  };

  const DEMO = !CONFIG.SUPABASE_URL;
  // Los coches de ejemplo solo se ven en local (localhost). Publicada y sin base de datos, el stock sale vacío.
  const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
  const KEY = 'lch-demo-stock-v2';
  const ESTADOS = { stock: 'En stock', reservado: 'Reservado', vendido: 'Vendido', oculto: 'Oculto' };

  // Coches de ejemplo: fotos generadas con IA, precios y kilómetros inventados.
  const SEED = [
    { id: 'porsche-911-carrera-4s-2021', marca: 'Porsche', modelo: '911 Carrera 4S', version: '992 · PDK', anio: 2021, km: 38000, cv: 450, combustible: 'Gasolina', cambio: 'Automático', color: 'Gris tiza', precio: 124900, estado: 'stock', destacado: true,
      descripcion: 'Un único propietario, mantenimiento en servicio oficial Porsche y libro al día. Escape deportivo, Sport Chrono y asientos deportivos Plus.',
      extras: ['Sport Chrono', 'Escape deportivo', 'Bose', 'Cámara trasera', 'Faros LED Matrix'], fotos: ['img/porsche-911.webp', 'img/porsche-911-2.webp'] },
    { id: 'mercedes-amg-g63-2021', marca: 'Mercedes-AMG', modelo: 'G 63', version: '4MATIC', anio: 2021, km: 52000, cv: 585, combustible: 'Gasolina', cambio: 'Automático', color: 'Negro obsidiana', precio: 159900, estado: 'stock', destacado: true,
      descripcion: 'Paquete AMG Night, llantas de 22 pulgadas y techo solar. Matriculado y listo para conducir.',
      extras: ['AMG Night', 'Llantas 22"', 'Techo solar', 'Burmester', 'Asientos ventilados'], fotos: ['img/amg-g63.webp', 'img/amg-g63-2.webp'] },
    { id: 'bmw-m4-competition-2022', marca: 'BMW', modelo: 'M4 Competition', version: 'Coupé', anio: 2022, km: 24000, cv: 510, combustible: 'Gasolina', cambio: 'Automático', color: 'Verde Isle of Man', precio: 84900, estado: 'reservado', destacado: true,
      descripcion: 'Paquete M Carbon, asientos M de carbono y Laserlight. Garantía oficial BMW vigente.',
      extras: ['Asientos M Carbon', 'Laserlight', 'Harman Kardon', 'Head-Up Display'], fotos: ['img/bmw-m4.webp', 'img/bmw-m4-2.webp'] },
    { id: 'audi-rs6-avant-2021', marca: 'Audi', modelo: 'RS 6 Avant', version: 'quattro', anio: 2021, km: 61000, cv: 600, combustible: 'Gasolina (MHEV)', cambio: 'Automático', color: 'Gris Nardo', precio: 98500, estado: 'stock', destacado: false,
      descripcion: 'Paquete Dynamic Plus con 305 km/h, frenos cerámicos y suspensión DRC.',
      extras: ['Dynamic Plus', 'Frenos cerámicos', 'Bang & Olufsen', 'Techo panorámico'], fotos: ['img/audi-rs6.webp', 'img/audi-rs6-2.webp'] },
    { id: 'range-rover-sport-2023', marca: 'Land Rover', modelo: 'Range Rover Sport', version: 'P440e Autobiography', anio: 2023, km: 29000, cv: 440, combustible: 'Híbrido enchufable', cambio: 'Automático', color: 'Azul Varesine', precio: 104900, estado: 'stock', destacado: false,
      descripcion: 'Etiqueta CERO, unos 100 km en eléctrico. Suspensión neumática y Meridian.',
      extras: ['Etiqueta CERO', 'Suspensión neumática', 'Meridian', 'Head-Up Display'], fotos: ['img/range-rover-sport.webp', 'img/range-rover-sport-2.webp'] },
    { id: 'lamborghini-urus-2020', marca: 'Lamborghini', modelo: 'Urus', version: '4.0 V8', anio: 2020, km: 47000, cv: 650, combustible: 'Gasolina', cambio: 'Automático', color: 'Giallo Auge', precio: 189000, estado: 'stock', destacado: true,
      descripcion: 'Interior en dos tonos, Bang & Olufsen 3D y llantas de 23 pulgadas.',
      extras: ['Llantas 23"', 'B&O 3D', 'Techo panorámico', 'Night Vision'], fotos: ['img/lamborghini-urus.webp', 'img/lamborghini-urus-2.webp'] },
    { id: 'porsche-cayenne-coupe-2022', marca: 'Porsche', modelo: 'Cayenne Coupé', version: 'E-Hybrid', anio: 2022, km: 33000, cv: 470, combustible: 'Híbrido enchufable', cambio: 'Automático', color: 'Blanco', precio: 92900, estado: 'vendido', destacado: false,
      descripcion: 'Encargo de un cliente de Sevilla: lo buscamos con sus extras exactos y se lo entregamos matriculado.',
      extras: ['Etiqueta CERO', 'Paquete Sport Design', 'Bose'], fotos: ['img/porsche-cayenne.webp', 'img/porsche-cayenne-2.webp'] },
    { id: 'mercedes-amg-gt63s-2020', marca: 'Mercedes-AMG', modelo: 'GT 63 S', version: '4 puertas Coupé', anio: 2020, km: 58000, cv: 639, combustible: 'Gasolina', cambio: 'Automático', color: 'Plata high-tech', precio: 109900, estado: 'stock', destacado: false,
      descripcion: 'Paquete AMG Dynamic Plus, escape de válvulas y Burmester High-End.',
      extras: ['Dynamic Plus', 'Burmester High-End', 'Escape AMG', 'Asientos con masaje'], fotos: ['img/amg-gt63s.webp', 'img/amg-gt63s-2.webp'] },
  ];

  /* ---------- utilidades ---------- */
  const eur = n => (n || n === 0) ? new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(n) + ' €' : 'Consultar';
  const num = n => new Intl.NumberFormat('es-ES').format(n || 0);
  const slug = c => [c.marca, c.modelo, c.anio].join(' ').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const titulo = c => `${c.marca} ${c.modelo}`;
  const wa = text => `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(text)}`;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  /* ---------- aviso entre pestañas (la web se actualiza al guardar en el panel) ---------- */
  const listeners = [];
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('lch-stock') : null;
  const emit = () => { bc && bc.postMessage('changed'); listeners.forEach(f => f()); };
  bc && (bc.onmessage = () => listeners.forEach(f => f()));
  window.addEventListener('storage', e => { if (e.key === KEY) listeners.forEach(f => f()); });
  const onChange = f => listeners.push(f);

  /* ---------- modo demostración ---------- */
  const demoRead = () => {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s)) return s; } catch (e) {}
    return SEED.map((c, i) => ({ ...c, orden: i }));
  };
  const demoWrite = list => {
    try { localStorage.setItem(KEY, JSON.stringify(list)); }
    catch (e) { throw new Error('No caben más fotos en la demo del navegador. En la versión real no hay este límite.'); }
  };

  // Reduce la foto en el navegador antes de guardarla o subirla.
  const shrink = (file, max = 1600, q = 0.82) => new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob(b => b ? ok(b) : ko(new Error('No se pudo leer la foto')), 'image/jpeg', q);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => ko(new Error('Ese archivo no es una imagen'));
    img.src = URL.createObjectURL(file);
  });
  const blobToDataURL = b => new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); });

  /* ---------- Supabase ---------- */
  let sb = null;
  const client = async () => {
    if (sb) return sb;
    if (!window.supabase) await new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
      s.onload = ok; s.onerror = () => ko(new Error('No se pudo conectar con la base de datos'));
      document.head.appendChild(s);
    });
    sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    return sb;
  };
  const check = ({ data, error }) => { if (error) throw new Error(error.message); return data; };

  /* ---------- API ---------- */
  async function list({ todos = false } = {}) {
    let cars;
    if (DEMO) cars = LOCAL ? demoRead() : [];
    else {
      const db = await client();
      let q = db.from('coches').select('*').order('orden').order('created_at', { ascending: false });
      if (!todos) q = q.neq('estado', 'oculto');
      cars = check(await q);
    }
    if (!todos) cars = cars.filter(c => c.estado !== 'oculto');
    return cars.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  }

  async function get(id) {
    if (DEMO) return LOCAL ? demoRead().find(c => c.id === id) || null : null;
    const db = await client();
    return check(await db.from('coches').select('*').eq('id', id).maybeSingle());
  }

  async function save(car) {
    const c = { ...car };
    ['anio', 'km', 'cv', 'precio'].forEach(k => c[k] = c[k] === '' || c[k] == null ? null : Number(c[k]));
    if (!c.id) c.id = slug(c);
    if (DEMO) {
      const all = demoRead();
      const i = all.findIndex(x => x.id === (car._oldId || c.id));
      delete c._oldId;
      if (i >= 0) all[i] = { ...all[i], ...c };
      else { if (all.some(x => x.id === c.id)) c.id += '-' + Date.now().toString(36).slice(-4); all.unshift({ ...c, orden: Math.min(0, ...all.map(x => x.orden ?? 0)) - 1 }); }
      demoWrite(all); emit(); return c;
    }
    delete c._oldId;
    const db = await client();
    const saved = check(await db.from('coches').upsert(c).select().single());
    emit(); return saved;
  }

  async function remove(id) {
    if (DEMO) { demoWrite(demoRead().filter(c => c.id !== id)); emit(); return; }
    const db = await client();
    check(await db.from('coches').delete().eq('id', id));
    emit();
  }

  async function reorder(ids) {
    if (DEMO) {
      const all = demoRead();
      ids.forEach((id, i) => { const c = all.find(x => x.id === id); if (c) c.orden = i; });
      demoWrite(all); emit(); return;
    }
    const db = await client();
    await Promise.all(ids.map((id, i) => db.from('coches').update({ orden: i }).eq('id', id)));
    emit();
  }

  async function uploadPhoto(file, carId = 'coche') {
    if (DEMO) return blobToDataURL(await shrink(file, 1100, 0.72));
    const blob = await shrink(file);
    const db = await client();
    const path = `${carId}/${Date.now().toString(36)}.jpg`;
    check(await db.storage.from(CONFIG.BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: false }));
    return db.storage.from(CONFIG.BUCKET).getPublicUrl(path).data.publicUrl;
  }

  /* ---------- acceso al panel ---------- */
  const SESSION = 'lch-demo-session';
  async function login(email, password) {
    if (DEMO) { sessionStorage.setItem(SESSION, email || 'demo'); return { email: email || 'demo' }; }
    const db = await client();
    return check(await db.auth.signInWithPassword({ email, password })).user;
  }
  async function user() {
    if (DEMO) { const e = sessionStorage.getItem(SESSION); return e ? { email: e } : null; }
    const db = await client();
    return (await db.auth.getUser()).data.user;
  }
  async function logout() {
    if (DEMO) { sessionStorage.removeItem(SESSION); return; }
    await (await client()).auth.signOut();
  }

  const reset = () => { localStorage.removeItem(KEY); emit(); };

  return { CONFIG, DEMO, ESTADOS, list, get, save, remove, reorder, uploadPhoto, login, user, logout, reset, onChange, eur, num, slug, titulo, wa, esc };
})();
