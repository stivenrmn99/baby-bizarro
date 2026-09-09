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

const mensajePersonalizado = params.get('mensaje')?.trim().slice(0, 240);
const mensajeFinal = mensajePersonalizado || getMensajeParentesco(parentesco, nombre);

document.querySelectorAll('[data-name]').forEach((element) => { element.textContent = nombre; });
$('relationship').textContent = mensajeFinal;
$('share').href = `https://wa.me/?text=${encodeURIComponent('Hay noticias que cambian la vida ❤️ Acabamos de recibir una muy especial 👶')}`;

// Build anticipation first; the personal message appears after the announcement.
const chapters = [
  { symbol: '✧', kicker: `${nombre}, esta pequeña historia también es para ti.`, title: 'Hay momentos que cambian nuestra historia…', detail: 'Y este es uno de ellos.', duration: 3200 },
  { symbol: '♡', kicker: 'Hay una alegría que ya no podemos guardar.', title: 'Lo más bonito de nuestra vida está por llegar…', detail: 'Y queríamos que tú lo supieras.', duration: 3200 },
  { symbol: '♡', kicker: 'Escucha con el corazón…', title: 'Un pequeño corazón ya está latiendo…', detail: 'Y está a punto de cambiarlo todo.', duration: 3600 }
];

function showChapter() {
  const chapter = chapters[step];
  $('story-symbol').textContent = chapter.symbol;
  $('story-symbol').classList.toggle('heartbeat', step === chapters.length - 1);
  $('story-kicker').textContent = chapter.kicker;
  $('story-title').textContent = chapter.title;
  $('story-detail').textContent = chapter.detail;
  $('progress').textContent = `0${step + 1} / 0${chapters.length}`;
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
  // Two side bursts: bounded particle count, transform-only motion, no frame loop.
  for (let i = 0; i < 150; i += 1) {
    const particle = document.createElement('span');
    const direction = i % 2 === 0 ? 1 : -1;
    const distance = 15 + Math.random() * 65;
    particle.className = 'burst-particle';
    particle.textContent = ['♥', '✦', '▪', '●', '▪', '▪'][i % 6];
    particle.style.left = direction === 1 ? '4%' : '96%';
    particle.style.setProperty('--x', `${direction * distance}vw`);
    particle.style.setProperty('--peak-x', `${direction * distance * 0.55}vw`);
    particle.style.setProperty('--peak-y', `${-30 - Math.random() * 42}vh`);
    particle.style.setProperty('--turn', `${direction * (180 + Math.random() * 540)}deg`);
    particle.style.setProperty('--size', `${17 + Math.random() * 15}px`);
    particle.style.animationDelay = `${Math.random() * 0.45}s`;
    particle.style.animationDuration = `${4.3 + Math.random() * 1.2}s`;
    fragment.append(particle);
  }
  $('particles').append(fragment);
  particleTimer = window.setTimeout(() => $('particles').replaceChildren(), 6200);
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
photo.addEventListener('load', () => { photo.hidden = false; $('photo-placeholder').hidden = true; photo.parentElement.classList.add('has-photo'); });
photo.addEventListener('error', () => { photo.hidden = true; $('photo-placeholder').hidden = false; photo.parentElement.classList.remove('has-photo'); });
photo.src = 'assets/ECO.png';

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
