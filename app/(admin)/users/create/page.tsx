"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createUser } from "@/app/lib/api/user";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  role: z.enum(["user", "admin"]),
}).refine((data) => data.password === data.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

type UserData = z.infer<typeof userSchema>;

export default function CreateUserPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<UserData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserData) => {
    setIsLoading(true);
    try {
      const result = await createUser(data, image);
      if (result.success) setSuccess("User created!");
      else setError(result.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Create User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Fields similar to RegisterForm */}
        <div>
          <label>Name</label>
          <input {...register("name")} className="w-full py-3 border rounded-lg" />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} type="email" className="w-full py-3 border rounded-lg" />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input {...register("password")} type="password" className="w-full py-3 border rounded-lg" />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input {...register("confirmPassword")} type="password" className="w-full py-3 border rounded-lg" />
          {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
        </div>
        <div>
          <label>Role</label>
          <select {...register("role")} className="w-full py-3 border rounded-lg">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-lg">
          {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
        </button>
      </form>
    </div>
  );
}