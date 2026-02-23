import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { LoginDto, AuthResponse, JwtPayload } from '../models/auth';

export function login(dto: LoginDto): AuthResponse {
  if (dto.login !== config.auth.adminLogin || dto.password !== config.auth.adminPassword) {
    throw new Error('Invalid credentials');
  }

  const payload: JwtPayload = { login: dto.login };
  const token = jwt.sign(payload, config.auth.jwtSecret, { expiresIn: '24h' });

  return { token };
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.auth.jwtSecret) as JwtPayload;
}
