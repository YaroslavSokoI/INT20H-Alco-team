import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { createError } from './errorHandler';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError('Authorization header missing or malformed', 401));
  }

  const token = authHeader.slice(7);

  try {
    verifyToken(token);
    next();
  } catch {
    next(createError('Invalid or expired token', 401));
  }
}
