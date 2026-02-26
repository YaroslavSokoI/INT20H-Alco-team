export type UserRole = "admin" | "manager";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
