"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { registerSchema, type RegisterData } from "@/lib/schemas/auth";

interface RegisterFormProps {
  onRegister: (data: RegisterData) => Promise<void>;
  loading: boolean;
}

export function RegisterForm({ onRegister, loading }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
      <div>
        <Input
          {...register("name")}
          placeholder="Full Name"
          className="bg-emerald-900/30"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>
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
          placeholder="Password (min 6 chars)"
          className="bg-emerald-900/30"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>
      <div>
        <div className="relative">
          <Input
            {...register("upiId")}
            placeholder="UPI ID (optional)"
            className="bg-emerald-900/30 pr-8"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Used only for prize payouts in tournaments
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-emerald-950 hover:bg-amber-400"
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
