import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Bulk fetch users (Admin Only).
 * Strips sensitive password hashes and unnecessary bulk details.
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await firestoreAdminService.getAllUsers();
    
    // Data exposure hardening: Sanitize bulk user payload
    const sanitizedUsers = users.map(user => {
      const { passwordHash, emergencyContacts, locationHistory, deviceInfo, ...safeUser } = user;
      return {
        ...safeUser,
        emergencyContactsCount: Array.isArray(emergencyContacts) ? emergencyContacts.length : 0
      };
    });

    return successResponse(res, 200, 'Users fetched', sanitizedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch single user profile by UID.
 * Enforces IDOR protection: Users can only request their own profile unless requester is Admin.
 */
export const getUserByUid = async (req, res, next) => {
  try {
    const { uid } = req.params;

    if (req.user.role !== 'admin' && req.user.uid !== uid) {
      return errorResponse(res, 403, 'Forbidden: You can only view your own profile');
    }

    const user = await firestoreAdminService.getUserByUid(uid);
    if (!user) return errorResponse(res, 404, 'User not found');

    const { passwordHash, ...sanitizedUser } = user;
    return successResponse(res, 200, 'User fetched', sanitizedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile by UID.
 * Enforces IDOR protection and prevents non-admins from modifying role or status.
 */
export const updateUser = async (req, res, next) => {
  try {
    const { uid } = req.params;

    if (req.user.role !== 'admin' && req.user.uid !== uid) {
      return errorResponse(res, 403, 'Forbidden: You can only update your own profile');
    }

    const updatePayload = { ...req.body };

    // Security Hardening: Non-admins cannot alter their role or account status
    if (req.user.role !== 'admin') {
      delete updatePayload.role;
      delete updatePayload.status;
      delete updatePayload.passwordHash;
    }

    const updated = await firestoreAdminService.updateUser(uid, updatePayload);

    // Audit log if role was updated by admin
    if (req.user.role === 'admin' && req.body.role) {
      await firestoreAdminService.createAuditLog({
        performedByUid: req.user.uid,
        performedByName: req.user.fullName || req.user.email,
        action: 'USER_ROLE_CHANGE',
        targetId: uid,
        details: { newRole: req.body.role }
      });
    }

    const { passwordHash, ...sanitizedUpdated } = updated;
    return successResponse(res, 200, 'User updated successfully', sanitizedUpdated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin action: Update user status ('active' | 'suspended').
 * Generates an Audit Log entry in auditLogs.
 */
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'active' | 'suspended'
    const updated = await firestoreAdminService.updateUser(req.params.uid, { status });

    await firestoreAdminService.createAuditLog({
      performedByUid: req.user.uid,
      performedByName: req.user.fullName || req.user.email,
      action: status === 'suspended' ? 'USER_SUSPEND' : 'USER_REACTIVATE',
      targetId: req.params.uid,
      details: { newStatus: status }
    });

    const { passwordHash, ...sanitizedUpdated } = updated;
    return successResponse(res, 200, `User status updated to ${status}`, sanitizedUpdated);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin action: Delete user account.
 * Generates an Audit Log entry in auditLogs.
 */
export const deleteUser = async (req, res, next) => {
  try {
    await firestoreAdminService.deleteUser(req.params.uid);

    await firestoreAdminService.createAuditLog({
      performedByUid: req.user.uid,
      performedByName: req.user.fullName || req.user.email,
      action: 'USER_DELETE',
      targetId: req.params.uid,
      details: { deletedUid: req.params.uid }
    });

    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};
