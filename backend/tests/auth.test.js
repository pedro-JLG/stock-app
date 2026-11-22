import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { requireAuth } from '../src/middlewares/requireAuth.js';
import { requireRole } from '../src/middlewares/requireRole.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { generateToken } from '../src/utils/generateToken.js';
import { connectTestDB, clearTestDB, closeTestDB } from './helpers/db.js';

beforeAll(connectTestDB, 60000);
afterEach(clearTestDB);
afterAll(closeTestDB);

const ana = { name: 'Ana', email: 'ana@test.com', password: '12345678' };

describe('POST /api/auth/register', () => {
    test('creates an operator and never exposes the password hash', async () => {
        const res = await request(app).post('/api/auth/register').send(ana);

        expect(res.status).toBe(201);
        expect(res.body.user.role).toBe('operator');
        expect(res.body.user.passwordHash).toBeUndefined();
        expect(res.body.token).toBeDefined();
    });

    test('ignores a role sent in the body', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ ...ana, role: 'admin' });

        expect(res.body.user.role).toBe('operator');
    });

    test('rejects a duplicate email', async () => {
        await request(app).post('/api/auth/register').send(ana);
        const res = await request(app).post('/api/auth/register').send(ana);

        expect(res.status).toBe(409);
    });

    test('rejects invalid data', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: '', email: 'not-an-email', password: '123' });

        expect(res.status).toBe(400);
        expect(res.body.errors).toHaveLength(3);
    });
});

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await request(app).post('/api/auth/register').send(ana);
    });

    test('returns a token with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: ana.email, password: ana.password });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('rejects a wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: ana.email, password: 'wrong-password' });

        expect(res.status).toBe(401);
    });
});

describe('GET /api/auth/me', () => {
    test('rejects a request without token', async () => {
        const res = await request(app).get('/api/auth/me');

        expect(res.status).toBe(401);
    });

    test('returns the logged user with a valid token', async () => {
        const register = await request(app).post('/api/auth/register').send(ana);

        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${register.body.token}`);

        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe(ana.email);
    });
});

describe('requireRole', () => {
    const testApp = express();
    testApp.get('/admin-only', requireAuth, requireRole('admin'), (req, res) =>
        res.json({ ok: true }),
    );
    testApp.use(errorHandler);

    const tokenFor = (role) => generateToken({ _id: new mongoose.Types.ObjectId(), role });

    test('blocks an operator with 403', async () => {
        const res = await request(testApp)
            .get('/admin-only')
            .set('Authorization', `Bearer ${tokenFor('operator')}`);

        expect(res.status).toBe(403);
    });

    test('lets an admin through', async () => {
        const res = await request(testApp)
            .get('/admin-only')
            .set('Authorization', `Bearer ${tokenFor('admin')}`);

        expect(res.status).toBe(200);
    });
});
