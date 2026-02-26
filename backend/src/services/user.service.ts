import bcrypt from 'bcryptjs';
import type { CreateUserDto, UserPublic } from '../models/user';
import * as userRepo from '../repositories/user.repository';

export async function createUser(dto: CreateUserDto): Promise<UserPublic> {
  const existing = await userRepo.findByLogin(dto.login);
  if (existing) {
    throw new Error('User with this login already exists');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);
  return userRepo.create({ ...dto, password: hashedPassword });
}

export async function getUsers(): Promise<UserPublic[]> {
  return userRepo.findAll();
}

export async function deleteUser(id: number): Promise<void> {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  await userRepo.deleteById(id);
}
