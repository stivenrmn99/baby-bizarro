'use strict';

// Shared by the invitation and its link editor; all output is rendered as text.
function getMensajeParentesco(parentesco, nombre) {
  const key = parentesco.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const roles = { abuela: 'ABUELA', abuelo: 'ABUELO', tia: 'TÍA', tio: 'TÍO', madrina: 'MADRINA', padrino: 'PADRINO', hermana: 'HERMANA', hermano: 'HERMANO' };
  if (Object.hasOwn(roles, key)) return `¡Vas a ser ${roles[key]}! 👶❤️`;
  if (key === 'amiga' || key === 'amigo' || key === 'amigos') return `${nombre}, ¡vas a ser parte de los momentos más bonitos de nuestro bebé!`;
  if (key === 'familia') return '¡Nuestra familia crece! Qué alegría vivir esta nueva aventura con ustedes. ❤️';
  return 'Tenemos una noticia muy especial para compartir contigo.';
}
