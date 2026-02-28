import { Router } from 'express';
import { z } from 'zod';
import {
  importOrders,
  createOrderHandler,
  getOrders,
  csvUploadMiddleware,
  getStatsHandler,
  updateOrderHandler,
  deleteOrderHandler,
} from '../controllers/order.controller';
import { validateBody, validateQuery } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

const createOrderSchema = z.object({
  latitude: z.number({ required_error: 'latitude is required' }),
  longitude: z.number({ required_error: 'longitude is required' }),
  subtotal: z.number({ required_error: 'subtotal is required' }).min(0),
  timestamp: z.string().datetime().optional(),
});

const numericParam = z.string().regex(/^\d+(\.\d+)?$/).optional();

const listOrdersSchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  county: z.string().optional(),
  city: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  subtotalMin: numericParam,
  subtotalMax: numericParam,
  taxRateMin: numericParam,
  taxRateMax: numericParam,
  taxMin: numericParam,
  taxMax: numericParam,
  totalMin: numericParam,
  totalMax: numericParam,
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  importId: z.string().optional(),
});

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /orders/import:
 *   post:
 *     summary: Import orders from CSV
 *     description: Upload a CSV file containing bulk orders. Max file size is 10MB.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully imported orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imported:
 *                   type: number
 *                 skipped:
 *                   type: number
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       row:
 *                         type: number
 *                       reason:
 *                         type: string
 *       400:
 *         description: Missing or invalid file.
 *       401:
 *         description: Unauthorized.
 */
router.post('/import', requireAuth, csvUploadMiddleware, importOrders);

/**
 * @swagger
 * /orders/stats:
 *   get:
 *     summary: Get aggregated order statistics
 *     description: Returns total orders count, total sales and total collected tax.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated stats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: number
 *                 totalSales:
 *                   type: number
 *                 totalTax:
 *                   type: number
 *       401:
 *         description: Unauthorized.
 */
router.get('/stats', requireAuth, getStatsHandler);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a single order
 *     description: Creates an order and calculates New York State taxes.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *               - subtotal
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               subtotal:
 *                 type: number
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: Internal DB serial ID
 *                 uuid:
 *                   type: string
 *                   format: uuid
 *                   description: External unique identifier
 *                 subtotal:
 *                   type: number
 *                 taxAmount:
 *                   type: number
 *                 totalAmount:
 *                   type: number
 *                 compositeTaxRate:
 *                   type: number
 *       422:
 *         description: Validation error or coordinates outside NY State.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', requireAuth, validateBody(createOrderSchema), createOrderHandler);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List orders
 *     description: Retrieves a paginated list of orders, optionally filtered.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Items per page
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date
 *     responses:
 *       200:
 *         description: Returns the paginated list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: Internal DB serial ID
 *                       uuid:
 *                         type: string
 *                         format: uuid
 *                         description: External unique identifier
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       subtotal:
 *                         type: number
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       compositeTaxRate:
 *                         type: number
 *                       taxAmount:
 *                         type: number
 *                       totalAmount:
 *                         type: number
 *                       stateRate:
 *                         type: number
 *                       countyRate:
 *                         type: number
 *                       cityRate:
 *                         type: number
 *                       specialRates:
 *                         type: number
 *                       jurisdictions:
 *                         type: object
 *                         properties:
 *                           postcode:
 *                             type: string
 *                           city:
 *                             type: string
 *                           county:
 *                             type: string
 *                           state:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *       401:
 *         description: Unauthorized.
 */
router.get('/', requireAuth, validateQuery(listOrdersSchema), getOrders);

router.patch('/:id', requireAuth, updateOrderHandler);

router.delete('/:id', requireAuth, deleteOrderHandler);

export default router;
