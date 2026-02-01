"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers, deleteUser } from "@/app/lib/api/user";
import { Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Delete user?")) {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  if (loading) return <Loader2 className="animate-spin mx-auto" />;

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      <Link href="/admin/users/create" className="mb-4 inline-block bg-blue-600 text-white py-2 px-4 rounded">Create User</Link>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Image</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={6} className="text-center p-4">No users found</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.image ? <img src={user.image} alt="User" className="w-10 h-10" /> : "No image"}</td>
                <td className="p-2">
                  <Link href={`/admin/users/${user.id}`} className="text-blue-600 mr-2">View</Link>
                  <Link href={`/admin/users/${user.id}/edit`} className="text-blue-600 mr-2">Edit</Link>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}