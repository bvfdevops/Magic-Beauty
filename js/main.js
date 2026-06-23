/* ============================================================
   Magic Beauty — Lógica de la landing
   Archivo: js/main.js

   Secciones:
     1. CONFIG        Datos a reemplazar / confirmar antes de publicar
     2. Pie y enlaces Año dinámico y links de redes
     3. Formulario    Valida campos y abre WhatsApp con el mensaje armado
     4. Galería       Swipe táctil en la tira de fotos
     5. Destellos     Partículas doradas flotantes del fondo
     6. Scroll        Barra de progreso + hilo dorado + botón flotante
     7. Reveal        Aparición de elementos al hacer scroll

   Dependencias: no usa librerías externas. Solo DOM nativo.
   ============================================================ */


/* ==================== 1. CONFIG (REEMPLAZAR / CONFIRMAR) ==================== */
const CONFIG = {
  whatsapp:  '56931102183',                 // +56 9 3110 2183 (solo dígitos)
  instagram: 'salon.magic_beauty',          // sin @
  facebook:  'https://web.facebook.com/people/Magic-Beauty/100063835971911/'
};

/* ================================================================ */


/* ==================== 2. Pie y enlaces ==================== */
document.getElementById('year').textContent = new Date().getFullYear();

const igUrl = 'https://www.instagram.com/' + CONFIG.instagram + '/';
['ig', 'ig-foot'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = igUrl;
});
['fb', 'fb-foot'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = CONFIG.facebook;
});


/* ==================== 3. Formulario → WhatsApp ==================== */
const msgEl = document.getElementById('formMsg');

/* Fecha: mínimo hoy, máximo 2 meses desde hoy */
(function () {
  const hoy = new Date();
  const max = new Date(hoy);
  max.setMonth(max.getMonth() + 2);
  const f = document.getElementById('f_fecha');
  f.min = hoy.toISOString().split('T')[0];
  f.max = max.toISOString().split('T')[0];
})();


/* Bloquea letras en el campo teléfono, permite solo dígitos, +, espacios y guiones */
document.getElementById('f_tel').addEventListener('input', function () {
  this.value = this.value.replace(/[^\d+\s\-]/g, '');
});

document.getElementById('enviar').addEventListener('click', () => {
  const v = id => document.getElementById(id).value.trim();

  const nombre  = v('f_nombre');
  const tel     = v('f_tel');
  const fecha   = v('f_fecha');
  const horario = v('f_horario');

  /* Recoger todos los servicios marcados */
  const checkedSvcs = [...document.querySelectorAll('.f_svc:checked')].map(cb => cb.value);

  /* Validación: campos obligatorios */
  if (!nombre || !tel || checkedSvcs.length === 0 || !fecha || !horario) {
    msgEl.style.color = '#E3C77A';
    msgEl.textContent = 'Completa los campos marcados con * y elige al menos un servicio.';
    return;
  }

  /* Validación: teléfono solo dígitos (con opcional + y espacios/guiones) */
  if (!/^\+?[\d\s\-]{7,15}$/.test(tel)) {
    msgEl.style.color = '#E3C77A';
    msgEl.textContent = 'El teléfono debe contener solo números (ej: +56 9 1234 5678).';
    return;
  }

  const correo   = v('f_correo')  || '—';
  const detalle  = v('f_detalle') || '—';
  const obs      = v('f_obs')     || '—';
  const servicios = checkedSvcs.join('\n   · ');

  /* Texto del mensaje estructurado */
  const lineas = [
    '*Magic Beauty — Nueva reserva*',
    '',
    `*Nombre:* ${nombre}`,
    `*Telefono:* ${tel}`,
  ];
  if (correo !== '—') lineas.push(`*Correo:* ${correo}`);
  lineas.push('', `*Servicio(s):*\n   · ${servicios}`);
  if (detalle !== '—') lineas.push(`*Detalle:* ${detalle}`);
  lineas.push('', `*Fecha deseada:* ${fecha}`, `*Horario preferido:* ${horario}`);
  if (obs !== '—') lineas.push('', `*Observaciones:* ${obs}`);

  const texto = lineas.join('\n');

  const url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  msgEl.style.color = '#C9A24B';
  msgEl.textContent = 'Abriendo WhatsApp…';
  window.open(url, '_blank');
});


/* ==================== 4. Swipe táctil en la tira de galería ==================== */
/* (El carrusel de Servicios es CSS puro con radios: no necesita JS.) */
(function () {
  const track = document.querySelector('.strip-track');
  if (!track) return;

  let pausedByTouch = false;
  track.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
    pausedByTouch = true;
  }, { passive: true });
  track.addEventListener('touchend', () => {
    setTimeout(() => {
      if (pausedByTouch) { track.style.animationPlayState = ''; pausedByTouch = false; }
    }, 800);
  }, { passive: true });
})();


/* ==================== 4b. Visor de galería (lightbox) ==================== */
/* Al presionar un recuadro de la galería se abre ampliado. Botones de
   anterior/siguiente, contador, cierre con la X / Escape / clic en el fondo,
   y flechas del teclado. Muestra el contenido de cada recuadro (hoy el
   placeholder; cuando agregues una <img> dentro del recuadro, se verá la foto). */
(function () {
  const lb    = document.getElementById('lightbox');
  if (!lb) return;
  const stage = document.getElementById('lb-stage');
  const close = document.getElementById('lb-close');
  const prev  = document.getElementById('lb-prev');
  const next  = document.getElementById('lb-next');
  const count = document.getElementById('lb-count');

  const slots = [...document.querySelectorAll('.strip-slot')];
  /* Solo los originales (los duplicados del bucle llevan aria-hidden) */
  const originals = slots.filter(s => !s.hasAttribute('aria-hidden'));
  const N = originals.length;
  if (!N) return;

  let current = 0;

  function render() {
    stage.innerHTML = originals[current].innerHTML;
    count.textContent = (current + 1) + ' / ' + N;
  }
  function open(i) {
    current = ((i % N) + N) % N;
    render();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function shut() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function go(dir) {
    stage.classList.add('fade');
    setTimeout(() => {
      current = ((current + dir) % N + N) % N;
      render();
      stage.classList.remove('fade');
    }, 180);
  }

  slots.forEach(s => {
    s.addEventListener('click', () => open(slots.indexOf(s) % N));
  });

  close.addEventListener('click', shut);
  prev.addEventListener('click', e => { e.stopPropagation(); go(-1); });
  next.addEventListener('click', e => { e.stopPropagation(); go(1); });

  /* Clic en el fondo (fuera del visor y los botones) cierra */
  lb.addEventListener('click', e => {
    if (e.target === lb) shut();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     shut();
    if (e.key === 'ArrowLeft')  go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
})();


/* ==================== 5. Destellos flotantes ==================== */
/* Genera partículas doradas que flotan en el fondo.
   Se omite si el usuario prefiere menos movimiento (accesibilidad). */
const fx = document.querySelector('.bg-fx');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (fx && !reduceMotion) {
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    const size = (2 + Math.random() * 3).toFixed(1);
    s.style.width             = s.style.height = size + 'px';
    s.style.left              = (Math.random() * 100).toFixed(2) + 'vw';
    s.style.top               = (8 + Math.random() * 86).toFixed(2) + 'vh';
    const dur                 = 6 + Math.random() * 8;
    s.style.animationDuration = dur.toFixed(2) + 's';
    s.style.animationDelay    = (-Math.random() * dur).toFixed(2) + 's';
    fx.appendChild(s);
  }

  /* Destellos con forma (estrellas y flores) que flotan suavemente */
  const glyphs = ['✦', '✧', '❀', '✵'];
  for (let i = 0; i < 3; i++) {
    const g = document.createElement('span');
    g.className = 'sparkle-glyph';
    g.textContent = glyphs[i % glyphs.length];
    g.style.fontSize          = (14 + Math.random() * 12).toFixed(0) + 'px';
    g.style.left              = (Math.random() * 100).toFixed(2) + 'vw';
    g.style.top               = (10 + Math.random() * 84).toFixed(2) + 'vh';
    const dur                 = 9 + Math.random() * 9;
    g.style.animationDuration = dur.toFixed(2) + 's';
    g.style.animationDelay    = (-Math.random() * dur).toFixed(2) + 's';
    fx.appendChild(g);
  }
}


/* ==================== 6. Botón flotante de reserva ==================== */
/* Handler de scroll sincronizado con requestAnimationFrame para no recalcular
   más de una vez por frame: rellena el anillo del botón flotante y lo muestra
   tras bajar un poco. */
(function () {
  const fab    = document.getElementById('fab-reservar');
  const ring   = fab.querySelector('.fab-ring');
  const RING_LEN = 131.9; // perímetro del círculo r=21

  let maxScroll = 0;
  let ticking   = false;
  let fabShown  = null, fabFull = null;

  /* Mide una sola vez (y en resize): nada de lecturas de layout por frame */
  function measure() {
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    update();
  }

  function update() {
    const y = window.scrollY;
    const p = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;
    ring.style.strokeDashoffset = (RING_LEN * (1 - p)).toFixed(1);

    /* classList.toggle solo cuando el estado cambia de verdad */
    const show = y > 350;
    if (show !== fabShown) { fab.classList.toggle('show', show); fabShown = show; }
    const full = p > 0.985;
    if (full !== fabFull)  { fab.classList.toggle('full', full); fabFull = full; }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  measure();
})();


/* ==================== 7. Reveal: aparición al hacer scroll ==================== */
/* Observa todos los elementos .reveal y añade la clase .in cuando entran
   al viewport, disparando la transición definida en css/styles.css. */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
