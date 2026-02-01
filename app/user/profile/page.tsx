"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { updateProfile } from "../../lib/api/user";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { getUserData, setUserData } from "../../lib/cookie";  // Client-side, but for initial data

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);  // Fetch initial user

  useEffect(() => {
    // Client-side fetch user from cookie or API
    const currentUser = getUserData();  // Assuming client-side version or fetch
    setUser(currentUser);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await updateProfile(user.id, data, image);
      if (result.success) {
        setSuccess("Profile updated successfully!");
        // Update cookie if needed (e.g., name changed)
        setUserData(result.user);  // Assume function to update cookie client-side or reload
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-12">
      <h1 className="text-3xl font-bold text-center">Update Profile</h1>
      {user && user.image && <img src={user.image} alt="Profile" className="w-32 h-32 rounded-full mx-auto" />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Similar to RegisterForm, with optional fields */}
        <div>
          <label>Name</label>
          <input {...register("name")} placeholder={user?.name} className="w-full py-3 border rounded-lg" />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} type="email" placeholder={user?.email} className="w-full py-3 border rounded-lg" />
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
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full py-3 border rounded-lg" />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-lg">
          {isLoading ? <Loader2 className="animate-spin" /> : "Update Profile"}
        </button>
      </form>
    </div>
  );
}