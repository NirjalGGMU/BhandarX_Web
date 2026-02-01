// app/%28auth%29/_components/RegisterForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema, RegisterData } from "../schema";
import { handleRegister } from "@/app/lib/actions/auth-action";
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await handleRegister(data);
      if (result.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Success Alert */}
      {success && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-foreground">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            {...register("name")}
            type="text"
            id="name"
            placeholder="Nirjal Adhikari"
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background transition-all duration-200 placeholder:text-muted-foreground/60"
          />
        </div>
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
            <span className="text-xs">⚠</span> {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-foreground">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background transition-all duration-200 placeholder:text-muted-foreground/60"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
            <span className="text-xs">⚠</span> {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-foreground">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background transition-all duration-200 placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
            <span className="text-xs">⚠</span> {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background transition-all duration-200 placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
            <span className="text-xs">⚠</span> {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md mt-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Sign up</span>
        )}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}







// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export const registerSchema = z.object({
//   name: z.string().min(1, "Full Name is required"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// export type RegisterData = z.infer<typeof registerSchema>;

// export default function RegisterForm() {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterData>({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = (data: RegisterData) => {
//     console.log("Registration Data:", data);
//     // Simulate API call and redirect to dashboard
//     router.push("/auth/dashboard");
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       {/* Full Name Field */}
//       <div>
//         <label className="block text-sm font-medium mb-1">Full Name</label>
//         <input
//           {...register("name")}
//           placeholder="John Doe"
//           className={`w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
//             errors.name ? "border-red-500" : "border-gray-300 dark:border-slate-700"
//           }`}
//         />
//         {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//       </div>

//       {/* Email Field */}
//       <div>
//         <label className="block text-sm font-medium mb-1">Email Address</label>
//         <input
//           {...register("email")}
//           type="email"
//           placeholder="name@company.com"
//           className={`w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
//             errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-700"
//           }`}
//         />
//         {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//       </div>

//       {/* Password Field */}
//       <div>
//         <label className="block text-sm font-medium mb-1">Password</label>
//         <input
//           {...register("password")}
//           type="password"
//           placeholder="••••••••"
//           className={`w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
//             errors.password ? "border-red-500" : "border-gray-300 dark:border-slate-700"
//           }`}
//         />
//         {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//       </div>

//       {/* Confirm Password Field */}
//       <div>
//         <label className="block text-sm font-medium mb-1">Confirm Password</label>
//         <input
//           {...register("confirmPassword")}
//           type="password"
//           placeholder="••••••••"
//           className={`w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
//             errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-slate-700"
//           }`}
//         />
//         {errors.confirmPassword && (
//           <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
//         )}
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 mt-4"
//       >
//         {isSubmitting ? "Creating Account..." : "Create Account"}
//       </button>
//     </form>
//   );
// }