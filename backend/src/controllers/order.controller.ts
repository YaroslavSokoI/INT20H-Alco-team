import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { createOrder, importOrdersFromCsv, listOrders } from '../services/order.service';
import { createError } from '../middleware/errorHandler';

const upload = multer({
  storage: multer.memoryStorage(),
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

    const result = await importOrdersFromCsv(req.file.buffer);
    res.status(200).json(result);
  } catch (err) {
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
    if (err instanceof Error && err.message.includes('outside New York State')) {
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
    const query = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      state: req.query.state as string | undefined,
      city: req.query.city as string | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
    };

    const result = await listOrders(query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
