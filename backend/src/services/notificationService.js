import axios from 'axios';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

export const checkNotificationConfig = () => {
  const hasTwilio = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasGmailSmtp = Boolean((process.env.EMAIL_USER || process.env.SMTP_USER) && (process.env.EMAIL_PASS || process.env.SMTP_PASS));
  const hasSendGrid = Boolean(process.env.SENDGRID_API_KEY);
  const hasTelegram = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

  console.log('====================================================');
  console.log('🚨 SAFEHAVEN EMERGENCY NOTIFICATION ENGINE STATUS');
  console.log(`• Twilio SMS Provider: ${hasTwilio ? '✅ ACTIVE' : '⚠️ NOT CONFIGURED (Optional)'}`);
  console.log(`• Resend Email Provider (Free 3K/mo): ${hasResend ? '✅ ACTIVE' : '⚠️ NOT CONFIGURED'}`);
  console.log(`• Gmail SMTP Provider: ${hasGmailSmtp ? '✅ ACTIVE' : '⚠️ NOT CONFIGURED'}`);
  console.log(`• SendGrid Email Provider: ${hasSendGrid ? '✅ ACTIVE' : '⚠️ NOT CONFIGURED'}`);
  console.log(`• Telegram Bot Provider (100% Free): ${hasTelegram ? '✅ ACTIVE' : '⚠️ NOT CONFIGURED'}`);
  if (!hasTwilio && !hasResend && !hasGmailSmtp && !hasSendGrid && !hasTelegram) {
    console.log('⚠️ MODE: SIMULATION ACTIVE (No third-party provider keys configured)');
  }
  console.log('====================================================');
};

/**
 * Dispatches transactional email (Account Verification / Password Reset / Login Alerts)
 */
export const sendTransactionalEmail = async ({ to, subject, htmlContent }) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.ALERT_FROM_EMAIL || 'no-reply@safehaven.app';

  // 1. Gmail / Custom SMTP Provider (via Nodemailer) - Direct 100% Inbox Delivery
  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
      await transporter.sendMail({
        from: `"SafeHaven Security" <${emailUser}>`,
        to,
        subject,
        html: htmlContent
      });
      logger.info(`Transactional Email successfully dispatched via Gmail SMTP to ${to}`);
      return { success: true, provider: 'Gmail SMTP' };
    } catch (err) {
      logger.error(`Gmail SMTP dispatch error for ${to}: ${err.message}`);
    }
  }

  // 2. Resend API Provider
  if (resendApiKey) {
    try {
      await axios.post(
        'https://api.resend.com/emails',
        { from: fromEmail, to: [to], subject, html: htmlContent },
        { headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' } }
      );
      logger.info(`Transactional Email successfully dispatched via Resend to ${to}`);
      return { success: true, provider: 'Resend' };
    } catch (err) {
      logger.error(`Resend dispatch error for ${to}: ${err.message}`);
    }
  }

  // 3. SendGrid Provider
  if (sendgridApiKey) {
    try {
      await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail },
          subject,
          content: [{ type: 'text/html', value: htmlContent }]
        },
        { headers: { 'Authorization': `Bearer ${sendgridApiKey}`, 'Content-Type': 'application/json' } }
      );
      logger.info(`Transactional Email successfully dispatched via SendGrid to ${to}`);
      return { success: true, provider: 'SendGrid' };
    } catch (err) {
      logger.error(`SendGrid dispatch error for ${to}: ${err.message}`);
    }
  }

  logger.warn(`[SIMULATED TRANSACTIONAL EMAIL] To: ${to} | Subject: "${subject}"`);
  return { success: true, simulated: true };
};

/**
 * Dispatches automated security alert when user logs in
 */
export const sendLoginAlertEmail = async ({ to, fullName, loginTime }) => {
  const time = loginTime || new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  const subject = '🛡️ SafeHaven Security Alert: You logged in to Women Safety App';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #f4f4f5; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #121215; border: 1px solid #27272a; border-radius: 16px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 900; color: #e11d48; letter-spacing: -0.5px; }
        .badge { display: inline-block; background: rgba(225, 29, 72, 0.15); color: #fb7185; border: 1px solid rgba(225, 29, 72, 0.3); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-top: 6px; }
        .info-box { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #27272a; }
        .info-row:last-child { border-bottom: none; }
        .label { color: #a1a1aa; }
        .val { color: #ffffff; font-weight: 600; text-align: right; }
        .warning { font-size: 12px; color: #a1a1aa; line-height: 1.6; margin-top: 20px; border-top: 1px solid #27272a; padding-top: 16px; }
        .btn { display: block; text-align: center; background: #e11d48; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 20px; border-radius: 10px; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">🛡️ SafeHaven</div>
          <span class="badge">Security Notice • New Sign-In</span>
        </div>
        <p style="font-size: 15px; margin: 0 0 12px 0;">Hello <strong>${fullName || to.split('@')[0]}</strong>,</p>
        <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6; margin: 0;">
          This is an automated confirmation that your account was successfully logged in to the <strong>SafeHaven Women Safety Web Application</strong>.
        </p>

        <div class="info-box">
          <div class="info-row">
            <span class="label">Account Email:</span>
            <span class="val">${to}</span>
          </div>
          <div class="info-row">
            <span class="label">Date & Time:</span>
            <span class="val">${time}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="val" style="color: #34d399;">Authenticated ✅</span>
          </div>
        </div>

        <div class="warning">
          <strong style="color: #f43f5e;">Was this you?</strong><br>
          If you just signed in, you can safely ignore this email. If you did NOT sign in, someone else may have gained access to your credentials. Please secure your account immediately.
        </div>

        <a href="https://women-safety-web-app.vercel.app/forgot-password" class="btn">
          Change / Reset Password
        </a>
      </div>
    </body>
    </html>
  `;

  return await sendTransactionalEmail({ to, subject, htmlContent });
};

/**
 * Dispatches outbound SMS, Email, and/or Telegram alerts to emergency contacts.
 */
export const sendSOSOutboundAlert = async (contact, alertData) => {
  const { userName, userPhone, latitude, longitude, address, locationUrl } = alertData;

  const smsText = `🚨 EMERGENCY SOS ALERT! ${userName} (${userPhone || 'No phone'}) needs urgent help! Location: ${address}. Map: ${locationUrl}`;

  let smsSent = false;
  let emailSent = false;
  let telegramSent = false;
  const errors = [];

  // 1. Twilio Outbound SMS Integration (Optional Paid SMS)
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && fromNumber && contact.phone) {
    try {
      const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', contact.phone);
      params.append('From', fromNumber);
      params.append('Body', smsText);

      const twilioRes = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        params.toString(),
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      if (twilioRes.status === 201 || twilioRes.status === 200) {
        smsSent = true;
        logger.info(`Twilio SMS successfully dispatched to ${contact.phone}`);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      logger.error(`Twilio SMS dispatch failed for ${contact.phone}: ${errMsg}`);
      errors.push(`SMS Error: ${errMsg}`);
    }
  }

  // 2. Resend / SendGrid Email Outbound Integration (Free Tier Available)
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  if (contact.email && (resendApiKey || sendgridApiKey)) {
    try {
      const htmlBody = `
        <div style="font-family: sans-serif; padding: 20px; background: #09090b; color: #fff;">
          <h2 style="color: #e11d48;">🚨 EMERGENCY SOS DISTRESS ALERT</h2>
          <p><strong>User:</strong> ${userName} (${userPhone || 'N/A'})</p>
          <p><strong>Location:</strong> ${address}</p>
          <p><strong>GPS Coordinates:</strong> ${latitude}, ${longitude}</p>
          <p><a href="${locationUrl}" style="background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Live Location on Map</a></p>
        </div>
      `;

      await sendTransactionalEmail({
        to: contact.email,
        subject: `🚨 EMERGENCY SOS: ${userName} Needs Assistance`,
        htmlContent: htmlBody
      });
      emailSent = true;
    } catch (err) {
      errors.push(`Email Error: ${err.message}`);
    }
  }

  // 3. Telegram Bot Integration (100% FREE Unlimited Alerts)
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = contact.telegramChatId || process.env.TELEGRAM_CHAT_ID;

  if (telegramBotToken && telegramChatId) {
    try {
      const telegramText = `🚨 *EMERGENCY SOS DISTRESS ALERT*\n\n*User:* ${userName} (${userPhone || 'N/A'})\n*Location:* ${address}\n\n📍 [View Live Location on Google Maps](${locationUrl})`;
      await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        chat_id: telegramChatId,
        text: telegramText,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      });
      telegramSent = true;
      logger.info(`Telegram Emergency Alert successfully dispatched to chat ${telegramChatId}`);
    } catch (err) {
      errors.push(`Telegram Error: ${err.message}`);
    }
  }

  if (accountSid || resendApiKey || sendgridApiKey || telegramBotToken) {
    return { smsSent, emailSent, telegramSent, errors };
  }

  // Demo / Simulation Mode when no paid/free API keys are set in environment variables
  logger.warn(`[SIMULATION MODE] No notification provider keys configured. Outbound alert to ${contact.name} (${contact.phone || contact.email || 'N/A'}) captured.`);
  return { smsSent: true, emailSent: true, telegramSent: true, simulated: true };
};
