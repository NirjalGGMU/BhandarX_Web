"use client";

import ThemeToggle from "@/app/_components/ThemeToggle";
import { handleLogout } from "@/app/lib/actions/auth-action";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/about", label: "About", icon: "ℹ️" },
];

export default function UserHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/95 border-b border-border shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold text-xl shadow-lg">
                <span className="relative z-10">B</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  BhandarX
                </span>
                <span className="text-[10px] text-muted-foreground font-medium -mt-1">Inventory Managed Efficiently</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.href) ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Logout + Theme */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
            >
              Logout
            </button>
            <ThemeToggle />
            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all ${open ? "rotate-45 top-3" : "top-1"}`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current top-3 transition-all ${open ? "opacity-0" : "opacity-100"}`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all ${open ? "-rotate-45 top-3" : "top-5"}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"}`}>
          <div className="pb-4 pt-2 border-t border-border">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    isActive(link.href) ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="mt-2 w-full px-4 py-3 text-sm font-medium text-center rounded-lg border border-border hover:bg-accent transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}