import { Router } from 'express';
import { z } from 'zod';
import { loginHandler } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate';

const router = Router();

const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 *
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - login
 *         - password
 *       properties:
 *         login:
 *           type: string
 *           example: admin
 *         password:
 *           type: string
 *           format: password
 *           example: changeme
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token valid for 24 hours
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Invalid credentials"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticate with login and password, receive a JWT token (24h).
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation error - missing or empty fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Validation failed"
 *       401:
 *         description: Invalid login or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid credentials"
 */
router.post('/login', validateBody(loginSchema), loginHandler);

export default router;
