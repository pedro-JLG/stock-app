import { body, query } from 'express-validator';
import { MOVEMENT_TYPES } from '../models/Movement.js';

export const createMovementRules = [
    body('product').isMongoId().withMessage('Producto inválido'),
    body('type').isIn(MOVEMENT_TYPES).withMessage('El tipo debe ser ingreso o salida'),
    body('quantity')
        .isInt({ min: 1, max: 99999 }).withMessage('La cantidad debe ser un entero entre 1 y 99999')
        .toInt(),
    body('occurredOn')
        .isISO8601({ strict: true }).withMessage('Fecha inválida')
        .bail()
        // Strict rule. The frontend sends date-only values (YYYY-MM-DD), parsed as UTC midnight.
        // For users west of UTC (e.g. Argentina, UTC-3) their local "today" is never ahead of
        // the server's now, so a valid "today" is never rejected.
        .custom((value) => new Date(value) <= new Date())
        .withMessage('La fecha no puede ser futura'),
    body('supplier')
        .if(body('type').equals('in'))
        .trim().notEmpty().withMessage('El proveedor es obligatorio en los ingresos')
        .isLength({ max: 120 }).withMessage('El proveedor no puede superar los 120 caracteres'),
    body('reason')
        .if(body('type').equals('out'))
        .trim().notEmpty().withMessage('El motivo es obligatorio en las salidas')
        .isLength({ max: 180 }).withMessage('El motivo no puede superar los 180 caracteres'),
];

export const listMovementRules = [
    query('type').optional().isIn(MOVEMENT_TYPES).withMessage('Tipo inválido'),
    query('product').optional().isMongoId().withMessage('Producto inválido'),
    query('from').optional().isISO8601().withMessage('Fecha desde inválida'),
    query('to').optional().isISO8601().withMessage('Fecha hasta inválida'),
    query('page').optional().isInt({ min: 1 }).withMessage('Página inválida').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido').toInt(),
];