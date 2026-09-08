# Una pequeña sorpresa · Bizarro Pariona

## Personalizar sin editar código

Abre [el creador de enlaces](https://stivenrmn99.github.io/baby-bizarro/personalizar.html), escribe el nombre y elige el parentesco, familia o amigos. Puedes escribir un mensaje opcional de hasta 240 caracteres. La vista previa muestra el texto exacto; pulsa **Copiar enlace**, **Enviar por WhatsApp** o **Probar la sorpresa**. Para otro destinatario, pulsa **Crear otro enlace**.

También puedes abrir `personalizar.html` localmente. Los enlaces para compartir apuntan al sitio público; la prueba se abre en los archivos locales. No se almacenan destinatarios. Los mensajes personalizados se incluyen en el parámetro `mensaje` de la URL y se muestran como texto en la tarjeta final, después del anuncio principal. No incluyas datos privados. Esta herramienta es pública y no necesita contraseña.

Archivos del editor: `personalizar.html`, `personalizar.css`, `personalizar.js`. La invitación y el editor comparten las plantillas de `mensajes.js`; incluye este archivo al subir el proyecto.

Una carta digital personalizada, con tonos crema y oliva, una historia de 10 segundos y una revelación que queda visible. HTML, CSS y JavaScript puros, sin instalaciones ni compilación.

## Probar localmente

Abre `index.html` con doble clic en un navegador moderno. Para probar la personalización, añade al final de la dirección, después de `index.html`:

```text
?para=Carmen&parentesco=Abuela
```

Pulsa **Descubrir nuestra sorpresa**. Los tres capítulos avanzan automáticamente; **Saltar** muestra la revelación inmediatamente. **Volver a vivir este momento** regresa a la carta. La música solo se intenta reproducir después del clic inicial. El botón flotante permite pausarla y activarla.

## Archivos

```text
index.html
style.css
script.js
README.md
.nojekyll
assets/
  .gitkeep
```

Añade opcionalmente `assets/ecografia.jpg`, `assets/musica.mp3` y `assets/preview.jpg`. No se incluyen fotos ni audio ficticios o archivos binarios vacíos. `.gitkeep` conserva la carpeta en Git. Sin foto se muestra una tarjeta decorativa; sin audio, la historia continúa y aparece un aviso breve.

## Publicar gratis en GitHub Pages

1. Accede a GitHub y selecciona **New repository**. Ponle un nombre, por ejemplo `baby`, elige **Public** para usar GitHub Pages con GitHub Free y crea el repositorio.
2. Usa **Add file → Upload files** y sube los archivos de este proyecto, incluyendo `assets` cuando contenga tus archivos. `index.html` debe quedar directamente en la raíz, no dentro de otra carpeta. Guarda con **Commit changes** en `main`.
3. Abre **Settings → Pages** del repositorio.
4. En **Build and deployment → Source**, selecciona **Deploy from a branch**.
5. En **Branch**, selecciona **main** y **/ (root)**. Pulsa **Save**.
6. Espera a que termine la publicación. En esa misma pantalla aparecerá la dirección pública y **Visit site**, normalmente `https://usuario.github.io/baby/`.
7. Abre la URL, prueba un enlace personalizado y compártelo por WhatsApp. Los siguientes cambios publicados en `main` actualizarán el sitio.

No necesitas dominio propio, backend, base de datos, Node.js, Docker ni hosting de pago. `.nojekyll` permite servir directamente los archivos estáticos. Las rutas de CSS, JavaScript y multimedia son relativas y funcionan dentro de una subcarpeta de repositorio.

Referencia: [configurar la fuente de publicación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Enlaces personalizados

Sustituye `usuario` y `baby` por tu usuario y repositorio:

```text
https://usuario.github.io/baby/?para=Carmen&parentesco=Abuela
https://usuario.github.io/baby/?para=Alexis&parentesco=Tio
https://usuario.github.io/baby/?para=Rosa&parentesco=Madrina
https://usuario.github.io/baby/?para=Maria%20Elena&parentesco=Abuela
```

Los valores vacíos o ausentes usan `Familia` y `persona especial`. Se reconocen Abuela, Abuelo, Tia, Tio, Madrina, Padrino, Hermana, Hermano, Amiga y Amigo. Las tildes y mayúsculas no cambian el resultado: `tio`, `Tio`, `TÍO` y `tío` son equivalentes. Amiga y Amigo reciben un mensaje de amistad. Los parentescos desconocidos reciben «Tenemos una noticia muy especial para compartir contigo.»

Los espacios se codifican como `%20` o `+`. Para nombres con tildes, `&` u otros caracteres, puedes generar enlaces desde la consola del navegador:

```js
const enlace = new URL('https://usuario.github.io/baby/');
enlace.search = new URLSearchParams({ para: 'María Elena', parentesco: 'Tía' });
console.log(enlace.href);
```

## Personalización

- **Mensajes:** edita la carta y el cierre en `index.html`; los capítulos y tiempos (`duration`, en milisegundos) están en `chapters` dentro de `script.js`. Los mensajes familiares están en `getMensajeParentesco`.
- **Nombre del bebé:** cambia `Bizarro Pariona` y el texto alternativo de la fotografía en `index.html`.
- **Colores:** modifica las variables al principio de `style.css`, especialmente `--paper`, `--ink` y `--olive`.
- **Foto:** coloca tu JPG en `assets/ecografia.jpg`, respetando minúsculas. La imagen se muestra completa, sin recorte. Ajusta el `alt` para describirla si la cambias.
- **Música:** coloca un MP3 que puedas compartir en `assets/musica.mp3`. El volumen inicial es `0.35` en `script.js`; se repite mientras esté activada.
- **Texto de WhatsApp:** modifica la frase usada en `encodeURIComponent` en `script.js`. Por defecto no envía nombres, parentescos, fotos ni el enlace personalizado.

## Vista previa de WhatsApp

Los metadatos tienen un título y descripción discretos para no revelar la sorpresa antes de abrir la carta. Para añadir imagen, crea `assets/preview.jpg` (por ejemplo, de 1200 × 630 píxeles), descomenta `og:image` en `index.html` y sustituye su URL de ejemplo por la URL pública completa de tu imagen. La URL absoluta se usa solamente para este metadato; los recursos de la página usan rutas relativas.

GitHub Pages sirve metadatos Open Graph estáticos: no puede generar una vista previa de WhatsApp distinta según `?para=` o `parentesco`. La personalización ocurre con JavaScript cuando la persona abre la página. WhatsApp puede conservar en caché una vista previa anterior.

## Accesibilidad y privacidad

Botones utilizables con teclado, foco visible, encabezados, avisos de estado y descripción alternativa de la foto. `prefers-reduced-motion` desactiva transiciones, latido y partículas. El confeti se elimina a los 5 segundos y los temporizadores se cancelan al saltar o repetir.

No hay cookies, analítica, almacenamiento de nombres ni dependencias externas. Los nombres se insertan con `textContent`, nunca como HTML. El botón de compartir abre WhatsApp solo al pulsarlo. La URL personalizada puede permanecer en el historial del navegador y ser procesada por el hosting; el sitio público y sus archivos no están protegidos por contraseña. No publiques una ecografía con datos identificativos que no quieras hacer públicos.

## Comprobación antes de compartir

- Prueba sin parámetros, con `TÍO`, con un nombre con espacios y con un parentesco desconocido.
- Comprueba el recorrido completo, **Saltar**, repetición y los controles de música.
- Revisa 360 × 800, 390 × 844, 412 × 915 y escritorio con las herramientas del navegador.
- Prueba con y sin archivos multimedia. Los errores de carga de archivos opcionales ausentes son esperables; la página mantiene su contenido alternativo.
- Prueba navegación con Tab y la preferencia de movimiento reducido.
- Después de publicar, abre la dirección de GitHub Pages y verifica foto, música y el texto preparado para WhatsApp.

La publicación real necesita hacerse desde tu cuenta de GitHub; crear los archivos locales no publica el sitio.
