// src/admin/users/[id]/page.tsx

import { handleGetUserById } from "@/app/lib/actions/admin/user-action";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await handleGetUserById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const user = result.data;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <Link href="/admin/users" className="text-blue-600 hover:underline">
                    ← Back to Users
                </Link>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-start gap-6">
                    {user.imageUrl ? (
                        <Image
                            src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                            alt="Profile"
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-4xl">👤</span>
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{user.firstName} {user.lastName}</h1>
                        <p className="text-muted-foreground mb-4">@{user.username}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <span className="text-sm text-muted-foreground">Email</span>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Role</span>
                                <p className="font-medium capitalize">{user.role}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">User ID</span>
                                <p className="font-mono text-sm">{user._id}</p>
                            </div>
                        </div>

                        <Link
                            href={`/admin/users/${id}/edit`}
                            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700"
                        >
                            Edit User
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}