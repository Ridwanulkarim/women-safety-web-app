import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('fullName').optional()
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').optional()
];
