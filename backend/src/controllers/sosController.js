import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { sendSOSOutboundAlert } from '../services/notificationService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const triggerSOS = async (req, res, next) => {
  try {
    const { latitude, longitude, address, userName, userPhone } = req.body;
    const contacts = await firestoreAdminService.getUserContacts(req.user.uid);

    if (!contacts || contacts.length === 0) {
      logger.warn(`SOS triggered for user ${req.user.uid} with 0 registered emergency contacts.`);
    }

    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const alertData = {
      userName: userName || req.user.fullName || 'User',
      userPhone: userPhone || req.user.phone || '',
      latitude,
      longitude,
      address: address || `Lat: ${latitude}, Lng: ${longitude}`,
      locationUrl
    };

    // Dispatch outbound alerts to all registered emergency contacts
    const dispatchResults = await Promise.all(
      contacts.map(async (contact) => {
        try {
          const res = await sendSOSOutboundAlert(contact, alertData);
          return {
            contactId: contact.id,
            name: contact.name,
            phone: contact.phone || '',
            email: contact.email || '',
            status: 'DELIVERED',
            simulated: res.simulated || false,
            alertedAt: new Date().toISOString()
          };
        } catch (err) {
          logger.error(`Delivery failure for contact ${contact.name}: ${err.message}`);
          return {
            contactId: contact.id,
            name: contact.name,
            phone: contact.phone || '',
            email: contact.email || '',
            status: 'FAILED',
            error: err.message,
            alertedAt: new Date().toISOString()
          };
        }
      })
    );

    const successfulDeliveries = dispatchResults.filter(r => r.status === 'DELIVERED');
    const failedDeliveries = dispatchResults.filter(r => r.status === 'FAILED');

    let alertStatus = 'FULLY_ALERTED';
    if (contacts.length === 0) {
      alertStatus = 'NO_CONTACTS_REGISTERED';
    } else if (failedDeliveries.length === contacts.length) {
      alertStatus = 'ALERT_FAILED';
    } else if (failedDeliveries.length > 0) {
      alertStatus = 'PARTIALLY_ALERTED';
    }

    const sosRecord = await firestoreAdminService.triggerSOS(req.user.uid, {
      latitude,
      longitude,
      address: alertData.address,
      userName: alertData.userName,
      userPhone: alertData.userPhone,
      alertStatus,
      contactsAlerted: dispatchResults,
      deliveryFailures: failedDeliveries
    });

    // Generate In-App Emergency Notification Document for User Dashboard
    await firestoreAdminService.createNotification({
      userId: req.user.uid,
      title: '🚨 Emergency SOS Distress Alert Triggered',
      message: `Distress signal dispatched to ${contacts.length} saved emergency contact(s) at location: ${alertData.address}.`,
      type: 'EMERGENCY'
    });

    const statusCode = alertStatus === 'ALERT_FAILED' ? 502 : 201;
    const msg = alertStatus === 'FULLY_ALERTED'
      ? '🚨 Emergency SOS Triggered! All emergency contacts alerted.'
      : alertStatus === 'PARTIALLY_ALERTED'
      ? '🚨 Emergency SOS Triggered! Partial delivery failure logged.'
      : alertStatus === 'NO_CONTACTS_REGISTERED'
      ? '🚨 Emergency SOS Triggered! No emergency contacts registered.'
      : '🚨 Emergency SOS Triggered! Delivery failed for emergency contacts.';

    return successResponse(res, statusCode, msg, sosRecord);
  } catch (error) {
    next(error);
  }
};

export const getSOSHistory = async (req, res, next) => {
  try {
    const history = await firestoreAdminService.getSOSHistory(req.user.uid);
    return successResponse(res, 200, 'SOS history fetched', history);
  } catch (error) {
    next(error);
  }
};

export const getAllSOSAlerts = async (req, res, next) => {
  try {
    const alerts = await firestoreAdminService.getAllSOSAlerts();
    
    // Data exposure hardening: Sanitize bulk SOS payload (omit full third-party phone lists in bulk feed)
    const sanitizedAlerts = alerts.map(alert => {
      const { contactsAlerted, deliveryFailures, ...safeAlert } = alert;
      return {
        ...safeAlert,
        contactsCount: Array.isArray(contactsAlerted) ? contactsAlerted.length : 0
      };
    });

    return successResponse(res, 200, 'All SOS alerts fetched', sanitizedAlerts);
  } catch (error) {
    next(error);
  }
};

export const updateSOSStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
    const updated = await firestoreAdminService.updateSOSStatus(req.params.id, status);

    await firestoreAdminService.createAuditLog({
      performedByUid: req.user.uid,
      performedByName: req.user.fullName || req.user.email,
      action: 'SOS_STATUS_CHANGE',
      targetId: req.params.id,
      details: { newStatus: status }
    });

    return successResponse(res, 200, `SOS status updated to ${status}`, updated);
  } catch (error) {
    next(error);
  }
};
