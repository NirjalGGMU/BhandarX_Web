"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { updateUser, getUser } from "@/app/lib/api/user";
// import { updateUser, getUser } from "../../../../../lib/api/user";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const editSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  confirmPassword: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

type EditData = z.infer<typeof editSchema>;

export default function UserEditPage() {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditData>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    getUser(id as string).then((data) => {
      setCurrentUser(data);
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("role", data.role);
    });
  }, [id, setValue]);

  const onSubmit = async (data: EditData) => {
    setIsLoading(true);
    try {
      const result = await updateUser(id as string, data, image);
      if (result.success) setSuccess("User updated!");
      else setError(result.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Edit User: {id}</h1>
      {currentUser && currentUser.image && <img src={currentUser.image} alt="Current" className="w-32 h-32 mb-4" />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Similar fields as create, pre-filled */}
        <div>
          <label>Name</label>
          <input {...register("name")} className="w-full py-3 border rounded-lg" />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>
        {/* ... other fields ... */}
        <div>
          <label>Image (Upload new to replace)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-lg">
          {isLoading ? <Loader2 className="animate-spin" /> : "Update"}
        </button>
      </form>
    </div>
  );
}