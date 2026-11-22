import { HttpError } from '../utils/HttpError.js';

export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user?.role)) {
            throw new HttpError(403, 'No tiene permisos para realizar esta acción');
        }
        next();
    };
}
