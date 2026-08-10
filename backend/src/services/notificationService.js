import axios from 'axios';
import { logger } from '../utils/logger.js';

export const checkNotificationConfig = () => {
  const hasTwilio = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasSendGrid = Boolean(process.env.SENDGRID_API_KEY);

  console.log('====================================================');
  console.log('🚨 SAFEHAVEN EMERGENCY NOTIFICATION ENGINE STATUS');
  console.log(`• Twilio SMS Provider: ${hasTwilio ? '✅ ACTIVE' : '⚠️ NOT CONFIGURED'}`);
  console.log(`• Resend Email Provider: ${hasResend ? '✅ ACTIVE' : '⚠️ NOT CONFIGURED'}`);
  console.log(`• SendGrid Email Provider: ${hasSendGrid ? '✅ ACTIVE' : '⚠️ NOT CONFIGURED'}`);
  if (!hasTwilio && !hasResend && !hasSendGrid) {
    console.log('⚠️ MODE: SIMULATION ACTIVE (No Twilio/Resend keys configured in environment variables)');
  }
  console.log('====================================================');
};

/**
 * Dispatches transactional email (Account Verification / Password Reset)
 */
export const sendTransactionalEmail = async ({ to, subject, htmlContent }) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.ALERT_FROM_EMAIL || 'no-reply@safehaven.app';

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
  } else if (sendgridApiKey) {
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
 * Dispatches outbound SMS (via Twilio) and/or Email (via Resend or SendGrid) to emergency contacts.
 */
export const sendSOSOutboundAlert = async (contact, alertData) => {
  const { userName, userPhone, latitude, longitude, address, locationUrl } = alertData;

  const smsText = `🚨 EMERGENCY SOS ALERT! ${userName} (${userPhone || 'No phone'}) needs urgent help! Location: ${address}. Map: ${locationUrl}`;

  let smsSent = false;
  let emailSent = false;
  const errors = [];

  // 1. Twilio Outbound SMS Integration
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

  // 2. Resend / SendGrid Email Outbound Integration
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

  if (accountSid || resendApiKey || sendgridApiKey) {
    return { smsSent, emailSent, errors };
  }

  // Demo / Simulation Mode when provider keys are not configured in Vercel environment variables
  logger.warn(`[SIMULATION MODE] No Twilio/Resend API keys configured. Outbound alert to ${contact.name} (${contact.phone || contact.email || 'N/A'}) logged in console.`);
  return { smsSent: true, emailSent: true, simulated: true };
};
