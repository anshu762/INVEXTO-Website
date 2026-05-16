"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/home/LoginForm";
import { RegisterForm } from "@/components/home/RegisterForm";
import { useAuth } from "@/src/hooks/useAuth";
import type { LoginData, RegisterData } from "@/lib/schemas/auth";

export function AuthForm() {
  const { login: loginUser, register: registerUser } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    const res = await loginUser(data.email, data.password);
    setLoading(false);
    if (!res.success) {
      toast.error(res.error || "Login failed");
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    const res = await registerUser(data);
    setLoading(false);
    if (!res.success) {
      toast.error(res.error || "Registration failed");
    }
  };

  return (
    <section id="auth" className="flex w-full justify-center px-4 pb-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-4">
          <LoginForm onLogin={handleLogin} loading={loading} />
        </TabsContent>
        <TabsContent value="register" className="mt-4">
          <RegisterForm onRegister={handleRegister} loading={loading} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
