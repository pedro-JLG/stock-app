import { Router } from 'express';
import { registerRules, loginRules } from '../validations/auth.validation.js';
import { validate } from '../middlewares/validate.js';
import { register, login, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', requireAuth, me);

export default router;
