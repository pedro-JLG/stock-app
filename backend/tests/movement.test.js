import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';
import { generateToken } from '../src/utils/generateToken.js';
import { connectTestDB, clearTestDB, closeTestDB } from './helpers/db.js';

beforeAll(connectTestDB, 60000);
afterEach(clearTestDB);
afterAll(closeTestDB);

const operatorId = new mongoose.Types.ObjectId();
const auth = `Bearer ${generateToken({ _id: operatorId, role: 'operator' })}`;
const today = new Date().toISOString().slice(0, 10);

async function createProduct(stock = 0) {
    return Product.create({ name: 'Screw', sku: `SCR-${Date.now()}`, category: 'Hardware', stock });
}

function postMovement(body) {
    return request(app).post('/api/movements').set('Authorization', auth).send(body);
}

describe('POST /api/movements', () => {
    test('an incoming movement increases stock', async () => {
        const product = await createProduct(10);

        const res = await postMovement({
            product: product._id, type: 'in', quantity: 5, occurredOn: today, supplier: 'ACME',
        });

        expect(res.status).toBe(201);
        expect(res.body.stock).toBe(15);
    });

    test('an outgoing movement decreases stock', async () => {
        const product = await createProduct(10);

        const res = await postMovement({
            product: product._id, type: 'out', quantity: 4, occurredOn: today, reason: 'Sale',
        });

        expect(res.status).toBe(201);
        expect(res.body.stock).toBe(6);
    });

    test('rejects an outgoing movement without enough stock and keeps stock unchanged', async () => {
        const product = await createProduct(3);

        const res = await postMovement({
            product: product._id, type: 'out', quantity: 5, occurredOn: today, reason: 'Sale',
        });
        const after = await Product.findById(product._id);

        expect(res.status).toBe(409);
        expect(after.stock).toBe(3);
    });

    test('rejects an incoming movement that exceeds the maximum stock', async () => {
        const product = await createProduct(99990);

        const res = await postMovement({
            product: product._id, type: 'in', quantity: 10, occurredOn: today, supplier: 'ACME',
        });

        expect(res.status).toBe(409);
    });

    test('requires supplier for incoming movements', async () => {
        const product = await createProduct();

        const res = await postMovement({ product: product._id, type: 'in', quantity: 1, occurredOn: today });

        expect(res.status).toBe(400);
    });

    test('rejects a future date', async () => {
        const product = await createProduct();

        const res = await postMovement({
            product: product._id, type: 'in', quantity: 1, occurredOn: '2099-01-01', supplier: 'ACME',
        });

        expect(res.status).toBe(400);
    });

    test('returns 404 for an archived product', async () => {
        const product = await Product.create({
            name: 'Old', sku: 'OLD-1', category: 'Hardware', deletedAt: new Date(),
        });

        const res = await postMovement({
            product: product._id, type: 'in', quantity: 1, occurredOn: today, supplier: 'ACME',
        });

        expect(res.status).toBe(404);
    });

    test('takes the user from the token and ignores supplier on outgoing movements', async () => {
        const product = await createProduct(10);
        const otherUser = new mongoose.Types.ObjectId();

        const res = await postMovement({
            product: product._id, type: 'out', quantity: 1, occurredOn: today,
            reason: 'Sale', supplier: 'ACME', user: otherUser,
        });

        expect(res.body.movement.user).toBe(operatorId.toString());
        expect(res.body.movement.supplier).toBeUndefined();
    });

    test('two simultaneous outgoing movements cannot overdraw stock', async () => {
        const product = await createProduct(10);
        const body = { product: product._id, type: 'out', quantity: 8, occurredOn: today, reason: 'Sale' };

        const [first, second] = await Promise.all([postMovement(body), postMovement(body)]);
        const statuses = [first.status, second.status].sort();
        const after = await Product.findById(product._id);

        expect(statuses).toEqual([201, 409]);
        expect(after.stock).toBe(2);
    });
});

describe('GET /api/movements', () => {
    test('lists movements with product and user populated, filtered by type', async () => {
        const user = await User.create({ name: 'Ana', email: 'ana@test.com', passwordHash: 'x' });
        const product = await createProduct(10);
        const userAuth = `Bearer ${generateToken(user)}`;

        await request(app).post('/api/movements').set('Authorization', userAuth)
            .send({ product: product._id, type: 'in', quantity: 1, occurredOn: today, supplier: 'ACME' });
        await request(app).post('/api/movements').set('Authorization', userAuth)
            .send({ product: product._id, type: 'out', quantity: 1, occurredOn: today, reason: 'Sale' });

        const res = await request(app).get('/api/movements?type=out').set('Authorization', userAuth);

        expect(res.body.total).toBe(1);
        expect(res.body.items[0].product.name).toBe('Screw');
        expect(res.body.items[0].user.name).toBe('Ana');
    });
});