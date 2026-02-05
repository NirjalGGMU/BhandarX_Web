// app/admin/users/_components/CreateUserForm.tsx

"use client";
import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { handleCreateUser } from "@/app/lib/actions/admin/user-action";
import { useRouter } from "next/navigation";

export default function CreateUserForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserData>({
        resolver: zodResolver(UserSchema)
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: UserData) => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            try {
                const formData = new FormData();
                if (data.firstName) formData.append('firstName', data.firstName);
                if (data.lastName) formData.append('lastName', data.lastName);
                formData.append('email', data.email);
                formData.append('username', data.username);
                formData.append('password', data.password);
                formData.append('confirmPassword', data.confirmPassword);
                if (data.image) formData.append('image', data.image);

                const response = await handleCreateUser(formData);

                if (!response.success) {
                    throw new Error(response.message || 'Create user failed');
                }

                reset();
                handleDismissImage();
                setSuccess('User created successfully');
                setTimeout(() => {
                    router.push('/admin/users');
                }, 1500);
            } catch (error: Error | any) {
                setError(error.message || 'Create user failed');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New User</h1>

            {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Profile Image */}
            <div className="space-y-3">
                <label className="block text-sm font-medium">Profile Image</label>
                {previewImage ? (
                    <div className="relative w-32 h-32">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-border"
                        />
                        <Controller
                            name="image"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <button
                                    type="button"
                                    onClick={() => handleDismissImage(onChange)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        />
                    </div>
                ) : (
                    <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center border-4 border-border">
                        <span className="text-muted-foreground">No Image</span>
                    </div>
                )}

                <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                            accept=".jpg,.jpeg,.png,.webp"
                            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    )}
                />
                {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                        type="text"
                        {...register("firstName")}
                        placeholder="John"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && <p className="text-xs text-red-600">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                        type="text"
                        {...register("lastName")}
                        placeholder="Doe"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && <p className="text-xs text-red-600">{errors.lastName.message}</p>}
                </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                    type="email"
                    {...register("email")}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Username */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <input
                    type="text"
                    {...register("username")}
                    placeholder="johndoe"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="••••••"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
                {isSubmitting || pending ? "Creating..." : "Create User"}
            </button>
        </form>
    );
}