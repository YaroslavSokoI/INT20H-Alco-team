import express from 'express';
import cors from 'cors';
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { setupSwagger } from './swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);

setupSwagger(app);

app.use(notFound);
app.use(errorHandler);

export default app;
