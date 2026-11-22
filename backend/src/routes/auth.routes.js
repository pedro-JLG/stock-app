import { Router } from 'express';
import { registerRules, loginRules } from '../validations/auth.validation.js';
import { validate } from '../middlewares/validate.js';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

export default router;