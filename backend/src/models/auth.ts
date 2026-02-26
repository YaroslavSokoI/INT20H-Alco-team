import type { UserRole } from './user.js';

export interface LoginDto {
  login: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  login: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  token: string;
}
