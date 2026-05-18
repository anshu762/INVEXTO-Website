"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginData } from "@/lib/schemas/auth";

interface LoginFormProps {
  onLogin: (data: LoginData) => Promise<void>;
  loading: boolean;
}

export function LoginForm({ onLogin, loading }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">Email</label>
        <Input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className="h-11 border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
        {errors.email && (
          <p className="animate-slide-up text-xs text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">Password</label>
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="h-11 border-gray-700 bg-gray-800/50 pr-10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="animate-slide-up text-xs text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-emerald-600 text-base font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
