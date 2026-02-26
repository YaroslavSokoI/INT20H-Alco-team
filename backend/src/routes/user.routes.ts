import { Router } from 'express';
import { z } from 'zod';
import { getUsersHandler, createUserHandler, deleteUserHandler, updateSelfHandler } from '../controllers/user.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate';

const router = Router();

const createUserSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['admin', 'manager']),
});

const updateSelfSchema = z.object({
  login: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
}).refine((data) => data.login !== undefined || data.password !== undefined, {
  message: 'At least one field (login or password) must be provided',
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', requireAuth, requireRole('admin', 'manager'), getUsersHandler);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *               - role
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [admin, manager]
 *     responses:
 *       201:
 *         description: User created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Login already taken
 */
router.post('/', requireAuth, requireRole('admin'), validateBody(createUserSchema), createUserHandler);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 *       400:
 *         description: Cannot delete yourself
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete('/:id', requireAuth, requireRole('admin'), deleteUserHandler);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update own login or password
 *     description: Any authenticated user can update their own login and/or password.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: new_login
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: newpass123
 *     responses:
 *       200:
 *         description: Updated user (without password)
 *       400:
 *         description: No fields provided
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Login already taken
 */
router.patch('/me', requireAuth, validateBody(updateSelfSchema), updateSelfHandler);

export default router;
