import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuthStore();
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(loginField, password);
    } catch (err) {
      setError("Invalid login or password");
      console.error("Login failed", err);
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
            Welcome
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Sign in with your login and password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-text-muted">
                Login
              </label>
              <input
                id="login"
                name="login"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter login"
                value={loginField}
                onChange={(e) => setLoginField(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-muted">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-danger">{error}</p>
            )}
          </div>

          <Button type="submit" className="w-full py-2.5" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
