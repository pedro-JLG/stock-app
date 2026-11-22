import { body, param, query } from 'express-validator';

export const idRules = [
    param('id').isMongoId().withMessage('ID de producto inválido'),
];

const productFields = [
    body('name')
        .trim().notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 120 }).withMessage('El nombre no puede superar los 120 caracteres'),
    body('description')
        .optional().trim()
        .isLength({ max: 1000 }).withMessage('La descripción no puede superar los 1000 caracteres'),
    body('sku')
        .trim().notEmpty().withMessage('El SKU es obligatorio')
        .isLength({ max: 40 }).withMessage('El SKU no puede superar los 40 caracteres'),
    body('category')
        .trim().notEmpty().withMessage('La categoría es obligatoria')
        .isLength({ max: 80 }).withMessage('La categoría no puede superar los 80 caracteres'),
    body('stock')
        .not().exists().withMessage('El stock solo se modifica mediante movimientos'),
];

export const createRules = [...productFields];
export const updateRules = [...idRules, ...productFields];

export const listRules = [
    query('q').optional().trim().isLength({ max: 100 }),
    query('category').optional().trim(),
    query('page').optional().isInt({ min: 1 }).withMessage('Página inválida').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido').toInt(),
];