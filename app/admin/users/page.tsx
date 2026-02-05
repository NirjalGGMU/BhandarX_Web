// app/admin/users/page.tsx


import Link from "next/link";
import { handleGetAllUsers } from "@/app/lib/actions/admin/user-action";

export default async function Page() {
    const result = await handleGetAllUsers();
    const users = result.success ? result.data : [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <Link
                    href="/admin/users/create"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700"
                >
                    Create User
                </Link>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Username</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user: any) => (
                                <tr key={user._id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/users/${user._id}/edit`}
                                                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}