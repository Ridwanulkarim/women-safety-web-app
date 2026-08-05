import { firestoreAdminService } from '../services/firestoreAdminService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const list = await firestoreAdminService.getUserNotifications(req.user.uid);
    return successResponse(res, 200, 'Notifications fetched', list);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const updated = await firestoreAdminService.markNotificationRead(req.params.id);
    return successResponse(res, 200, 'Notification marked as read', updated);
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const list = await firestoreAdminService.getAnnouncements();
    return successResponse(res, 200, 'Announcements fetched', list);
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const ann = await firestoreAdminService.createAnnouncement(req.body);
    return successResponse(res, 201, 'Announcement created', ann);
  } catch (error) {
    next(error);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await firestoreAdminService.getBlogs();
    return successResponse(res, 200, 'Blogs fetched', blogs);
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await firestoreAdminService.getBlogById(req.params.id);
    return successResponse(res, 200, 'Blog detail fetched', blog);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const blog = await firestoreAdminService.createBlog(req.body);
    return successResponse(res, 201, 'Blog created', blog);
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    await firestoreAdminService.deleteBlog(req.params.id);
    return successResponse(res, 200, 'Blog deleted');
  } catch (error) {
    next(error);
  }
};

export const getSafetyTips = async (req, res, next) => {
  try {
    const tips = await firestoreAdminService.getSafetyTips();
    return successResponse(res, 200, 'Safety tips fetched', tips);
  } catch (error) {
    next(error);
  }
};

export const createSafetyTip = async (req, res, next) => {
  try {
    const tip = await firestoreAdminService.createSafetyTip(req.body);
    return successResponse(res, 201, 'Safety tip created', tip);
  } catch (error) {
    next(error);
  }
};

export const deleteSafetyTip = async (req, res, next) => {
  try {
    await firestoreAdminService.deleteSafetyTip(req.params.id);
    return successResponse(res, 200, 'Safety tip deleted');
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await firestoreAdminService.getAnalytics();
    return successResponse(res, 200, 'Analytics retrieved', analytics);
  } catch (error) {
    next(error);
  }
};
