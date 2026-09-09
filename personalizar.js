'use strict';

const field = (id) => document.getElementById(id);
const publicSite = 'https://stivenrmn99.github.io/una-carta/';

function updateInvitation() {
  const name = field('recipient').value.trim() || 'Familia';
  const role = field('role').value;
  const message = field('custom-message').value.trim();
  // Local editing generates a public, shareable URL, while preview stays local.
  const url = new URL(window.location.protocol === 'file:' ? publicSite : './', window.location.href);
  url.search = new URLSearchParams({ para: name, parentesco: role });
  if (message) url.searchParams.set('mensaje', message);
  field('preview-name').textContent = name;
  field('preview-message').textContent = message || getMensajeParentesco(role, name);
  field('generated-link').value = url.href;
  field('send-link').href = `https://wa.me/?text=${encodeURIComponent(`Hola, ${name} ❤️ Tenemos una sorpresa muy especial para ti. Abre tu carta: ${url.href}`)}`;
  const preview = new URL('./index.html', window.location.href);
  preview.search = url.search;
  field('test-link').href = preview.href;
  field('editor-status').textContent = '';
}

field('editor-form').addEventListener('submit', (event) => event.preventDefault());
field('editor-form').addEventListener('input', updateInvitation);
field('editor-form').addEventListener('change', updateInvitation);
field('editor-form').addEventListener('reset', () => {
  window.setTimeout(() => { updateInvitation(); field('recipient').focus(); }, 0);
});
field('copy-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(field('generated-link').value);
    field('editor-status').textContent = '¡Enlace copiado! Ya puedes pegarlo en tu conversación.';
  } catch {
    field('generated-link').focus();
    field('generated-link').select();
    field('editor-status').textContent = 'Seleccionamos el enlace. Mantén pulsado y elige Copiar, o usa Ctrl+C.';
  }
});
updateInvitation();
