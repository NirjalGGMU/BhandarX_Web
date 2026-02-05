// app/admin/_components//Header.tsx

// Header.tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { logout, user } = useAuth();

    return (
        <header className="sticky top-0 z-50 backdrop-blur bg-background/95 border-b border-border shadow-sm">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/admin" className="flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
                                A
                            </span>
                            <span className="text-base font-semibold">Admin Panel</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{user?.email || 'Admin'}</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
