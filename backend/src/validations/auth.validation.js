import { body } from 'express-validator';

export const registerRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),
    body('email').trim().isEmail().withMessage('Se requiere un email válido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
];

export const loginRules = [
    body('email').trim().isEmail().withMessage('Se requiere un email válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];
