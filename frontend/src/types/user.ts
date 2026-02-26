export type UserRole = "admin" | "manager";

export interface User {
  id: string;
  login: string;
  role: UserRole;
}
