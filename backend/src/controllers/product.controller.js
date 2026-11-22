import { matchedData } from 'express-validator';
import {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    archiveProduct,
    stockByCategory,
} from '../services/product.service.js';

export async function list(req, res) {
    const filters = matchedData(req, { locations: ['query'] });
    res.json(await listProducts(filters));
}

export async function show(req, res) {
    res.json(await getProduct(req.params.id));
}

export async function create(req, res) {
    res.status(201).json(await createProduct(req.body));
}

export async function update(req, res) {
    res.json(await updateProduct(req.params.id, req.body));
}

export async function archive(req, res) {
    await archiveProduct(req.params.id);
    res.status(204).end();
}

export async function byCategory(req, res) {
    res.json(await stockByCategory());
}
