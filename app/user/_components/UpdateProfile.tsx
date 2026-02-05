// app/user/_components/UpdateProfile.tsx

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Image from "next/image";
import { handleUpdateProfile } from "@/app/lib/actions/auth-action";
import { UpdateUserData, updateUserSchema } from "../schema";

export default function UpdateUserForm({ user }: { user: any }) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } =
        useForm<UpdateUserData>({
            resolver: zodResolver(updateUserSchema),
            values: {
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                username: user?.username || ''
            }
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

    const onSubmit = async (data: UpdateUserData) => {
        setError(null);
        setSuccess(null);
        try {
            const formData = new FormData();
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            formData.append('username', data.username);
            if (data.image) {
                formData.append('image', data.image);
            }

            const response = await handleUpdateProfile(formData);

            if (!response.success) {
                throw new Error(response.message || 'Update profile failed');
            }

            handleDismissImage();
            setSuccess('Profile updated successfully');
        } catch (error: Error | any) {
            setError(error.message || 'Profile update failed');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Update Profile</h1>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
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
                        <Image
                            src={"http://localhost:5050"+ user.imageUrl}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="w-32 h-32 rounded-full object-cover border-4 border-border"
                        />
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

                {/* Username */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Username</label>
                    <input
                        type="text"
                        {...register("username")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>

                {/* First Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">First Name</label>
                    <input
                        type="text"
                        {...register("firstName")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Last Name</label>
                    <input
                        type="text"
                        {...register("lastName")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
}