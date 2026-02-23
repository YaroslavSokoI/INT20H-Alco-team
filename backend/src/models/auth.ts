export interface LoginDto {
  login: string;
  password: string;
}

export interface JwtPayload {
  login: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  token: string;
}
