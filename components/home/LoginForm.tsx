"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginData } from "@/lib/schemas/auth";

interface LoginFormProps {
  onLogin: (data: LoginData) => Promise<void>;
  loading: boolean;
}

export function LoginForm({ onLogin, loading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
      <div>
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="bg-emerald-900/30"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="bg-emerald-900/30"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-emerald-950 hover:bg-amber-400"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
