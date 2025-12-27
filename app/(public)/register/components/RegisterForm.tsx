"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterData } from "@/app/schemas/auth.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterData) => {
    console.log("Registration Data:", data);
    // Simulate API call and redirect to dashboard
    router.push("/auth/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name Field */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          {...register("name")}
          placeholder="John Doe"
          className={`w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
            errors.name ? "border-red-500" : "border-gray-300 dark:border-slate-700"
          }`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          {...register("email")}
          type="email"
          placeholder="name@company.com"
          className={`w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
            errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-700"
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className={`w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
            errors.password ? "border-red-500" : "border-gray-300 dark:border-slate-700"
          }`}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="••••••••"
          className={`w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-slate-700"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 mt-4"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}