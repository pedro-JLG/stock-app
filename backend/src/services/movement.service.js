import { Movement } from '../models/Movement.js';
import { Product } from '../models/Product.js';
import { HttpError } from '../utils/HttpError.js';

const MAX_STOCK = 99999;

export async function registerMovement(data, userId) {
    const { product: productId, type, quantity, occurredOn, supplier, reason } = data;

    const exists = await Product.exists({ _id: productId, deletedAt: null });
    if (!exists) {
        throw new HttpError(404, 'Producto no encontrado');
    }

    const isIn = type === 'in';
    const stockCondition = isIn ? { $lte: MAX_STOCK - quantity } : { $gte: quantity };
    const delta = isIn ? quantity : -quantity;

    const product = await Product.findOneAndUpdate(
        { _id: productId, deletedAt: null, stock: stockCondition },
        { $inc: { stock: delta } },
        { returnDocument: 'after' },
    );

    if (!product) {
        throw new HttpError(
            409,
            isIn ? `Se superaría el stock máximo de ${MAX_STOCK}` : 'Stock insuficiente',
        );
    }

    try {
        const movement = await Movement.create({
            product: productId,
            user: userId,
            type,
            quantity,
            occurredOn,
            supplier: isIn ? supplier : undefined,
            reason: isIn ? undefined : reason,
        });
        return { movement, stock: product.stock };
    } catch (error) {
        await Product.updateOne({ _id: productId }, { $inc: { stock: -delta } });
        throw error;
    }
}

export async function listMovements({ type, product, from, to, page = 1, limit = 15 }) {
    const filter = {};

    if (type) {
        filter.type = type;
    }
    if (product) {
        filter.product = product;
    }
    if (from || to) {
        filter.occurredOn = {};
        if (from) filter.occurredOn.$gte = new Date(from);
        if (to) filter.occurredOn.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
        Movement.find(filter)
            .sort({ occurredOn: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('product', 'name sku category')
            .populate('user', 'name'),
        Movement.countDocuments(filter),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) || 1 };
}
