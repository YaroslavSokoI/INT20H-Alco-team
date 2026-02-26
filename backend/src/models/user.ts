export type UserRole = 'admin' | 'manager';

export interface User {
  id: number;
  login: string;
  password: string;
  role: UserRole;
  created_at: Date;
}

export interface CreateUserDto {
  login: string;
  password: string;
  role: UserRole;
}

export interface UserPublic {
  id: number;
  login: string;
  role: UserRole;
  created_at: Date;
}

export interface UpdateSelfDto {
  login?: string;
  password?: string;
}
