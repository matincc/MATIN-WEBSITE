/**
 * Matin Intercultural Institute: visitor acknowledgements.
 * CONFIGURATION. Fixed values live here; anything secret or switchable lives in
 * Project settings > Script properties (never in this code, which is public on GitHub):
 *   ACK_SECRET            shared with Netlify (ACK_SHARED_SECRET), created by ackSetup()
 *   ACK_MODE              off | test | live          (default off: nothing is sent)
 *   ACK_TEST_ALLOWLIST    in test mode, the only addresses that may receive an email
 *   ACK_SENDER            forms | info               (default forms, see Ack_Mailer.gs)
 *   ACK_SIMULATE_FAILURE  on | off                   (testing only)
 *   ACK_LOG_SHEET_ID      the private log spreadsheet, created by ackSetup()
 */
const ACK = {
  FORMS: ['contact', 'benevolat'], // never the newsletter
  LANGS: ['fr', 'en', 'fa'],
  DEFAULT_LANG: 'fr',
  REPLY_TO: 'info@matincc.ca',
  INFO_ADDRESS: 'info@matincc.ca',
  SENDER_NAME: {
    fr: 'Institut interculturel Matin',
    en: 'Matin Intercultural Institute',
    fa: 'مؤسسه میان‌فرهنگی متین',
  },
  MAX_BODY_CHARS: 4000,
  MAX_REQUEST_AGE_MS: 5 * 60 * 1000, // signed requests expire after 5 minutes
  MAX_SUBMISSION_AGE_MS: 48 * 3600 * 1000, // never acknowledge old submissions
  PER_ADDRESS_GAP_SECONDS: 600, // one acknowledgement per address per 10 minutes
  PER_ADDRESS_PER_DAY: 3,
  DAILY_CAP: 100, // conservative, far below Google's quota
  QUOTA_RESERVE: 100, // stop when Google's remaining quota falls below this
  DEDUPE_DAYS: 30,
  LOG_RETENTION_DAYS: 365, // to be confirmed by Matin (retention decision)
  TIME_ZONE: 'America/Montreal',
};

function ackProp_(name, fallback) {
  const v = PropertiesService.getScriptProperties().getProperty(name);
  return v === null || v === '' ? fallback : v;
}
