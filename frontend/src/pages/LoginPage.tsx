import { useState } from "react";
import { useAuthStore, type UserRole } from "@/store/authStore";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuthStore();
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(name, role);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg border border-border">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white font-bold text-2xl shadow-lg shadow-primary/20">
            A
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Please enter your details to sign in
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-muted">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-text-muted">
                Select Role (Mock)
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full py-2.5" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
