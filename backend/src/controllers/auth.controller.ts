import type { Request, Response, NextFunction } from 'express';
import { login } from '../services/auth.service';
import { createError } from '../middleware/errorHandler';

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid credentials') {
      return next(createError('Invalid credentials', 401));
    }
    next(err);
  }
}
