"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/app/lib/api/user";
import { Loader2 } from "lucide-react";

export default function UserViewPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser(id as string).then((data) => {
      setUser(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader2 className="animate-spin mx-auto" />;

  if (!user) return <p>User not found</p>;

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">User Details: {id}</h1>
      <div className="bg-card p-6 rounded-lg border">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.image && <img src={user.image} alt="User" className="w-32 h-32 mt-4" />}
      </div>
      <Link href={`/admin/users/${id}/edit`} className="mt-4 inline-block text-blue-600">Edit</Link>
      <Link href="/admin/users" className="mt-4 ml-4 inline-block">Back to Users</Link>
    </div>
  );
}