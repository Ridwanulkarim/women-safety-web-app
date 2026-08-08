import axios from 'axios';
import { logger } from '../utils/logger.js';

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
      if (resendApiKey) {
        await axios.post(
          'https://api.resend.com/emails',
          {
            from: process.env.ALERT_FROM_EMAIL || 'alerts@safehaven.app',
            to: [contact.email],
            subject: `🚨 EMERGENCY SOS: ${userName} Needs Assistance`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; background: #09090b; color: #fff;">
                <h2 style="color: #e11d48;">🚨 EMERGENCY SOS DISTRESS ALERT</h2>
                <p><strong>User:</strong> ${userName} (${userPhone || 'N/A'})</p>
                <p><strong>Location:</strong> ${address}</p>
                <p><strong>GPS Coordinates:</strong> ${latitude}, ${longitude}</p>
                <p><a href="${locationUrl}" style="background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Live Location on Map</a></p>
              </div>
            `
          },
          {
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        emailSent = true;
        logger.info(`Resend Email successfully dispatched to ${contact.email}`);
      } else if (sendgridApiKey) {
        await axios.post(
          'https://api.sendgrid.com/v3/mail/send',
          {
            personalizations: [{ to: [{ email: contact.email }] }],
            from: { email: process.env.ALERT_FROM_EMAIL || 'alerts@safehaven.app' },
            subject: `🚨 EMERGENCY SOS: ${userName} Needs Assistance`,
            content: [{ type: 'text/html', value: `<p>🚨 EMERGENCY SOS: ${userName} at ${address}. Map: ${locationUrl}</p>` }]
          },
          {
            headers: {
              'Authorization': `Bearer ${sendgridApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        emailSent = true;
        logger.info(`SendGrid Email successfully dispatched to ${contact.email}`);
      }
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.message || err.message;
      logger.error(`Email dispatch failed for ${contact.email}: ${errMsg}`);
      errors.push(`Email Error: ${errMsg}`);
    }
  }

  // If external provider credentials are specified in environment:
  if (accountSid || resendApiKey || sendgridApiKey) {
    if (!smsSent && !emailSent) {
      throw new Error(errors.join('; ') || 'Outbound notification delivery failed');
    }
    return { smsSent, emailSent };
  }

  // Fallback: If no external SMS/Email API keys are set in dev environment, log delivery attempt
  logger.warn(`No Twilio/Resend API keys configured. Simulating outbound notification to ${contact.name} (${contact.phone || contact.email || 'N/A'}). Alert Message: ${smsText}`);
  return { smsSent: true, emailSent: false, simulated: true };
};
