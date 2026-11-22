import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        throw new HttpError(401, 'Debe iniciar sesión');
    }

    let payload;
    try {
        payload = jwt.verify(token, env.jwtSecret);
    } catch {
        throw new HttpError(401, 'Sesión inválida o vencida');
    }

    req.user = { id: payload.sub, role: payload.role };
    next();
}
