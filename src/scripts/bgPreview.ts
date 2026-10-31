/**
 * Background try-out (owner, Oct 31 2026: « the site ground is pale and lifeless »).
 * On previews only, `?bg=a|b|c|d` switches the page ground between four proposals and is
 * remembered while browsing (`?bg=0` returns to the current ground). Never runs on matincc.ca.
 * The top-level light sections of <main> are tagged `.ground` so the proposals can colour
 * them without touching the navy, turquoise and photo bands.
 */
const host = location.hostname;
if (!/(^|\.)matincc\.ca$/.test(host)) {
  const key = 'matin-bg-try';
  const param = new URLSearchParams(location.search).get('bg');
  try {
    if (param) sessionStorage.setItem(key, param);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  let choice = param;
  try {
    choice ??= sessionStorage.getItem(key);
  } catch {
    /* ignore */
  }
  if (choice && /^[abcd]$/.test(choice)) {
    const root = document.documentElement;
    root.dataset.bg = choice;
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
      if (el.querySelector(':scope > .ahero, .ahero') || el.classList.contains('ahero')) return;
      if (getComputedStyle(el).backgroundImage !== 'none') return;
      if (!light(el) || el.getBoundingClientRect().height < 120) return;
      el.classList.add('ground');
      el.setAttribute('data-ground', String(n++ % 4));
    });
  }
}
