/**
 * MESSAGE TEMPLATES: the texts approved by Matin on 2026-10-24, word for word.
 * Only {REF} changes. Never put the visitor's name or message in an email.
 */
const ACK_TEMPLATES = {
  fr: {
    subject: 'Nous avons bien reçu votre message — Institut interculturel Matin',
    paragraphs: [
      'Bonjour,',
      "Merci d'avoir communiqué avec l'Institut interculturel Matin.",
      "Nous avons bien reçu votre message et vous remercions de l'intérêt que vous portez à nos activités. Nous examinerons votre demande dans les meilleurs délais.",
      'Référence : {REF}',
      'Cordialement,',
      "L'équipe de l'Institut interculturel Matin",
      'Montréal, Québec, Canada',
      'https://matincc.ca',
      'Ceci est un accusé de réception automatique. Vous pouvez répondre à ce courriel pour nous transmettre des renseignements complémentaires.',
    ],
  },
  en: {
    subject: "We've received your message — Matin Intercultural Institute",
    paragraphs: [
      'Hello,',
      'Thank you for contacting Matin Intercultural Institute.',
      'We have received your message and appreciate your interest in our work. We will review your inquiry as soon as possible.',
      'Reference: {REF}',
      'Warm regards,',
      'The Matin Intercultural Institute Team',
      'Montréal, Québec, Canada',
      'https://matincc.ca',
      'This is an automatic acknowledgement. You may reply to this email if you would like to provide additional information.',
    ],
  },
  fa: {
    subject: 'پیام شما دریافت شد — مؤسسه میان‌فرهنگی متین',
    paragraphs: [
      'سلام،',
      'از اینکه با مؤسسه میان‌فرهنگی متین تماس گرفته‌اید، سپاسگزاریم.',
      'پیام شما با موفقیت دریافت شد. از توجه و علاقه‌مندی شما به فعالیت‌های مؤسسه قدردانی می‌کنیم و در نخستین فرصت پیام شما را بررسی خواهیم کرد.',
      'شماره پیگیری: {REF}',
      'با احترام و سپاس،',
      'مؤسسه میان‌فرهنگی متین',
      'مونترآل، کانادا',
      'https://matincc.ca',
      'این پیام به‌صورت خودکار ارسال شده است. برای افزودن توضیحات، کافی است به همین ایمیل پاسخ دهید.',
    ],
  },
};

/** Builds the plain-text and HTML versions. All content is fixed except the reference. */
function ackBuildMessage_(lang, ref) {
  const t = ACK_TEMPLATES[lang];
  const paras = t.paragraphs.map((p) => p.replace('{REF}', ref));
  const rtl = lang === 'fa';
  const last = paras.length - 1;
  const html = paras
    .map((p, i) => {
      if (p === 'https://matincc.ca') return '<p style="margin:0 0 14px"><a href="https://matincc.ca" style="color:#193A53">https://matincc.ca</a></p>';
      const text = p.indexOf(ref) >= 0 ? p.replace(ref, '<strong dir="ltr">' + ref + '</strong>') : p;
      const style = i === last ? 'margin:18px 0 0;font-size:13px;color:#555' : 'margin:0 0 14px';
      return '<p style="' + style + '">' + text + '</p>';
    })
    .join('');
  return {
    subject: t.subject,
    text: paras.join('\n\n'),
    html:
      '<div dir="' + (rtl ? 'rtl' : 'ltr') + '" style="font-family:' + (rtl ? 'Tahoma,Arial' : 'Arial,Helvetica') +
      ',sans-serif;font-size:15px;line-height:1.6;color:#293442;text-align:' + (rtl ? 'right' : 'left') + '">' + html + '</div>',
  };
}
