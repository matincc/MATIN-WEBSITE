/** RATE LIMITING: per address, per day, and against Google's real remaining quota. */

/** Returns '' when sending is allowed, otherwise the reason. Counts nothing. */
function ackCheckLimits_(email, secret, now) {
  const props = PropertiesService.getScriptProperties();
  const day = Utilities.formatDate(new Date(now), ACK.TIME_ZONE, 'yyyyMMdd');
  const who = ackHmacHex_('addr:' + email.toLowerCase(), secret).slice(0, 24); // no readable address stored
  if (CacheService.getScriptCache().get('gap:' + who)) return 'rate-limited-10min';
  if (Number(props.getProperty('cnt:' + day + ':' + who) || 0) >= ACK.PER_ADDRESS_PER_DAY) return 'rate-limited-day';
  if (Number(props.getProperty('day:' + day) || 0) >= ACK.DAILY_CAP) return 'daily-cap';
  if (MailApp.getRemainingDailyQuota() < ACK.QUOTA_RESERVE) return 'quota-reserve';
  return '';
}

function ackCountSend_(email, secret, now) {
  const props = PropertiesService.getScriptProperties();
  const day = Utilities.formatDate(new Date(now), ACK.TIME_ZONE, 'yyyyMMdd');
  const who = ackHmacHex_('addr:' + email.toLowerCase(), secret).slice(0, 24);
  CacheService.getScriptCache().put('gap:' + who, '1', ACK.PER_ADDRESS_GAP_SECONDS);
  const k = 'cnt:' + day + ':' + who;
  props.setProperty(k, String(Number(props.getProperty(k) || 0) + 1));
  props.setProperty('day:' + day, String(Number(props.getProperty('day:' + day) || 0) + 1));
}
