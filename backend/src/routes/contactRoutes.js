import express from 'express';
import { getContacts, addContact, deleteContact } from '../controllers/contactController.js';
import { contactValidation } from '../validators/schemaValidators.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyAuth, getContacts);
router.post('/', verifyAuth, contactValidation, validateRequest, addContact);
router.delete('/:id', verifyAuth, deleteContact);

export default router;
