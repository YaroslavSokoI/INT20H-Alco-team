import { Router } from 'express';
import { z } from 'zod';
import {
  importOrders,
  createOrderHandler,
  getOrders,
  csvUploadMiddleware,
} from '../controllers/order.controller';
import { validateBody, validateQuery } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

const createOrderSchema = z.object({
  latitude: z.number({ required_error: 'latitude is required' }),
  longitude: z.number({ required_error: 'longitude is required' }),
  subtotal: z.number({ required_error: 'subtotal is required' }).positive(),
  timestamp: z.string().datetime().optional(),
});

const listOrdersSchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

router.post('/import', requireAuth, csvUploadMiddleware, importOrders);
router.post('/', requireAuth, validateBody(createOrderSchema), createOrderHandler);
router.get('/', requireAuth, validateQuery(listOrdersSchema), getOrders);

export default router;
