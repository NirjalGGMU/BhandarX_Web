"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "@/app/schemas/auth.schema";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = () => {
    router.push("/auth/dashboard");
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
