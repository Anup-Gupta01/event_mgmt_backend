const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to        - Recipient email address
 * @param {string} options.subject   - Email subject
 * @param {string} options.html      - HTML body
 * @param {string} [options.text]    - Plain text fallback
 */
const sendMail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from:    process.env.EMAIL_FROM || 'Raj Mahal Events <no-reply@rajmahal.com>',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    throw error;
  }
};

/**
 * Booking confirmation email template
 */
sendMail.bookingConfirmation = ({ name, bookingId, eventType, date, venue }) => ({
  subject: `Booking Confirmed — ${bookingId} | Raj Mahal`,
  html: `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1410;">
      <div style="background: #6B1F2A; padding: 24px 32px;">
        <h1 style="color: #D4AF5A; margin: 0; font-size: 24px;">✦ Raj Mahal</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">Palace & Events · Est. 1947 · Jaipur</p>
      </div>
      <div style="padding: 32px; background: #FAF7F2; border: 1px solid #E0D5C8;">
        <h2 style="color: #6B1F2A; margin-top: 0;">Booking Request Received</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for choosing Raj Mahal. Your booking request has been received and is under review.</p>
        <div style="background: #fff; border: 1px solid #E0D5C8; border-left: 4px solid #B8972A; padding: 16px 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #8C7B6E;">Booking ID</p>
          <p style="margin: 4px 0 0; font-size: 22px; font-weight: 700; letter-spacing: 0.08em; color: #6B1F2A;">${bookingId}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${[['Event', eventType], ['Date', date], ['Venue', venue]].map(([k, v]) => `
          <tr>
            <td style="padding: 8px 0; color: #8C7B6E; width: 40%;">${k}</td>
            <td style="padding: 8px 0; font-weight: 500;">${v || '—'}</td>
          </tr>`).join('')}
        </table>
        <p style="margin-top: 24px;">Our team will reach out within <strong>24 hours</strong> with a personalised proposal.</p>
        <p>To track your booking anytime, visit: <a href="http://localhost:5173/track?id=${bookingId}" style="color: #6B1F2A;">Track Booking →</a></p>
      </div>
      <div style="padding: 16px 32px; background: #1C1410; text-align: center; font-size: 12px; color: rgba(255,255,255,0.4);">
        © ${new Date().getFullYear()} Raj Mahal Palace & Events · Jaipur, Rajasthan
      </div>
    </div>
  `,
});

module.exports = sendMail;
