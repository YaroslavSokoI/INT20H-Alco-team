import { Router } from 'express';
import { z } from 'zod';
import { loginHandler } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate';

const router = Router();

const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});


router.post('/login', validateBody(loginSchema), loginHandler);

export default router;
