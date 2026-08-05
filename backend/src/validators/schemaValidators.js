import { body } from 'express-validator';

export const updateProfileValidation = [
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required')
];

export const contactValidation = [
  body('name').notEmpty().withMessage('Contact name is required'),
  body('phone').notEmpty().withMessage('Contact phone number is required'),
  body('relationship').notEmpty().withMessage('Relationship is required')
];

export const sosValidation = [
  body('latitude').isNumeric().withMessage('Valid latitude is required'),
  body('longitude').isNumeric().withMessage('Valid longitude is required')
];

export const blogValidation = [
  body('title').notEmpty().withMessage('Blog title is required'),
  body('content').notEmpty().withMessage('Blog content is required')
];

export const tipValidation = [
  body('title').notEmpty().withMessage('Tip title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('content').notEmpty().withMessage('Content is required')
];
