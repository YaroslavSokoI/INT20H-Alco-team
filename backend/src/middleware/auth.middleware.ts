import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { createError } from './errorHandler';
import type { UserRole } from '../models/user';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError('Authorization header missing or malformed', 401));
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    res.locals.user = payload;
    next();
  } catch {
    next(createError('Invalid or expired token', 401));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user;
    if (!user || !roles.includes(user.role)) {
      return next(createError('Forbidden', 403));
    }
    next();
  };
}
