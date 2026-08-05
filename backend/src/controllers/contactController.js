import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await firestoreAdminService.getUserContacts(req.user.uid);
    return successResponse(res, 200, 'Contacts retrieved', contacts);
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const contacts = await firestoreAdminService.getUserContacts(req.user.uid);
    if (contacts.length >= 5) {
      return errorResponse(res, 400, 'Maximum limit of 5 emergency contacts reached');
    }
    const newContact = await firestoreAdminService.addContact(req.user.uid, req.body);
    return successResponse(res, 201, 'Emergency contact added', newContact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    await firestoreAdminService.deleteContact(req.params.id);
    return successResponse(res, 200, 'Contact deleted successfully');
  } catch (error) {
    next(error);
  }
};
