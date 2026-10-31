/**
 * « My Story in 10 Seconds »: checks the form and the video in the browser, then sends the
 * video to the forms web app in 8 MB pieces (see google-sheets/Code.gs, storyRequest). The
 * web app answers with JSON; a dropped piece is retried from where Drive stopped.
 */
type Msg = Record<string, string>;

const LIMITS = {
  short: { seconds: 16, bytes: 60 * 1024 * 1024 },
  long: { seconds: 61, bytes: 250 * 1024 * 1024 },
} as const;
const MIN_SECONDS = 3;
const RETRIES = 4;

/** The video's length in seconds, or undefined if the browser cannot read it (some HEVC files). */
function videoDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    const done = (value?: number) => {
      URL.revokeObjectURL(url);
      resolve(value && Number.isFinite(value) ? value : undefined);
    };
    const timer = window.setTimeout(() => done(), 8000);
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.clearTimeout(timer);
      done(video.duration);
    };
    video.onerror = () => {
      window.clearTimeout(timer);
      done();
    };
    video.src = url;
  });
}

function videoType(file: File) {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext === 'mov'
    ? 'video/quicktime'
    : ext === 'webm'
      ? 'video/webm'
      : ext === 'mp4' || ext === 'm4v'
        ? 'video/mp4'
        : '';
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Plain-text POST (no preflight); Apps Script redirects to a CORS-enabled answer. */
async function call(endpoint: string, body: object) {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as {
    ok: boolean;
    error?: string;
    token?: string;
    chunk?: number;
    next?: number;
    done?: boolean;
  };
}

const fill = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));

export function enhanceStoryForm(form: HTMLFormElement) {
  const msg = JSON.parse(form.dataset.msg ?? '{}') as Msg;
  const endpoint = form.dataset.endpoint ?? '';
  const lang = form.dataset.lang ?? 'fr';
  const num = (n: number) =>
    n.toLocaleString(lang === 'fa' ? 'fa-IR' : lang === 'fr' ? 'fr-CA' : 'en-CA');
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const progressBox = form.querySelector<HTMLElement>('[data-story-progress]')!;
  const bar = progressBox.querySelector('progress')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-story-submit]')!;
  const fileInput = form.querySelector<HTMLInputElement>('input[type=file]')!;
  let attempted = false;

  const setError = (field: HTMLInputElement | HTMLSelectElement, text: string) => {
    const box = form.querySelector<HTMLElement>(`#${field.id}-error`);
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (box) {
      box.textContent = text;
      box.hidden = !text;
    }
  };

  async function validate() {
    const errors: { field: HTMLInputElement | HTMLSelectElement; text: string }[] = [];
    form
      .querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[required], select[required]')
      .forEach((f) => {
        let text = '';
        if (f instanceof HTMLInputElement && f.type === 'checkbox')
          text = f.checked ? '' : msg.errConsent;
        else if (f instanceof HTMLInputElement && f.type === 'file')
          text = f.files?.length ? '' : msg.errVideo;
        else if (!f.value.trim()) text = msg.errRequired;
        else if (
          f instanceof HTMLInputElement &&
          f.type === 'email' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim())
        )
          text = msg.errEmail;
        setError(f, text);
        if (text) errors.push({ field: f, text });
      });

    let duration: number | undefined;
    const file = fileInput.files?.[0];
    if (file) {
      const format = (
        new FormData(form).get('format') === 'long' ? 'long' : 'short'
      ) as keyof typeof LIMITS;
      const limit = LIMITS[format];
      let text = '';
      if (!/^video\//.test(videoType(file))) text = msg.errType;
      else if (file.size > limit.bytes)
        text = fill(msg.errTooBig, { mb: num(Math.round(file.size / 1048576)) });
      else {
        duration = await videoDuration(file);
        if (duration !== undefined && duration < MIN_SECONDS) text = msg.errTooShort;
        else if (duration !== undefined && duration > limit.seconds) {
          text = fill(format === 'short' ? msg.errTooLongShort : msg.errTooLongLong, {
            s: num(Math.round(duration)),
          });
        }
      }
      setError(fileInput, text);
      if (text) errors.push({ field: fileInput, text });
    }

    summary.replaceChildren();
    if (errors.length) {
      const intro = document.createElement('p');
      intro.textContent = msg.errorsIntro;
      const list = document.createElement('ul');
      errors.forEach((e) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${e.field.id}`;
        a.textContent = e.text;
        li.append(a);
        list.append(li);
      });
      summary.append(intro, list);
    }
    summary.hidden = !errors.length;
    return { ok: !errors.length, duration };
  }

  form.addEventListener('change', () => {
    if (attempted) void validate();
  });

  const setStatus = (text: string, kind: 'success' | 'error' | '') => {
    status.textContent = text;
    status.classList.toggle('is-success', kind === 'success');
    status.classList.toggle('is-error', kind === 'error');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    attempted = true;
    setStatus('', '');
    const { ok, duration } = await validate();
    if (!ok) {
      summary.focus();
      return;
    }
    const file = fileInput.files![0]!;
    const data = new FormData(form);
    const value = (k: string) => String(data.get(k) ?? '').trim();
    submit.disabled = true;
    progressBox.hidden = false;
    bar.value = 0;
    setStatus(fill(msg.sending, { p: num(0) }), '');

    try {
      const start = await call(endpoint, {
        action: 'story-start',
        'bot-field': value('bot-field'),
        size: file.size,
        type: videoType(file),
        name: file.name,
        duration,
        data: {
          first_name: value('first_name'),
          city: value('city'),
          email: value('email'),
          language: value('language'),
          prompt: value('prompt'),
          format: value('format'),
          lang,
          confirm_age: data.has('confirm_age'),
          confirm_people: data.has('confirm_people'),
          confirm_publish: data.has('confirm_publish'),
          consent: data.has('consent'),
        },
      });
      if (!start.ok || !start.token) throw new Error(start.error ?? 'start');
      const chunk = start.chunk ?? 8 * 1024 * 1024;
      let offset = 0;
      let failures = 0;
      while (offset < file.size) {
        try {
          const piece = file.slice(offset, Math.min(offset + chunk, file.size));
          const answer = await call(endpoint, {
            action: 'story-chunk',
            token: start.token,
            offset,
            data: await toBase64(piece),
          });
          if (!answer.ok) throw new Error(answer.error ?? 'chunk');
          if (answer.done) offset = file.size;
          else offset = answer.next ?? offset + piece.size;
          failures = 0;
        } catch (err) {
          if (++failures > RETRIES) throw err;
          await new Promise((r) => setTimeout(r, 2000 * failures));
          const where = await call(endpoint, { action: 'story-status', token: start.token }).catch(
            () => undefined,
          );
          if (where?.ok && typeof where.next === 'number') offset = where.next;
        }
        const p = Math.round((offset / file.size) * 100);
        bar.value = p;
        setStatus(fill(msg.sending, { p: num(p) }), '');
      }
      progressBox.hidden = true;
      form.reset();
      attempted = false;
      setStatus(msg.success, 'success');
    } catch (err) {
      console.error(err);
      progressBox.hidden = true;
      setStatus(err instanceof Error && err.message === 'busy' ? msg.busy : msg.error, 'error');
    } finally {
      submit.disabled = false;
      status.focus();
    }
  });
}
