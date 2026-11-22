import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { createMovementRules, listMovementRules } from '../validations/movement.validation.js';
import { create, list } from '../controllers/movement.controller.js';

const router = Router();

router.use(requireAuth, requireRole('admin', 'operator'));

router.get('/', listMovementRules, validate, list);
router.post('/', createMovementRules, validate, create);

export default router;