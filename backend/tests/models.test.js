import mongoose from 'mongoose';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';
import { Movement } from '../src/models/Movement.js';

describe('Product model', () => {
    test('is valid with required fields and normalizes sku', async () => {
        const product = new Product({ name: 'Screw', sku: 'scr-01', category: 'Hardware' });

        await product.validate();
        expect(product.sku).toBe('SCR-01');
        expect(product.stock).toBe(0);
    });

    test('fails without sku', async () => {
        const product = new Product({ name: 'Screw', category: 'Hardware' });

        const error = await product.validate().catch((e) => e);
        expect(error.errors.sku).toBeDefined();
    });

    test('fails with negative stock', async () => {
        const product = new Product({ name: 'Screw', sku: 'sc01', category: 'Hardware', stock: -1 });

        const error = await product.validate().catch((e) => e);
        expect(error.errors.stock).toBeDefined(); 
    });
});

describe('User model', () => {
    test('defaults role to operator', async () => {
        const user = new User({ name: 'Ana', email: 'ANA@mail.com', passwordHash: 'hash' });

        await user.validate();
        expect(user.role).toBe('operator');
        expect(user.email).toBe('ana@mail.com');
    });

    test('rejects an unknown role', async () => {
        const user = new User({ name: 'Ana', email: 'a@mail.com', passwordHash: 'hash', role: 'superAdmin'});
        
        const error = await user.validate().catch((e) => e);
        expect(error.errors.role).toBeDefined();
    });

});

describe('Movement model', () => {
    const base = {
        product: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(),
        quantity: 5,
        occurredOn: new Date(),
    };

    test('incoming movement requires supplier', async () => {
        const movement = new Movement({ ...base, type: 'in' });

        const error = await movement.validate().catch((e) => e);
        expect(error.errors.supplier).toBeDefined();
        expect(error.errors.reason).toBeUndefined();
    });

    test('outgoing movement requires reason', async () => {
        const movement = new Movement({ ...base, type: 'out' });

        const error = await movement.validate().catch((e) => e);
        expect(error.errors.reason).toBeDefined();
        expect(error.errors.supplier).toBeUndefined();
    });

    test('reject decimal quantity', async () => {
        const movement = new Movement({ ...base, type: 'in', supplier: 'ACME', quantity: 2.5 });

        const error = await movement.validate().catch((e) => e);
        expect(error.errors.quantity).toBeDefined();
    });

    test('is valid with all required fields', async () => {
        const movement = new Movement({ ...base, type: 'out', reason: 'Sale' });

        await movement.validate();
    });
});