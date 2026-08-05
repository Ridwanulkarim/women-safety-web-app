import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const triggerSOS = async (req, res, next) => {
  try {
    const { latitude, longitude, address, userName, userPhone } = req.body;
    const contacts = await firestoreAdminService.getUserContacts(req.user.uid);

    const sosRecord = await firestoreAdminService.triggerSOS(req.user.uid, {
      latitude,
      longitude,
      address,
      userName: userName || req.user.fullName || 'User',
      userPhone: userPhone || '',
      contactsAlerted: contacts.map(c => ({ name: c.name, phone: c.phone }))
    });

    return successResponse(res, 201, '🚨 Emergency SOS Triggered! Alerts sent.', sosRecord);
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
    return successResponse(res, 200, 'All SOS alerts fetched', alerts);
  } catch (error) {
    next(error);
  }
};

export const updateSOSStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
    const updated = await firestoreAdminService.updateSOSStatus(req.params.id, status);
    return successResponse(res, 200, `SOS status updated to ${status}`, updated);
  } catch (error) {
    next(error);
  }
};
