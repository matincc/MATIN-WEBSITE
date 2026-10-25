# Visitor acknowledgements (Google Apps Script)

This script runs in the Google Workspace account **forms@matincc.ca**, in the Apps Script project "Matin Email Automation". After a visitor sends the Contact & Collaboration form or the Volunteer form, it sends them **one** acknowledgement, in French, English or Persian. Netlify Forms keeps storing every submission and sending its own notifications, unchanged.

**No secret is stored in this folder.** The code is public; secrets live only in Script properties (Google) and in environment variables (Netlify).

## How it works

```
Visitor → Netlify Forms (stores, spam filter, notifies matincc.mtl@gmail.com and info@)   unchanged
        → Netlify runs netlify/functions/submission-created.mts (event "submission-created")
            (Netlify runs it only for verified, non-spam submissions, and signs each
             event so outside requests cannot invoke it; no access token is needed)
            1. keeps only "contact" and "benevolat", skips the honeypot
            2. sends {id, form, lang, email, created_at}, a timestamp and an HMAC-SHA256
               signature (ACK_SHARED_SECRET) to the web app (ACK_ENDPOINT_URL)
        → doPost (Ack_Main.gs) in forms@:
            signature and 5-minute expiry → validation → duplicate check →
            mode (off / test / live) → per-address and daily limits → Google's quota →
            send one fixed template → private log row
```

The visitor's name and message never leave Netlify.

## Files

| File | Role |
| --- | --- |
| `Ack_Config.gs` | Fixed settings (forms, limits, sender names) and the list of Script properties |
| `Ack_Templates.gs` | The three approved texts (Oct 24 2026), word for word |
| `Ack_Security.gs` | Signature check, expiry, reference numbers |
| `Ack_Validation.gs` | Submission validation and language selection |
| `Ack_Store.gs` | Duplicate prevention (3 days), private log sheet (90 days: time, reference, Netlify id, form, language, status; no names, addresses or messages) |
| `Ack_RateLimit.gs` | Per-address limits, daily cap and quota reserve |
| `Ack_Mailer.gs` | Sending (forms@ with Reply-To info@, or info@ once verified) |
| `Ack_Main.gs` | `doPost`, the web app entry point |
| `Ack_Setup.gs` | Manual tools: `ackSetup`, `ackShowSecretForNetlify`, `ackRotateSecret`, `ackReportQuota`, `ackSendPreviewToMe`, `ackSelfTest`, `ackEndToEndTest`, and, at activation only, `ackInstallDailyCleanup` |
| `appsscript.json` | Time zone and the **only** permissions allowed in Part 1: send email (MailApp) and spreadsheets (the log). Part 2 adds `script.external_request` (only `ackEndToEndTest` calls the web app); activation adds `script.scriptapp` (only the daily clean-up). The web app settings are chosen in Deploy, never here. |

## Script properties (Project settings → Script properties)

| Name | Value |
| --- | --- |
| `ACK_SECRET` | created by `ackSetup`; copy to Netlify as `ACK_SHARED_SECRET` |
| `ACK_MODE` | `off` (default: nothing sent), `test` (only `ACK_TEST_ALLOWLIST`), `live` |
| `ACK_TEST_ALLOWLIST` | your own test addresses, separated by commas |
| `ACK_SENDER` | `forms` (default) or `info` (see below) |
| `ACK_SIMULATE_FAILURE` | `off`; `on` only during the failure test |
| `ACK_LOG_SHEET_ID` | created by `ackSetup` |
| `ACK_WEBAPP_URL` | the web app address, only for `ackEndToEndTest` |

## Netlify environment variables (names only)

`ACK_ENDPOINT_URL` and `ACK_SHARED_SECRET`. Without both, nothing happens. Set a value only in the deploy context being tested (Deploy Previews first, Production at activation). On plans without scopes, leave "All scopes": no website code reads these names, and Astro only exposes `PUBLIC_` variables to the browser.

## Sender

- **`forms` (default, approved by Matin on Oct 24 2026):** From "Matin Intercultural Institute" <forms@matincc.ca>, with Reply-To info@matincc.ca.
- **`info`:** From info@matincc.ca. Possible only if:
  1. Gmail of forms@ lists info@matincc.ca under Settings → Accounts → "Send mail as", verified;
  2. `"https://mail.google.com/"` is added to `oauthScopes` in `appsscript.json`. GmailApp requires full access to the forms@ mailbox, so this is a separate decision.

## Stopping it

- Set `ACK_MODE` to `off`. This is instant, needs no deploy and uses no credits.
- Or archive the web app deployment.

Netlify Forms keeps working either way.
