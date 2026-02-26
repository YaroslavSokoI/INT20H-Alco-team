import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import type { LoginDto, AuthResponse, JwtPayload } from '../models/auth';
import { findByLogin } from '../repositories/user.repository';

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const user = await findByLogin(dto.login);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(dto.password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  const payload: JwtPayload = { id: user.id, login: user.login, role: user.role };
  const token = jwt.sign(payload, config.auth.jwtSecret, { expiresIn: '24h' });

  return { token };
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.auth.jwtSecret) as JwtPayload;
}
