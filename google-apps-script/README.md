# Visitor acknowledgements (Google Apps Script)

This script runs in the Google Workspace account **forms@matincc.ca**, in the Apps Script project "Matin Email Automation". After a visitor sends the Contact & Collaboration form or the Volunteer form, it sends them **one** acknowledgement, in French, English or Persian. Netlify Forms keeps storing every submission and sending its own notifications, unchanged.

**No secret is stored in this folder.** The code is public; secrets live only in Script properties (Google) and in environment variables (Netlify).

## How it works

```
Visitor → Netlify Forms (stores, spam filter, notifies matincc.mtl@gmail.com and info@)   unchanged
        → Netlify runs netlify/functions/submission-created.mts (event "submission-created")
            1. re-reads the submission from the Netlify API (NETLIFY_API_TOKEN):
               must exist, be verified (not spam) and belong to "contact" or "benevolat"
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
| `Ack_Store.gs` | Duplicate prevention, private log sheet, retention |
| `Ack_RateLimit.gs` | Per-address limits, daily cap and quota reserve |
| `Ack_Mailer.gs` | Sending (forms@ with Reply-To info@, or info@ once verified) |
| `Ack_Main.gs` | `doPost`, the web app entry point |
| `Ack_Setup.gs` | Manual tools: `ackSetup`, `ackShowSecretForNetlify`, `ackRotateSecret`, `ackReportQuota`, `ackSendPreviewToMe`, `ackSelfTest` |
| `appsscript.json` | Time zone, and the **only** permissions allowed: send email, spreadsheets |

## Script properties (Project settings → Script properties)

| Name | Value |
| --- | --- |
| `ACK_SECRET` | created by `ackSetup`; copy to Netlify as `ACK_SHARED_SECRET` |
| `ACK_MODE` | `off` (default: nothing sent), `test` (only `ACK_TEST_ALLOWLIST`), `live` |
| `ACK_TEST_ALLOWLIST` | your own test addresses, separated by commas |
| `ACK_SENDER` | `forms` (default) or `info` (see below) |
| `ACK_SIMULATE_FAILURE` | `off`; `on` only during the failure test |
| `ACK_LOG_SHEET_ID` | created by `ackSetup` |

## Netlify environment variables (names only)

`ACK_ENDPOINT_URL`, `ACK_SHARED_SECRET`, `NETLIFY_API_TOKEN`. Use scope **Functions**, and tick **Contains secret values** for the last two. Without all three, nothing happens.

## Sender

- **`forms` (default):** From "Institut interculturel Matin" / "Matin Intercultural Institute" / «مؤسسه میان‌فرهنگی متین» <forms@matincc.ca>, with Reply-To info@matincc.ca. Only the "send email" permission is needed.
- **`info`:** From info@matincc.ca. Possible only if:
  1. Gmail of forms@ lists info@matincc.ca under Settings → Accounts → "Send mail as", verified;
  2. `"https://mail.google.com/"` is added to `oauthScopes` in `appsscript.json`. GmailApp requires full access to the forms@ mailbox, so this is a separate decision.

## Stopping it

- Set `ACK_MODE` to `off`. This is instant, needs no deploy and uses no credits.
- Or archive the web app deployment.

Netlify Forms keeps working either way.
