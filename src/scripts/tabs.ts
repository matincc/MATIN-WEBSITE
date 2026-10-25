/**
 * Region tabs (Matin's Picks, News & Insights): a `[data-tabs]` block holds a
 * `[role=tablist]` of `[role=tab]` buttons and one `[role=tabpanel]` per tab. Without
 * JavaScript every panel stays visible, each under its own heading.
 * Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern).
 */
export function enhanceTabs(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-tabs]').forEach((box) => {
    if (box.dataset.tabsReady) return;
    box.dataset.tabsReady = '1';
    const tabs = [...box.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')!)!);
    box.classList.add('is-enhanced');

    const select = (i: number, focus = false) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const rtl = getComputedStyle(box).direction === 'rtl';
        const next = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 } as Record<
          string,
          number
        >;
        let to: number | undefined;
        if (e.key in next) to = (i + next[e.key] + tabs.length) % tabs.length;
        if (e.key === 'Home') to = 0;
        if (e.key === 'End') to = tabs.length - 1;
        if (to === undefined) return;
        e.preventDefault();
        select(to, true);
      });
    });
    select(
      Math.max(
        0,
        tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'),
      ),
    );
  });
}
