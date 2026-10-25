/* Private editorial desk (vanilla JS). All text from the server is inserted with
 * textContent, never as HTML. Every action is checked again on the server. */
(() => {
  const $ = (id) => document.getElementById(id);
  const REGION = { montreal: 'Montréal', quebec: 'Québec', canada: 'Canada', international: 'Around the World' };
  const TOPIC = {
    policy: 'Cultural policy and planning',
    dialogue: 'Intercultural dialogue',
    participation: 'Cultural participation',
    'arts-heritage': 'Arts and heritage',
    community: 'Community cultural development',
    research: 'Cultural research',
    inclusion: 'Diversity, equity and inclusion',
    cooperation: 'Partnerships and cooperation',
  };
  const BY = {
    source: ['Publisher’s own text', 'badge'],
    'ai-draft': ['AI draft · not reviewed', 'badge badge--ai'],
    'ai-final': ['AI final versions · to review', 'badge badge--ai'],
    editor: ['Edited by you', 'badge badge--editor'],
  };
  const state = { me: null, items: [], tab: 'pending', details: new Map() };

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) if (c != null && c !== false) node.append(c);
    return node;
  }
  const day = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  const when = (iso) =>
    iso ? new Date(iso).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' }) : '';

  async function api(path, body) {
    const res = await fetch(`/api/editorial/${path}`, {
      method: body ? 'POST' : 'GET',
      credentials: 'same-origin',
      headers: body ? { 'content-type': 'application/json', 'x-editorial': '1' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      showSignin();
      throw new Error('Please sign in again.');
    }
    if (!res.ok) {
      const err = new Error(data.error || `Error ${res.status}`);
      err.details = data.details;
      throw err;
    }
    return data;
  }
  function say(id, text, kind = 'ok') {
    const m = $(id);
    m.textContent = text;
    m.className = `msg ${kind}`;
  }

  /* ------------------------------------------------------------ sign-in */
  function showSignin() {
    $('signin').hidden = false;
    $('desk').hidden = true;
    $('user').hidden = true;
  }
  const SIGNIN = {
    'not-configured': 'Sign-in with GitHub is not set up yet on this site (the Matin GitHub App keys are missing).',
    'too-many': 'Too many sign-in attempts. Please wait 15 minutes.',
    denied: 'Sign-in was cancelled on GitHub.',
    expired: 'The sign-in took too long or was opened in another window. Please try again.',
    'not-editor': 'This GitHub account is not an editor of the Matin website.',
    'no-access': 'This GitHub account cannot write to the website repository.',
    'not-installed': 'The Matin GitHub App is not installed on the MATIN-WEBSITE repository.',
    failed: 'GitHub did not confirm the sign-in. Please try again.',
  };
  const code = new URLSearchParams(location.search).get('signin');
  if (code) {
    history.replaceState(null, '', location.pathname);
    say('signin-msg', SIGNIN[code] || SIGNIN.failed, 'error');
  }
  $('signout').addEventListener('click', async () => {
    await api('logout', {}).catch(() => undefined);
    showSignin();
  });
  $('signout-all').addEventListener('click', async () => {
    if (!confirm('End every open session of this dashboard, on all devices?')) return;
    await api('logout-all', {}).catch(() => undefined);
    showSignin();
  });

  /* ------------------------------------------------------------ status */
  function drawStatus() {
    const me = state.me;
    $('who').textContent = `Signed in as ${me.login}`;
    $('user').hidden = false;
    const env = $('env');
    env.hidden = me.context === 'production';
    env.textContent =
      me.context === 'production'
        ? ''
        : `Test environment (Deploy Preview). Test data only. “Publish” writes to the test branch “${me.publishBranch}”, never to matincc.ca.`;
    $('daily').checked = me.settings.dailyDiscovery;
    $('daily-text').textContent = me.settings.dailyDiscovery ? 'On (every day, about 6 a.m.)' : 'Off';
    $('daily').disabled = me.context !== 'production';
    $('daily').title = me.context !== 'production' ? 'The schedule only runs on matincc.ca.' : '';
    const ai = $('ai-status');
    ai.textContent = me.ai.configured
      ? `On · US$${me.ai.usageUsd.toFixed(2)} used this month, US$${Math.max(0, me.ai.budgetLeftUsd).toFixed(2)} left`
      : 'Off (no API key yet)';
    ai.className = me.ai.configured ? 'on' : 'off';
    const mail = $('email-status');
    mail.textContent = me.email.configured ? 'Configured' : 'Not configured yet';
    mail.className = me.email.configured ? 'on' : 'off';
    $('test-email').hidden = !me.email.configured;
  }
  $('daily').addEventListener('change', async (e) => {
    const on = e.target.checked;
    if (on && !confirm('Switch on the daily discovery on matincc.ca? It only proposes stories; nothing is published without you.')) {
      e.target.checked = false;
      return;
    }
    try {
      const r = await api('settings', { dailyDiscovery: on });
      state.me.settings = r.settings;
      drawStatus();
    } catch (err) {
      say('desk-msg', err.message, 'error');
    }
  });
  $('run').addEventListener('click', async () => {
    $('run').disabled = true;
    try {
      const r = await api('run', {});
      say('desk-msg', r.message);
      setTimeout(refresh, 45000);
      setTimeout(refresh, 120000);
    } catch (err) {
      say('desk-msg', err.message, 'error');
    } finally {
      setTimeout(() => ($('run').disabled = false), 20000);
    }
  });
  $('test-email').addEventListener('click', async () => {
    try {
      await api('test-email', {});
      say('desk-msg', 'Test email sent to admin@matincc.ca.');
    } catch (err) {
      say('desk-msg', err.message, 'error');
    }
  });

  /* ------------------------------------------------------------ lists */
  for (const tab of document.querySelectorAll('[role="tab"]')) {
    tab.addEventListener('click', () => {
      state.tab = tab.dataset.tab;
      for (const t of document.querySelectorAll('[role="tab"]'))
        t.setAttribute('aria-selected', String(t === tab));
      draw();
    });
  }

  function versionBlock(lang, label, title, summary, rtl) {
    return el(
      'div',
      { class: 'version', dir: rtl ? 'rtl' : undefined, lang },
      el('span', { class: 'version__lang', text: label }),
      title ? el('h4', { text: title }) : el('p', { class: 'missing', text: 'No headline yet' }),
      summary ? el('p', { text: summary }) : el('p', { class: 'missing', text: 'No summary yet' }),
    );
  }

  async function detail(id) {
    if (!state.details.has(id)) state.details.set(id, await api(`candidate?id=${encodeURIComponent(id)}`));
    return state.details.get(id);
  }

  async function act(id, action, confirmText) {
    if (confirmText && !confirm(confirmText)) return;
    try {
      const r = await api('action', { id, action });
      state.details.delete(id);
      say('desk-msg', action === 'approve' && r.ai ? `Approved. Final FR/EN/FA versions ${r.ai}.` : 'Done.');
      await refresh();
    } catch (err) {
      say('desk-msg', err.message, 'error');
    }
  }

  function card(sum, full) {
    const c = full.candidate;
    const d = c.draft;
    const [byText, byClass] = BY[d.by] || BY.source;
    const s = c.state;
    const actions = [];
    const btn = (text, cls, fn) => el('button', { type: 'button', class: `btn ${cls}`, text, onclick: fn });
    if (s === 'pending' || s === 'hold')
      actions.push(
        btn('Approve', 'btn--approve', () =>
          act(c.id, 'approve', 'Approve this story for publication? It is not public until you press “Publish approved stories”.'),
        ),
      );
    if (s !== 'published' && s !== 'rejected') actions.push(btn('Edit', 'btn--quiet', () => openEdit(full)));
    if (s === 'pending') actions.push(btn('Hold', 'btn--quiet', () => act(c.id, 'hold')));
    if (s === 'hold') actions.push(btn('Back to pending', 'btn--quiet', () => act(c.id, 'resume')));
    if (s === 'approved') {
      if (state.me.ai.configured)
        actions.push(
          btn('Prepare FR / EN / FA with AI', 'btn--quiet', async () => {
            say('desk-msg', 'Preparing the three versions…');
            try {
              await api('prepare', { id: c.id });
              state.details.delete(c.id);
              say('desk-msg', 'Final versions prepared. Please review them.');
              await refresh();
            } catch (err) {
              say('desk-msg', err.message, 'error');
            }
          }),
        );
      actions.push(btn('Withdraw approval', 'btn--quiet', () => act(c.id, 'withdraw')));
    }
    if (s === 'rejected') actions.push(btn('Restore to pending', 'btn--quiet', () => act(c.id, 'resume')));
    if (s !== 'published' && s !== 'rejected')
      actions.push(btn('Reject', 'btn--danger', () => act(c.id, 'reject', 'Reject this story? It will never be proposed again.')));
    actions.push(
      el('a', { class: 'btn btn--quiet', href: c.source.url, target: '_blank', rel: 'noopener noreferrer', text: 'View original source ↗' }),
    );

    return el(
      'article',
      { class: 'card', 'data-state': s },
      el('h3', { text: d.title.en || d.title.fr || c.original.title }),
      el(
        'div',
        { class: 'meta' },
        el('span', { text: `${c.source.name} · published ${day(c.original.published)}` }),
        el('span', { text: `Tab: ${REGION[c.region]}` }),
        el('span', { text: `Theme: ${TOPIC[c.topic]}` }),
        c.score ? el('span', { class: 'score', text: `Score ${c.score}/100` }) : null,
        el('span', { text: `Found ${day(c.discoveredAt)}` }),
        el('span', { class: byClass, text: byText }),
      ),
      el(
        'div',
        { class: 'versions' },
        versionBlock('fr', 'Français', d.title.fr, d.summary.fr),
        versionBlock('en', 'English', d.title.en, d.summary.en),
        s === 'approved' || s === 'published' || d.title.fa
          ? versionBlock('fa', 'فارسی', d.title.fa, d.summary.fa, true)
          : null,
      ),
      d.relevance ? el('p', {}, el('strong', { text: 'Why it matters: ' }), d.relevance) : null,
      c.publishedAs
        ? el('p', { text: `Published ${when(c.publishedAs.at)} on branch ${c.publishedAs.branch} (${c.publishedAs.path}).` })
        : null,
      el(
        'details',
        {},
        el('summary', { text: 'Original text, notes and score' }),
        el(
          'div',
          { class: 'orig' },
          el('p', {}, el('strong', { text: 'Publisher’s headline: ' }), c.original.title),
          el('p', {}, el('strong', { text: 'Publisher’s description: ' }), c.original.description || '(none)'),
        ),
        d.notes ? el('p', {}, el('strong', { text: 'Notes: ' }), d.notes) : null,
        c.reasons.length ? el('p', {}, el('strong', { text: 'Score: ' }), c.reasons.join(' · ')) : null,
      ),
      el('div', { class: 'actions' }, actions),
    );
  }

  async function draw() {
    const counts = {};
    for (const i of state.items) counts[i.state] = (counts[i.state] || 0) + 1;
    for (const t of document.querySelectorAll('[role="tab"]')) {
      const c = t.querySelector('.count');
      if (c) c.textContent = String(counts[t.dataset.tab] || 0);
    }
    const isActivity = state.tab === 'activity';
    $('activity').hidden = !isActivity;
    $('list').hidden = isActivity;
    const approved = counts.approved || 0;
    $('publish-bar').hidden = state.tab !== 'approved' || !approved;
    $('publish-text').textContent = `${approved} approved ${approved === 1 ? 'story is' : 'stories are'} ready. Publishing puts ${approved === 1 ? 'it' : 'them'} on the website in one update (one Netlify build, about 15 credits).`;
    if (isActivity) return drawActivity();

    const items = state.items
      .filter((i) => i.state === state.tab)
      .sort((a, b) => (state.tab === 'pending' ? b.score - a.score : b.updatedAt.localeCompare(a.updatedAt)));
    const list = $('list');
    if (!items.length) {
      list.replaceChildren(el('p', { class: 'empty', text: emptyText(state.tab) }));
      return;
    }
    list.replaceChildren(el('p', { class: 'empty', text: 'Loading…' }));
    const fulls = await Promise.all(items.slice(0, 60).map((i) => detail(i.id).catch(() => null)));
    list.replaceChildren(...items.slice(0, 60).map((i, n) => (fulls[n] ? card(i, fulls[n]) : null)).filter(Boolean));
  }
  const emptyText = (tab) =>
    ({
      pending: 'No story is waiting. After the next discovery run, new proposals appear here. If a run finds nothing strong, nothing is added.',
      hold: 'Nothing on hold.',
      approved: 'No approved story waiting for publication.',
      published: 'Nothing published from this desk yet.',
      rejected: 'Nothing rejected.',
    })[tab];

  async function drawActivity() {
    const [{ runs }, { entries }] = await Promise.all([api('runs'), api('audit')]);
    const head = el('tr', {}, ...['Started', 'How', 'Result', 'Feeds read', 'Items read', 'Proposed', 'Skipped', 'AI drafts', 'Email'].map((h) => el('th', { text: h })));
    const rows = runs.map((r) =>
      el(
        'tr',
        {},
        el('td', { text: when(r.startedAt) }),
        el('td', { text: r.trigger === 'schedule' ? 'daily' : 'by hand' }),
        el('td', { text: r.status + (r.error ? `: ${r.error}` : '') }),
        el('td', {
          text: `${r.feeds.filter((f) => f.ok).length} of ${r.feeds.length}`,
          title: r.feeds.filter((f) => !f.ok).map((f) => `${f.id}: ${f.error}`).join('\n') || undefined,
        }),
        el('td', { text: String(r.considered) }),
        el('td', { text: r.proposed.length ? String(r.proposed.length) : 'none (no strong candidates)' }),
        el('td', { text: `old ${r.skipped.old}, already seen ${r.skipped.seen}, off-topic ${r.skipped.excluded}, weak ${r.skipped.lowScore}, duplicate ${r.skipped.duplicate}` }),
        el('td', { text: `${r.ai.drafted} (${r.ai.failed} failed)` }),
        el('td', { text: r.notified || '' }),
      ),
    );
    const failed = runs[0]?.feeds.filter((f) => !f.ok) || [];
    $('runs').replaceChildren(
      failed.length
        ? el('caption', { class: 'hint', text: `Feeds that failed in the last run: ${failed.map((f) => `${f.id} (${f.error})`).join('; ')}` })
        : '',
      el('thead', {}, head),
      el('tbody', {}, rows),
    );
    $('audit').replaceChildren(
      ...entries.map((e) => el('li', { text: `${when(e.at)} · ${e.by} · ${e.action}${e.id ? ` · ${e.id}` : ''}${e.detail ? ` · ${e.detail}` : ''}` })),
    );
  }

  $('import-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const items = JSON.parse(await file.text());
      const r = await api('import', { items: Array.isArray(items) ? items : items.items });
      say('import-msg', `${r.added} stories added as Pending.`);
      await refresh();
    } catch (err) {
      say('import-msg', err.message, 'error');
    }
    e.target.value = '';
  });

  $('publish').addEventListener('click', async () => {
    const n = state.items.filter((i) => i.state === 'approved').length;
    const where =
      state.me.context === 'production'
        ? 'on matincc.ca'
        : `on the test branch “${state.me.publishBranch}” (not on matincc.ca)`;
    if (!confirm(`Publish ${n} approved ${n === 1 ? 'story' : 'stories'} ${where}? This is your authorization to publish.`)) return;
    $('publish').disabled = true;
    try {
      const r = await api('publish', {});
      say('desk-msg', `Published ${r.files.length} on ${r.branch} (commit ${r.commit.slice(0, 7)}).`);
      state.details.clear();
      await refresh();
    } catch (err) {
      say('desk-msg', err.details ? `${err.message} ${err.details.join(' / ')}` : err.message, 'error');
    } finally {
      $('publish').disabled = false;
    }
  });

  /* ------------------------------------------------------------ edit */
  let editing = null;
  function openEdit(full) {
    editing = full;
    const c = full.candidate;
    const f = $('edit-form');
    f.region.value = c.region;
    f.topic.value = c.topic;
    for (const k of ['title', 'summary'])
      for (const l of ['fr', 'en', 'fa']) f.elements[`${k}.${l}`].value = c.draft[k][l] || '';
    f.relevance.value = c.draft.relevance || '';
    f.notes.value = c.draft.notes || '';
    $('edit-orig').replaceChildren(
      el('p', {}, el('strong', { text: `${c.source.name}: ` }), c.original.title),
      el('p', { text: c.original.description || '' }),
    );
    say('edit-msg', '');
    $('edit').showModal();
  }
  $('edit-cancel').addEventListener('click', () => $('edit').close());
  $('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const v = (n) => f.elements[n].value;
    try {
      await api('edit', {
        id: editing.candidate.id,
        etag: editing.etag,
        region: f.region.value,
        topic: f.topic.value,
        draft: {
          title: { fr: v('title.fr'), en: v('title.en'), fa: v('title.fa') },
          summary: { fr: v('summary.fr'), en: v('summary.en'), fa: v('summary.fa') },
          relevance: v('relevance'),
          notes: v('notes'),
        },
      });
      state.details.delete(editing.candidate.id);
      $('edit').close();
      say('desk-msg', 'Changes saved.');
      await refresh();
    } catch (err) {
      say('edit-msg', err.message, 'error');
    }
  });

  /* ------------------------------------------------------------ start */
  async function refresh() {
    const [{ items }, me, { runs }] = await Promise.all([api('candidates'), api('me'), api('runs')]);
    state.items = items;
    state.me = me;
    drawStatus();
    const last = runs[0];
    $('last-run').textContent = last
      ? `${when(last.startedAt)} · ${last.status}${last.status === 'done' ? ` · ${last.proposed.length || 'no'} new` : ''}`
      : 'None yet';
    await draw();
  }
  async function start() {
    const me = await api('me').catch(() => ({ signedIn: false }));
    if (!me.signedIn) {
      if (me.signInReady === false && !code) say('signin-msg', SIGNIN['not-configured'], 'error');
      return showSignin();
    }
    $('signin').hidden = true;
    $('desk').hidden = false;
    await refresh();
  }
  start();
})();
