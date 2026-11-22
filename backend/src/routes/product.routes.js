import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { listRules, idRules, createRules, updateRules } from '../validations/product.validation.js';
import { list, show, create, update, archive, byCategory } from '../controllers/product.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listRules, validate, list);
router.get('/stock-by-category', byCategory);
router.get('/:id', idRules, validate, show);
router.post('/', requireRole('admin'), createRules, validate, create);
router.put('/:id', requireRole('admin'), updateRules, validate, update);
router.delete('/:id', requireRole('admin'), idRules, validate, archive);

export default router;
