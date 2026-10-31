/**
 * Page grounds « Soleil et arche » (owner's choice, Oct 31 2026: the ground was pale and
 * lifeless). The top-level light sections of <main> are tagged `.ground` with a rotating
 * `data-ground` (0 to 3), so global.css can give them alternating pale grounds with large
 * flat sun and arch shapes at their edges, without touching the navy, turquoise and photo
 * bands. Without script the pages keep their plain grounds.
 */
const light = (el: Element) => {
  const c = getComputedStyle(el).backgroundColor;
  const m = c.match(/[\d.]+/g)?.map(Number);
  if (!m) return true;
  if (c.startsWith('color(')) m.splice(0, 3, m[0] * 255, m[1] * 255, m[2] * 255);
  if ((m[3] ?? 1) < 0.5) return true;
  return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2] > 200;
};
let n = 0;
document.querySelectorAll('main > *, main > div > section').forEach((el) => {
  if (el.matches('main > div') && el.querySelector(':scope > section')) return;
  if (el.hasAttribute('data-own-ground')) return;
  if (el.classList.contains('ahero') || el.querySelector('.ahero')) return;
  if (getComputedStyle(el).backgroundImage !== 'none') return;
  if (!light(el) || el.getBoundingClientRect().height < 120) return;
  el.classList.add('ground');
  el.setAttribute('data-ground', String(n++ % 4));
});
