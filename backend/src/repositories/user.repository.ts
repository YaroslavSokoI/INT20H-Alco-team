import { db } from './db';
import type { User, UserPublic, CreateUserDto } from '../models/user';

export async function findByLogin(login: string): Promise<User | undefined> {
  return db('users').where({ login }).first();
}

export async function findById(id: number): Promise<User | undefined> {
  return db('users').where({ id }).first();
}

export async function findAll(): Promise<UserPublic[]> {
  return db('users').select('id', 'login', 'role', 'created_at').orderBy('created_at', 'asc');
}

export async function create(dto: CreateUserDto): Promise<UserPublic> {
  const [row] = await db('users')
    .insert({ login: dto.login, password: dto.password, role: dto.role })
    .returning(['id', 'login', 'role', 'created_at']);
  return row;
}

export async function deleteById(id: number): Promise<void> {
  await db('users').where({ id }).delete();
}

export async function countAll(): Promise<number> {
  const result = await db('users').count('id as count').first();
  const c = (result as unknown as { count: string | number }).count;
  return typeof c === 'string' ? parseInt(c, 10) : Number(c);
}
