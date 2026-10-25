/**
 * Progressive enhancement for every <form data-enhanced-form>:
 *  - conditional parts (data-show-when="field=value"): hidden and disabled while the
 *    condition is false; fields with data-required-when become required with it, and
 *    labels with data-label-when show their alternative text;
 *  - accessible inline validation with messages in the page's language
 *    (read from data-msg-* attributes, which come from the translation files);
 *  - an error summary that receives focus;
 *  - AJAX submission to Netlify Forms, or to /api/submit (data-mode="email"), with a
 *    success message only once the server has confirmed the submission.
 * Without JS, the browser's native validation and a normal POST still work.
 */

type Messages = {
  required: string;
  email: string;
  consent: string;
  intro: string;
  success: string;
  error: string;
  sending: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fieldLabel(form: HTMLFormElement, field: HTMLElement): string {
  if (field instanceof HTMLInputElement && field.type === 'radio') {
    const legend = field.closest('fieldset')?.querySelector('legend');
    return (legend?.textContent ?? '').replace(/\(.*?\)/g, '').trim();
  }
  const label = form.querySelector<HTMLLabelElement>(`label[for="${field.id}"]`);
  return (label?.dataset.short ?? label?.textContent ?? field.getAttribute('name') ?? '')
    .replace(/\*|\(.*?\)/g, '')
    .trim();
}

function validate(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, m: Messages) {
  if (field.disabled) return '';
  if (field instanceof HTMLInputElement && field.type === 'radio') {
    const checked = field.form?.querySelector(`input[name="${field.name}"]:checked`);
    return field.required && !checked ? m.required : '';
  }
  if (field instanceof HTMLInputElement && field.type === 'checkbox') {
    return field.required && !field.checked ? m.consent : '';
  }
  const value = field.value.trim();
  if (field.required && !value) return m.required;
  if (field instanceof HTMLInputElement && field.type === 'email' && value && !EMAIL.test(value)) {
    return m.email;
  }
  return '';
}

function setError(field: HTMLElement, message: string) {
  const box = document.getElementById(`${field.id}-error`);
  if (box) {
    box.textContent = message;
    box.hidden = !message;
  }
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}

type TurnstileWindow = Window & {
  turnstile?: { reset: (el?: Element | null) => void };
  matinTurnstileDone?: (token: string) => void;
  matinTurnstileExpired?: () => void;
};

/**
 * Cloudflare Turnstile (optional): the widget's script is only requested once the
 * visitor starts filling in a form, and its token is copied into a field declared
 * in the HTML so that Netlify Forms keeps it for server-side verification.
 */
function setupTurnstile() {
  const widgets = document.querySelectorAll('.cf-turnstile');
  if (!widgets.length) return;
  const w = window as TurnstileWindow;
  const setAll = (value: string) =>
    document
      .querySelectorAll<HTMLInputElement>('[data-turnstile-token]')
      .forEach((i) => (i.value = value));
  w.matinTurnstileDone = (token) => setAll(token);
  w.matinTurnstileExpired = () => setAll('');

  let requested = false;
  const load = () => {
    if (requested) return;
    requested = true;
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    document.head.append(s);
  };
  document
    .querySelectorAll('form[data-enhanced-form]')
    .forEach((f) => f.addEventListener('focusin', load, { once: true }));
}

/** Is "name=value" true in this form (radio, select or text field)? */
function conditionMet(form: HTMLFormElement, condition: string) {
  const [name, value] = condition.split(/=(.*)/s);
  const data = new FormData(form);
  return data.getAll(name).some((v) => v === value);
}

/** Shows, hides, requires and relabels the conditional parts of a form. */
function setupConditions(form: HTMLFormElement) {
  const parts = form.querySelectorAll<HTMLElement>('[data-show-when]');
  const requiredWhen = form.querySelectorAll<HTMLInputElement>('[data-required-when]');
  const labels = form.querySelectorAll<HTMLLabelElement>('[data-label-when]');
  if (!parts.length && !requiredWhen.length && !labels.length) return;
  const original = new Map<HTMLLabelElement, string>();
  const update = () => {
    parts.forEach((part) => {
      const on = conditionMet(form, part.dataset.showWhen!);
      part.hidden = !on;
      part
        .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          'input, select, textarea',
        )
        .forEach((f) => {
          f.disabled = !on;
          if (!on) setError(f, '');
        });
    });
    requiredWhen.forEach((f) => {
      const on = conditionMet(form, f.dataset.requiredWhen!);
      f.required = on;
      const mark = form.querySelector<HTMLElement>(`label[for="${f.id}"] [data-req-mark]`);
      if (mark) mark.hidden = !on;
    });
    labels.forEach((label) => {
      const text = label.querySelector<HTMLElement>('[data-label-text]');
      if (!text) return;
      if (!original.has(label)) original.set(label, text.textContent ?? '');
      const alt = conditionMet(form, label.dataset.labelWhen!);
      text.textContent = alt ? label.dataset.labelAlt! : original.get(label)!;
      label.dataset.short = text.textContent ?? '';
    });
  };
  form.addEventListener('change', update);
  form.addEventListener('reset', () => setTimeout(update));
  update();
}

export function enhanceForms() {
  setupTurnstile();
  document.querySelectorAll<HTMLFormElement>('form[data-enhanced-form]').forEach((form) => {
    const d = form.dataset;
    const m: Messages = {
      required: d.msgRequired!,
      email: d.msgEmail!,
      consent: d.msgConsent!,
      intro: d.msgIntro!,
      success: d.msgSuccess!,
      error: d.msgError!,
      sending: d.msgSending!,
    };
    form.noValidate = true; // we show our own, bilingual messages
    setupConditions(form);
    const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
    const status = form.querySelector<HTMLElement>('[data-form-status]')!;
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const fields = [
      ...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input[id]:not([type=hidden]), textarea[id], select[id]',
      ),
    ]
      .filter((f) => !f.closest('[data-honeypot]'))
      // A radio group is checked once, through its first button.
      .filter(
        (f) =>
          !(f instanceof HTMLInputElement && f.type === 'radio') ||
          form.querySelector(`input[name="${f.name}"]`) === f,
      );

    // After a first attempt, a field marked invalid is checked again as the visitor types,
    // ticks or leaves it, and the error summary drops the fixed ones (it closes once
    // everything is fixed) instead of showing stale warnings.
    const recheck = (f: (typeof fields)[number]) => {
      if (!f.hasAttribute('aria-invalid')) return;
      setError(f, validate(f, m));
      if (summary.hidden) return;
      summary.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
        const target = form.querySelector<HTMLElement>(`[id="${a.hash.slice(1)}"]`);
        if (!target?.hasAttribute('aria-invalid')) a.closest('li')?.remove();
      });
      if (!summary.querySelector('li')) summary.hidden = true;
    };
    fields.forEach((f) => {
      f.addEventListener('blur', () => recheck(f));
      f.addEventListener('input', () => recheck(f));
      f.addEventListener('change', () => recheck(f));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form-status';

      const errors = fields
        .map((f) => ({ f, msg: validate(f, m) }))
        .filter((x) => {
          setError(x.f, x.msg);
          return x.msg;
        });

      if (errors.length) {
        summary.hidden = false;
        summary.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'font-semibold';
        p.textContent = m.intro;
        const ul = document.createElement('ul');
        ul.className = 'mt-2 list-disc pl-5';
        for (const { f, msg } of errors) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${f.id}`;
          a.textContent = `${fieldLabel(form, f)} — ${msg}`;
          a.addEventListener('click', (ev) => {
            ev.preventDefault();
            f.focus();
          });
          li.append(a);
          ul.append(li);
        }
        summary.append(p, ul);
        summary.focus();
        return;
      }
      summary.hidden = true;

      const tokenInput = form.querySelector<HTMLInputElement>('[data-turnstile-token]');
      if (tokenInput && !tokenInput.value) {
        status.textContent = d.msgCaptcha ?? '';
        status.classList.add('is-error');
        status.focus();
        return;
      }

      submit.disabled = true;
      const label = submit.innerHTML;
      submit.textContent = m.sending;
      try {
        let res: Response;
        if (d.mode === 'email') {
          res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Several ticked boxes with one name (e.g. languages) become one line.
            body: JSON.stringify(
              [...new FormData(form)].reduce<Record<string, string>>((o, [k, v]) => {
                o[k] = o[k] ? `${o[k]}, ${v}` : String(v);
                return o;
              }, {}),
            ),
          });
          const result = (await res.json().catch(() => ({}))) as { ok?: boolean };
          if (res.status === 429) throw new Error('too-many');
          if (!res.ok || !result.ok) throw new Error(String(res.status));
        } else {
          const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
          res = await fetch(form.getAttribute('action') || '/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
          });
          if (!res.ok) throw new Error(String(res.status));
        }
        form.reset();
        if (tokenInput) {
          tokenInput.value = '';
          (window as TurnstileWindow).turnstile?.reset(form.querySelector('.cf-turnstile'));
        }
        status.textContent = m.success;
        status.classList.add('is-success');
      } catch (err) {
        status.textContent =
          (err as Error).message === 'too-many' && d.msgTooMany ? d.msgTooMany : m.error;
        status.classList.add('is-error');
      } finally {
        submit.disabled = false;
        submit.innerHTML = label;
        status.focus();
      }
    });
  });
}

/** Newsletter forms: light validation, then Brevo (via our function) or Netlify Forms. */
export function enhanceNewsletters() {
  document.querySelectorAll<HTMLFormElement>('form[data-newsletter]').forEach((form) => {
    if (form.dataset.enhanced) return;
    form.dataset.enhanced = '1';
    form.noValidate = true;
    const d = form.dataset;
    const email = form.querySelector<HTMLInputElement>('input[type=email]')!;
    const consent = form.querySelector<HTMLInputElement>('input[name=consent]')!;
    const status = form.querySelector<HTMLElement>('.newsletter__status')!;
    const submit = form.querySelector<HTMLButtonElement>('button[type=submit]')!;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      email.removeAttribute('aria-invalid');
      consent.removeAttribute('aria-invalid');
      const say = (msg: string) => {
        status.textContent = msg;
        status.focus();
      };
      if (!EMAIL.test(email.value.trim())) {
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        status.textContent = d.msgEmail ?? '';
        return;
      }
      if (!consent.checked) {
        consent.setAttribute('aria-invalid', 'true');
        consent.focus();
        status.textContent = d.msgConsent ?? '';
        return;
      }

      submit.disabled = true;
      status.textContent = d.msgSending ?? '';
      const data = new FormData(form);
      try {
        const res =
          d.mode === 'brevo'
            ? await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: email.value.trim(),
                  lang: data.get('lang'),
                  consent: consent.checked,
                  'bot-field': data.get('bot-field'),
                }),
              })
            : await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
              });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        say(d.msgSuccess ?? '');
      } catch {
        say(d.msgError ?? '');
      } finally {
        submit.disabled = false;
      }
    });
  });
}
