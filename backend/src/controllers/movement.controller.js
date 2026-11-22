import { matchedData } from 'express-validator';
import { registerMovement, listMovements } from '../services/movement.service.js';

export async function create(req, res) {
    const data = matchedData(req, { locations: ['body'] });
    res.status(201).json(await registerMovement(data, req.user.id));
}

export async function list(req, res) {
    const filters = matchedData(req, { locations: ['query'] });
    res.json(await listMovements(filters));
}