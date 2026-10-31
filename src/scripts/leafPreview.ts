/**
 * PREVIEW ONLY (owner's question, Oct 31 2026: "no sign of Canada for a first-time visitor").
 * `?leaf=a|b|c|d` shows one of four proposals; `?leaf=0` the current site. The choice is kept
 * for the tab so the visitor can move between pages. Never runs on matincc.ca, and is to be
 * replaced by the chosen option (and this file deleted) once the owner decides.
 */
const LEAF =
  'M12 1l1.6 3.2 1.8-.8-.8 5 2.6-2.2.7 1.7 2.7-.6-.9 3.1 1.6.8-4.7 3.8.6 1.9-4.6-.6.1 4.7h-1.4l.1-4.7-4.6.6.6-1.9-4.7-3.8 1.6-.8-.9-3.1 2.7.6.7-1.7 2.6 2.2-.8-5 1.8.8z';
if (!/(^|\.)matincc\.ca$/.test(location.hostname)) {
  let mode = new URLSearchParams(location.search).get('leaf');
  try {
    if (mode) sessionStorage.setItem('matin-leaf', mode);
    else mode = sessionStorage.getItem('matin-leaf');
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  if (mode && /^[abcd]$/.test(mode)) {
    document.documentElement.dataset.leaf = mode;
    if (mode === 'c') {
      // Large, pale maple leaves among the sun and arch shapes of the page grounds.
      [...document.querySelectorAll('main .ground')]
        .filter((sec) => sec.getBoundingClientRect().height > 420)
        .forEach((sec, i) => {
          if (i % 2) return;
          const wrap = document.createElement('div');
          wrap.className = 'leaf-ground';
          wrap.dataset.side = i % 4 ? 'start' : 'end';
          wrap.setAttribute('aria-hidden', 'true');
          wrap.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><path d="${LEAF}"/></svg>`;
          (sec as HTMLElement).style.isolation = 'isolate';
          if (getComputedStyle(sec).position === 'static')
            (sec as HTMLElement).style.position = 'relative';
          sec.prepend(wrap);
        });
    }
  }
}

