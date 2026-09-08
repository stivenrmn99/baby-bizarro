'use strict';

// URL values are inserted as text, never HTML, and are not persisted.
const params = new URLSearchParams(window.location.search);
const nombre = params.get('para')?.trim() || 'Familia';
const parentesco = params.get('parentesco')?.trim() || 'persona especial';
const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let storyTimer;
let particleTimer;
let statusTimer;
let step = 0;
let revealed = false;
let musicUnavailable = false;

function getMensajeParentesco(parentesco, nombre) {
  const key = parentesco.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const roles = { abuela: 'ABUELA', abuelo: 'ABUELO', tia: 'TÍA', tio: 'TÍO', madrina: 'MADRINA', padrino: 'PADRINO', hermana: 'HERMANA', hermano: 'HERMANO', amiga: 'AMIGA', amigo: 'AMIGO' };
  if (!Object.hasOwn(roles, key)) return 'Tenemos una noticia muy especial para compartir contigo.';
  if (key === 'amiga' || key === 'amigo') return `${nombre}, ¡vas a ser una de las personas favoritas de nuestro bebé!`;
  return `¡Vas a ser ${roles[key]}! 👶❤️`;
}

document.querySelectorAll('[data-name]').forEach((element) => { element.textContent = nombre; });
$('relationship').textContent = getMensajeParentesco(parentesco, nombre);
$('share').href = `https://wa.me/?text=${encodeURIComponent('Hay noticias que cambian la vida ❤️ Acabamos de recibir una muy especial 👶')}`;

// Four short chapters (13 seconds total); skipping cancels the pending chapter.
const chapters = [
  { symbol: '✧', kicker: 'A veces, lo más extraordinario…', title: 'Hay momentos que cambian nuestra historia…', detail: 'Y este es uno de ellos.', duration: 3200 },
  { symbol: '♡', kicker: 'Tenemos una noticia que nos llena el alma.', title: 'Nuestra familia está creciendo ❤️', detail: 'Y queremos compartir esta alegría contigo.', duration: 3200 },
  { symbol: '✧', kicker: `${nombre}… Prepárate para una nueva aventura…`, title: getMensajeParentesco(parentesco, nombre), detail: 'Un nuevo capítulo también te espera a ti.', duration: 3800 },
  { symbol: '♡', kicker: 'Todo empieza con algo muy pequeño.', title: 'Un pequeño corazón ya está latiendo…', detail: 'Y ya llena de amor nuestra vida.', duration: 2800 }
];

function showChapter() {
  const chapter = chapters[step];
  $('story-symbol').textContent = chapter.symbol;
  $('story-symbol').classList.toggle('heartbeat', step === 3);
  $('story-kicker').textContent = chapter.kicker;
  $('story-title').textContent = chapter.title;
  $('story-detail').textContent = chapter.detail;
  $('progress').textContent = `0${step + 1} / 04`;
  const content = document.querySelector('.story-content');
  content.classList.remove('enter');
  void content.offsetWidth; // Restart the short fade when a chapter changes.
  content.classList.add('enter');
  storyTimer = window.setTimeout(() => { step += 1; step < chapters.length ? showChapter() : reveal(); }, chapter.duration);
}

function celebrate() {
  clearTimeout(particleTimer);
  $('particles').replaceChildren();
  if (reducedMotion.matches) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 34; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = ['♡', '✧', '·', '▪'][i % 4];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 1.4}s`;
    particle.style.setProperty('--drift', `${Math.random() * 100 - 50}px`);
    fragment.append(particle);
  }
  $('particles').append(fragment);
  particleTimer = window.setTimeout(() => $('particles').replaceChildren(), 5600);
}

function reveal() {
  if (revealed) return;
  revealed = true;
  clearTimeout(storyTimer);
  $('story').hidden = true;
  $('reveal').hidden = false;
  $('reveal').classList.add('enter');
  $('reveal-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
  celebrate();
}

// Optional media: a missing photo leaves the designed placeholder in place.
const photo = $('ultrasound');
photo.addEventListener('load', () => { photo.hidden = false; $('photo-placeholder').hidden = true; });
photo.addEventListener('error', () => { photo.hidden = true; $('photo-placeholder').hidden = false; });
photo.src = 'assets/ecografia.jpg';

const music = $('music');
function updateMusicButton() {
  const playing = !music.paused;
  const label = playing ? 'Silenciar música' : 'Activar música';
  $('music-toggle').setAttribute('aria-pressed', String(playing));
  $('music-toggle').setAttribute('aria-label', label);
  $('music-toggle').title = label;
}
function notifyMusic(message) {
  clearTimeout(statusTimer);
  $('music-status').textContent = message;
  statusTimer = window.setTimeout(() => { $('music-status').textContent = ''; }, 4500);
}
async function playMusic() {
  if (musicUnavailable) { notifyMusic('Este momento aún no tiene música.'); return; }
  if (!music.getAttribute('src')) music.src = 'assets/musica.mp3';
  music.volume = 0.35;
  try { await music.play(); } catch (error) {
    if (error.name !== 'AbortError') notifyMusic(musicUnavailable ? 'Este momento aún no tiene música.' : 'No se pudo iniciar la música. Puedes volver a intentarlo.');
  }
  updateMusicButton();
}
music.addEventListener('error', () => { musicUnavailable = true; updateMusicButton(); notifyMusic('Este momento aún no tiene música.'); });
music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
$('music-toggle').addEventListener('click', () => { music.paused ? playMusic() : music.pause(); });
$('discover').addEventListener('click', () => {
  $('welcome').hidden = true;
  $('story').hidden = false;
  $('music-toggle').hidden = false;
  playMusic(); // Called only from the visitor's click, never on page load.
  step = 0;
  revealed = false;
  showChapter();
  $('story-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
});
$('skip').addEventListener('click', reveal);
$('replay').addEventListener('click', () => {
  clearTimeout(storyTimer);
  clearTimeout(particleTimer);
  $('particles').replaceChildren();
  $('reveal').hidden = true;
  $('welcome').hidden = false;
  music.pause();
  $('discover').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
});
