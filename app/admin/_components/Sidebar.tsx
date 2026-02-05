// app/admin/_components//Sidebar.tsx


// Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const isActive = (href: string) => href === "/admin" ? pathname === href : pathname?.startsWith(href);

    return (
        <aside className="fixed md:static top-0 left-0 h-screen w-64 bg-card border-r border-border z-40 overflow-y-auto">
            <div className="p-4 border-b border-border">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">A</div>
                    <span className="font-semibold">Admin Panel</span>
                </Link>
            </div>

            <nav className="p-2 space-y-1">
                {ADMIN_LINKS.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive(link.href)
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                : 'hover:bg-accent'
                        }`}
                    >
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}