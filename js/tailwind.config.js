/* ============================================================
   Magic Beauty — Configuración de Tailwind CSS (Play CDN)
   Archivo: js/tailwind.config.js

   Define los colores y tipografías de la marca para poder usarlos
   como clases utilitarias de Tailwind (ej: bg-ink, text-gold, font-display).

   ORDEN DE CARGA (ver index.html):
     1. <script src="https://cdn.tailwindcss.com">  carga el motor
     2. <script src="js/tailwind.config.js">         aplica esta config
     3. <link rel="stylesheet" href="css/styles.css"> estilos propios encima

   Si en el futuro se migra a Tailwind compilado (sin CDN), mover estas
   opciones a tailwind.config.cjs en la raíz del proyecto.
   ============================================================ */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink:    '#121110',  // negro base (fondo)
        char:   '#1B1917',  // carbón (tarjetas y paneles)
        gold:   '#C9A24B',  // dorado (acentos y botones primarios)
        goldlt: '#E3C77A',  // dorado claro (énfasis de texto)
        cream:  '#F4EFE7',  // crema (texto principal)
        warm:   '#B8AE9E',  // gris cálido (texto secundario)
        hair:   '#2A2724'   // casi negro (líneas / bordes)
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],          // títulos y logotipo
        sans:    ['Montserrat', 'system-ui', 'sans-serif'] // cuerpo y UI
      }
    }
  }
};
