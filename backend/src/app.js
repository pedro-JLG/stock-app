import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import productRoutes from './routes/product.routes.js';
import movementRoutes from './routes/movement.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/movements', movementRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use(errorHandler);

export default app;