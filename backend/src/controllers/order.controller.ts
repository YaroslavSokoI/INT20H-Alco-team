import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createOrder, importOrdersFromCsv, listOrders, getOrderStats, updateOrder, deleteOrder } from '../services/order.service';
import { createError } from '../middleware/errorHandler';

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

export const csvUploadMiddleware = upload.single('file');

export async function importOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      return next(createError('CSV file is required (field name: "file")', 400));
    }

    const filePath = req.file.path;
    const result = await importOrdersFromCsv(filePath);

    fs.unlink(filePath, (err) => {
      if (err) console.error(`Failed to delete file ${filePath}:`, err);
    });

    res.status(200).json(result);
  } catch (err) {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => { });
    }
    next(err);
  }
}

export async function createOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes('outside New York State') ||
        err.message.includes('must be within New York State'))
    ) {
      return next(createError(err.message, 422));
    }
    next(err);
  }
}

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const toNum = (v: unknown) => (v ? Number(v) : undefined);
    const query = {
      page: toNum(req.query.page),
      limit: toNum(req.query.limit),
      county: req.query.county as string | undefined,
      city: req.query.city as string | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
      subtotalMin: toNum(req.query.subtotalMin),
      subtotalMax: toNum(req.query.subtotalMax),
      taxRateMin: toNum(req.query.taxRateMin),
      taxRateMax: toNum(req.query.taxRateMax),
      taxMin: toNum(req.query.taxMin),
      taxMax: toNum(req.query.taxMax),
      totalMin: toNum(req.query.totalMin),
      totalMax: toNum(req.query.totalMax),
    };

    const result = await listOrders(query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return next(createError('Invalid order ID', 400));
    const order = await updateOrder(id, req.body);
    if (!order) return next(createError('Order not found', 404));
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function deleteOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return next(createError('Invalid order ID', 400));
    const deleted = await deleteOrder(id);
    if (!deleted) return next(createError('Order not found', 404));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getStatsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = await getOrderStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}
