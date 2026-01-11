// app/components/Header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-white bg-indigo-600"
      : "text-gray-600 hover:bg-indigo-100";

  return (
    <header className="sticky top-0 bg-white dark:bg-slate-900 shadow">
      <nav className="container flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          BhandarX
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className={`px-4 py-2 rounded ${linkClass("/")}`}>
            Home
          </Link>
          <Link href="/about" className={`px-4 py-2 rounded ${linkClass("/about")}`}>
            About
          </Link>
          <Link href="/login" className="px-4 py-2 rounded border">
            Login
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
