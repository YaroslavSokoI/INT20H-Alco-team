import type { Request, Response, NextFunction } from 'express';
import { createUser, getUsers, deleteUser, updateSelf, updateUserByAdmin } from '../services/user.service';
import { createError } from '../middleware/errorHandler';
import type { JwtPayload } from '../models/auth';

export async function getUsersHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export async function createUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof Error && err.message === 'User with this login already exists') {
      return next(createError(err.message, 409));
    }
    next(err);
  }
}

export async function updateSelfHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const currentUser = res.locals.user as JwtPayload;
    const updated = await updateSelf(currentUser.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof Error && err.message === 'User with this login already exists') {
      return next(createError(err.message, 409));
    }
    next(err);
  }
}

export async function updateUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) {
      return next(createError('Invalid user id', 400));
    }

    const currentUser = res.locals.user as JwtPayload;
    const updated = await updateUserByAdmin(currentUser.id, targetId, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'User not found') return next(createError(err.message, 404));
      if (err.message === 'Incorrect admin password') return next(createError(err.message, 401));
      if (err.message === 'User with this login already exists') return next(createError(err.message, 409));
    }
    next(err);
  }
}

export async function deleteUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return next(createError('Invalid user id', 400));
    }

    const currentUser = res.locals.user as JwtPayload;
    if (currentUser.id === id) {
      return next(createError('Cannot delete yourself', 400));
    }

    await deleteUser(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === 'User not found') {
      return next(createError(err.message, 404));
    }
    next(err);
  }
}
