/**
 * EMAIL SENDING.
 * ACK_SENDER = forms (default): From "Institut interculturel Matin" <forms@matincc.ca>,
 *   Reply-To info@matincc.ca. Needs only the "send email as you" permission.
 * ACK_SENDER = info: From info@matincc.ca. Only possible once Gmail lists info@matincc.ca
 *   as a verified "Send mail as" address of forms@, AND after adding the scope
 *   https://mail.google.com/ to appsscript.json (GmailApp needs full Gmail access).
 */
let ACK_FAKE_SENDS_ = null; // the self-test replaces sending with a list

function ackSend_(to, lang, ref) {
  if (ackProp_('ACK_SIMULATE_FAILURE', 'off') === 'on') throw new Error('simulated-failure');
  const m = ackBuildMessage_(lang, ref);
  const options = { name: ACK.SENDER_NAME[lang], replyTo: ACK.REPLY_TO, htmlBody: m.html };
  if (ACK_FAKE_SENDS_) {
    ACK_FAKE_SENDS_.push({ to: to, lang: lang, ref: ref, subject: m.subject });
    return;
  }
  if (ackProp_('ACK_SENDER', 'forms') === 'info') {
    options.from = ACK.INFO_ADDRESS;
    GmailApp.sendEmail(to, m.subject, m.text, options);
  } else {
    MailApp.sendEmail(to, m.subject, m.text, options);
  }
}
