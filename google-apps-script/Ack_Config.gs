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
 *   ACK_WEBAPP_URL        the published web app address (only for ackEndToEndTest)
 */
const ACK = {
  FORMS: ['contact', 'benevolat'], // never the newsletter
  LANGS: ['fr', 'en', 'fa'],
  DEFAULT_LANG: 'fr',
  REPLY_TO: 'info@matincc.ca',
  INFO_ADDRESS: 'info@matincc.ca',
  SENDER_NAME: 'Matin Intercultural Institute', // approved by Matin, Oct 24 2026
  MAX_BODY_CHARS: 4000,
  MAX_REQUEST_AGE_MS: 5 * 60 * 1000, // signed requests expire after 5 minutes
  MAX_SUBMISSION_AGE_MS: 48 * 3600 * 1000, // never acknowledge old submissions
  PER_ADDRESS_GAP_SECONDS: 600, // one acknowledgement per address per 10 minutes
  PER_ADDRESS_PER_DAY: 3,
  DAILY_CAP: 100, // conservative, far below Google's quota
  QUOTA_RESERVE: 100, // stop when Google's remaining quota falls below this
  // Duplicate records are only needed while Netlify could still deliver the same event:
  // requests expire after 5 minutes and submissions older than 48 h are refused.
  DEDUPE_DAYS: 3,
  LOG_RETENTION_DAYS: 90, // Matin's decision, Oct 24 2026: minimal technical logs only
  TIME_ZONE: 'America/Montreal',
};

function ackProp_(name, fallback) {
  const v = PropertiesService.getScriptProperties().getProperty(name);
  return v === null || v === '' ? fallback : v;
}
