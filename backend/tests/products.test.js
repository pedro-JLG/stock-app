import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { Product } from '../src/models/Product.js';
import { generateToken } from '../src/utils/generateToken.js';
import { connectTestDB, clearTestDB, closeTestDB } from './helpers/db.js';

beforeAll(connectTestDB, 60000);
afterEach(clearTestDB);
afterAll(closeTestDB);

const tokenFor = (role) => generateToken({ _id: new mongoose.Types.ObjectId(), role });
const admin = `Bearer ${tokenFor('admin')}`;
const operator = `Bearer ${tokenFor('operator')}`;

const screw = { name: 'Screw 5mm', sku: 'scr-05', category: 'Hardware' };

describe('permissions', () => {
    test('rejects requests without token', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(401);
    });

    test('operator can list but cannot create', async () => {
        const list = await request(app).get('/api/products').set('Authorization', operator);
        const create = await request(app)
            .post('/api/products')
            .set('Authorization', operator)
            .send(screw);

        expect(list.status).toBe(200);
        expect(create.status).toBe(403);
    });
});

describe('POST /api/products', () => {
    test('admin creates a product with uppercase sku and zero stock', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', admin)
            .send(screw);

        expect(res.status).toBe(201);
        expect(res.body.sku).toBe('SCR-05');
        expect(res.body.stock).toBe(0);
    });

    test('rejects a duplicate sku', async () => {
        await request(app).post('/api/products').set('Authorization', admin).send(screw);
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', admin)
            .send({ ...screw, sku: 'SCR-05' });

        expect(res.status).toBe(409);
    });

    test('rejects stock in the body', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', admin)
            .send({ ...screw, stock: 100 });

        expect(res.status).toBe(400);
    });
});

describe('GET /api/products', () => {
    beforeEach(async () => {
        await Product.create([
            { name: 'Screw 5mm', sku: 'SCR-05', category: 'Hardware' },
            { name: 'Nut 5mm', sku: 'NUT-05', category: 'Hardware' },
            { name: 'Cable 2mm', sku: 'CAB-02', category: 'Electric' },
        ]);
    });

    test('searches by name or sku', async () => {
        const res = await request(app).get('/api/products?q=5mm').set('Authorization', operator);

        expect(res.body.total).toBe(2);
    });

    test('filters by category', async () => {
        const res = await request(app)
            .get('/api/products?category=Electric')
            .set('Authorization', operator);

        expect(res.body.items).toHaveLength(1);
        expect(res.body.items[0].sku).toBe('CAB-02');
    });

    test('paginates results', async () => {
        const res = await request(app)
            .get('/api/products?limit=2&page=2')
            .set('Authorization', operator);

        expect(res.body.items).toHaveLength(1);
        expect(res.body.pages).toBe(2);
    });
});

describe('GET /api/products/:id', () => {
    test('rejects an invalid id', async () => {
        const res = await request(app)
            .get('/api/products/not-an-id')
            .set('Authorization', operator);
        expect(res.status).toBe(400);
    });

    test('returns 404 for a valid id that does not exist', async () => {
        const id = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/products/${id}`).set('Authorization', operator);
        expect(res.status).toBe(404);
    });
});

describe('DELETE /api/products/:id', () => {
    test('archives a product without stock and hides it from the list', async () => {
        const product = await Product.create(screw);

        const res = await request(app)
            .delete(`/api/products/${product._id}`)
            .set('Authorization', admin);
        const list = await request(app).get('/api/products').set('Authorization', admin);

        expect(res.status).toBe(204);
        expect(list.body.total).toBe(0);
    });

    test('refuses to archive a product with stock', async () => {
        const product = await Product.create({ ...screw, stock: 10 });

        const res = await request(app)
            .delete(`/api/products/${product._id}`)
            .set('Authorization', admin);

        expect(res.status).toBe(409);
    });
});

describe('GET /api/products/stock-by-category', () => {
    test('sums stock per category', async () => {
        await Product.create([
            { name: 'A', sku: 'A1', category: 'Hardware', stock: 10 },
            { name: 'B', sku: 'B1', category: 'Hardware', stock: 5 },
            { name: 'C', sku: 'C1', category: 'Electric', stock: 3 },
        ]);

        const res = await request(app)
            .get('/api/products/stock-by-category')
            .set('Authorization', operator);

        expect(res.body).toEqual([
            { category: 'Electric', totalStock: 3, products: 1 },
            { category: 'Hardware', totalStock: 15, products: 2 },
        ]);
    });
});
