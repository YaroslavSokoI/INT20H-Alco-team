import bcrypt from 'bcryptjs';
import type { CreateUserDto, UpdateSelfDto, UserPublic } from '../models/user';
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

export async function updateSelf(id: number, dto: UpdateSelfDto): Promise<UserPublic> {
  const fields: Partial<{ login: string; password: string }> = {};

  if (dto.login !== undefined) {
    const existing = await userRepo.findByLogin(dto.login);
    if (existing && existing.id !== id) {
      throw new Error('User with this login already exists');
    }
    fields.login = dto.login;
  }

  if (dto.password !== undefined) {
    fields.password = await bcrypt.hash(dto.password, 10);
  }

  return userRepo.updateById(id, fields);
}

export async function updateUserByAdmin(
  adminId: number,
  targetId: number,
  dto: { login?: string; password?: string; currentPassword: string }
): Promise<UserPublic> {
  const admin = await userRepo.findById(adminId);
  if (!admin) throw new Error('Admin user not found');

  const isPasswordValid = await bcrypt.compare(dto.currentPassword, admin.password);
  if (!isPasswordValid) throw new Error('Incorrect admin password');

  const targetUser = await userRepo.findById(targetId);
  if (!targetUser) throw new Error('User not found');

  const fields: Partial<{ login: string; password: string }> = {};

  if (dto.login !== undefined) {
    const existing = await userRepo.findByLogin(dto.login);
    if (existing && existing.id !== targetId) {
      throw new Error('User with this login already exists');
    }
    fields.login = dto.login;
  }

  if (dto.password !== undefined) {
    fields.password = await bcrypt.hash(dto.password, 10);
  }

  if (Object.keys(fields).length === 0) {
    return { id: targetUser.id, login: targetUser.login, role: targetUser.role, created_at: targetUser.created_at };
  }

  return userRepo.updateById(targetId, fields);
}

export async function deleteUser(id: number): Promise<void> {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  await userRepo.deleteById(id);
}
