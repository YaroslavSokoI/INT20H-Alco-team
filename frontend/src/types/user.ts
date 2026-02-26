export type UserRole = "admin" | "manager";

export interface User {
  id: number;
  login: string;
  role: UserRole;
}
