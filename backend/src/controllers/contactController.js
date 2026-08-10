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

    const cleanPhone = (req.body.phone || '').replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone) {
      return errorResponse(res, 400, 'Phone number is required');
    }

    const isDuplicate = contacts.some(c => (c.phone || '').replace(/[\s\-\(\)]/g, '') === cleanPhone);
    if (isDuplicate) {
      return errorResponse(res, 400, 'Duplicate Phone Number: An emergency contact with this phone number already exists in your list.');
    }

    const contactPayload = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || '',
      relationship: req.body.relationship || 'Emergency Contact',
      isPrimary: req.body.isPrimary || false,
      userId: req.user.uid
    };

    const newContact = await firestoreAdminService.addContact(req.user.uid, contactPayload);
    return successResponse(res, 201, 'Emergency contact added successfully', newContact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;

    // Security Hardening: IDOR protection on contact deletion
    const userContacts = await firestoreAdminService.getUserContacts(req.user.uid);
    const existing = userContacts.find(c => c.id === contactId);

    if (!existing && req.user.role !== 'admin') {
      return errorResponse(res, 404, 'Emergency contact not found or access denied');
    }

    await firestoreAdminService.deleteContact(contactId);
    return successResponse(res, 200, 'Contact deleted successfully');
  } catch (error) {
    next(error);
  }
};
