// Vercel serverless entry point. server.js (app.listen) is not used in production.
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Module-level cache: survives between requests while the function instance stays warm,
// so we connect to Atlas once instead of on every request.
let dbPromise = null;

export default async function handler(req, res) {
    if (!dbPromise) {
        dbPromise = connectDB();
    }
    try {
        await dbPromise;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Reset so the next request retries instead of reusing a failed promise
        dbPromise = null;
        return res.status(503).json({ message: 'Base de datos no disponible' });
    }
    return app(req, res);
}
