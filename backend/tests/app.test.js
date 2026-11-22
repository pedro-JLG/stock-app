import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { env } from '../src/config/env.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';

describe('security headers and CORS', () => {
    test('sets helmet headers', async () => {
        const res = await request(app).get('/api/health');

        expect(res.headers['x-content-type-options']).toBe('nosniff');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });

    test('allows the configured frontend origin', async () => {
        // clientOrigin is a list; use the first allowed origin.
        const origin = env.clientOrigin[0];
        const res = await request(app).get('/api/health').set('Origin', origin);

        expect(res.headers['access-control-allow-origin']).toBe(origin);
    });

    test('does not allow other origins', async () => {
        const res = await request(app).get('/api/health').set('Origin', 'http://evil.com');

        expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
});

describe('unknown routes and bad requests', () => {
    test('returns a JSON 404 for unknown routes', async () => {
        const res = await request(app).get('/api/does-not-exist');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Ruta no encontrada' });
    });

    test('returns 400 for a malformed JSON body', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send('{"email": ');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'JSON inválido' });
    });
});

describe('errorHandler', () => {
    function run(err) {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        errorHandler(err, {}, res, () => {});
        return res;
    }

    test.each([
        [{ sku: 1 }, 'El SKU ya está en uso'],
        [{ email: 1 }, 'Correo ya registrado'],
        [{ other: 1 }, 'El registro ya existe'],
    ])('maps duplicate key %o to 409', (keyPattern, message) => {
        const res = run({ code: 11000, keyPattern });

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message });
    });

    test('hides the details of unexpected errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const res = run(new Error('boom'));

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error interno del servidor' });
        spy.mockRestore();
    });
});
