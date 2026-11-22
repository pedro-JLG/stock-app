import { Product } from '../models/Product.js';
import { HttpError } from '../utils/HttpError.js';

const ACTIVE = { deletedAt: null };

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listProducts({ q, category, page = 1, limit = 12 }) {
    const filter = { ...ACTIVE };

    if (q) {
        const regex = new RegExp(escapeRegex(q), 'i');
        filter.$or = [{ name: regex }, { sku: regex }];
    }
    if (category) {
        filter.category = category;
    }

    const [items, total] = await Promise.all([
        Product.find(filter)
            .sort({ name: 1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Product.countDocuments(filter),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) || 1 };
}

export async function getProduct(id) {
    const product = await Product.findOne({ _id: id, ...ACTIVE });
    if (!product) {
        throw new HttpError(404, 'Producto no encontrado');
    }
    return product;
}

export async function stockByCategory() {
    return Product.aggregate([
        { $match: ACTIVE },
        { $group: { _id: '$category', totalStock: { $sum: '$stock' }, products: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, category: '$_id', totalStock: 1, products: 1 } },
    ]);
}

async function ensureSkuAvailable(sku, excludeId) {
    const filter = { sku: sku.toUpperCase() };
    if (excludeId) {
        filter._id = { $ne: excludeId };
    }
    if (await Product.exists(filter)) {
        throw new HttpError(409, 'El SKU ya está en uso');
    }
}

export async function createProduct({ name, description, sku, category }) {
    await ensureSkuAvailable(sku);
    return Product.create({ name, description, sku, category });
}

export async function updateProduct(id, { name, description, sku, category }) {
    const product = await getProduct(id);
    await ensureSkuAvailable(sku, id);

    Object.assign(product, { name, description, sku, category });
    return product.save();
}

export async function archiveProduct(id) {
    const product = await getProduct(id);

    if (product.stock > 0) {
        throw new HttpError(409, 'Solo se pueden archivar productos sin stock');
    }

    product.deletedAt = new Date();
    await product.save();
}
