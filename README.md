# Magic Beauty — Landing

Landing tipo vitrina de servicios con botón a WhatsApp para **Magic Beauty**,
salón de belleza y barbería en San Miguel, Santiago. Una página, sin servidor
ni base de datos: rápida, barata de hospedar y fácil de mantener.

**Stack:** HTML + Tailwind (CDN) + JavaScript vanilla, organizado por responsabilidad.

---

## Árbol de archivos

```
magic-beauty/
├── index.html                      Estructura de la página (HTML puro)
├── css/
│   └── styles.css                  Estilos propios, animaciones y micro-interacciones
├── js/
│   ├── tailwind.config.js          Colores y tipografías de la marca (config Tailwind)
│   └── main.js                     Lógica: config, formulario WhatsApp, efectos
├── og-image.jpg                    Imagen para compartir en redes (pendiente)
├── .gitignore
├── Magic Beauty.md                 Auditoría comercial / fuente de la información
└── README.md                       Esta guía
```

Cada archivo tiene **una sola responsabilidad**. Para tocar estilos: `css/styles.css`.
Para cambiar datos o lógica: `js/main.js`. Para cambiar el HTML: `index.html`.

---

## 1. Qué reemplazar / confirmar antes de publicar

| Qué | Archivo | Cómo |
|-----|---------|------|
| Número de WhatsApp | `js/main.js` → `CONFIG.whatsapp` | Solo dígitos con código país. Hoy: `56931102183` |
| Instagram | `js/main.js` → `CONFIG.instagram` | Sin `@`. Hoy: `salon.magic_beauty` |
| Facebook | `js/main.js` → `CONFIG.facebook` | URL completa del perfil |
| Fotos del salón | `index.html` → bloques `photo-slot` | Hoy en blanco (placeholder). Reemplazar por fotos reales comprimidas (TinyPNG / Squoosh) |
| Precios | — | El salón los confirma. **No se inventan** |
| Imagen para compartir | `og-image.jpg` en la raíz | Foto cuadrada ~1200×630 px |

> **Regla de oro:** nunca se publican fotos, precios ni textos inventados.
> Las imágenes están **en blanco** (placeholders) a la espera del material real.

### Datos del negocio (desde `Magic Beauty.md`)

- **Dirección:** Brigadier de La Cruz 1076, San Miguel, Región Metropolitana, Chile.
- **Teléfono:** +56 9 3110 2183.
- **Horario:** Mar–Vie 11:30–20:00 · Sáb 11:00–19:00 · Dom y Lun cerrado (sujeto a confirmación).
- **Servicios:** Peluquería · Barbería · Tratamientos capilares · Estética · Eventos.

---

## 2. Orden de carga (importante)

El `index.html` carga los scripts en este orden — no modificar:

1. `https://cdn.tailwindcss.com` → motor de Tailwind
2. `js/tailwind.config.js` → colores y tipografías de marca
3. `css/styles.css` → estilos propios (encima de Tailwind)
4. `js/main.js` → lógica (al final del `<body>`)

---

## 3. Cómo publicar (Vercel, hosting gratis)

1. Crea un repositorio en **GitHub** y sube toda la carpeta.
2. En **Vercel** → "Add New → Project" → importa el repo.
   Es un sitio estático: no requiere configuración de build.
3. Deploy. Vercel entrega una URL `*.vercel.app` para revisar.

---

## 4. Checklist QA antes de entregar

- [ ] Se ve bien en celular y en desktop (Chrome DevTools → responsive).
- [ ] El botón de WhatsApp abre el chat con el mensaje pre-armado.
- [ ] El formulario valida campos obligatorios y exige elegir un servicio.
- [ ] Los links de Instagram y Facebook apuntan a los perfiles reales.
- [ ] Horarios y dirección coinciden con los datos confirmados por el salón.
- [ ] Fotos reales reemplazando los `photo-slot`; sin precios inventados.
- [ ] `og-image.jpg` presente (se ve al compartir el link en redes).

---

## Fuera de alcance (proyecto aparte)

Automatizaciones de WhatsApp, reserva automatizada, base de datos de clientes y
recordatorios. No están en esta landing; se cotizan por separado. Ver
`Magic Beauty.md` para la auditoría comercial completa y el plan de crecimiento.
