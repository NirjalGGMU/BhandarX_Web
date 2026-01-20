// app/(public)/login/components/LoginForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "@/app/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/action/auth-action";
import { startTransition } from "react";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

   const onSubmit = async (data: LoginData) => {
    try {
      const res = await handleLogin(data);
      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }

      toast.success("Login success");

      startTransition(() => {
        router.push("/auth/dashboard");
      });
    } catch (error: Error | any) {
      // setError(error.message || "Login Failed");
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input {...register("email")} placeholder="Email" className="w-full p-3 border rounded" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="w-full p-3 border rounded"
      />

      <button className="w-full bg-indigo-600 text-white py-3 rounded">
        Login
      </button>
    </form>
  );
}
