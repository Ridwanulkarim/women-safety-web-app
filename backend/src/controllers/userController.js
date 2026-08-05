import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await firestoreAdminService.getAllUsers();
    return successResponse(res, 200, 'Users fetched', users);
  } catch (error) {
    next(error);
  }
};

export const getUserByUid = async (req, res, next) => {
  try {
    const user = await firestoreAdminService.getUserByUid(req.params.uid);
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, 'User fetched', user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updated = await firestoreAdminService.updateUser(req.params.uid, req.body);
    return successResponse(res, 200, 'User updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'active' | 'suspended'
    const updated = await firestoreAdminService.updateUser(req.params.uid, { status });
    return successResponse(res, 200, `User status updated to ${status}`, updated);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await firestoreAdminService.deleteUser(req.params.uid);
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};
