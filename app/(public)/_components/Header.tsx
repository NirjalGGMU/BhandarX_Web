"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "@/app/_components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/about", label: "About", icon: "ℹ️" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border" : "bg-background/80 backdrop-blur-md border-b border-border/50"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <span className="relative z-10">B</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">
                  BhandarX
                </span>
                <span className="text-[10px] text-muted-foreground font-medium -mt-1">Inventory Managed Efficiently</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive(link.href) ? "bg-background text-foreground shadow-md" : "text-foreground/60 hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium rounded-full border border-border hover:bg-accent hover:border-foreground/20 transition-all duration-300"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign up
              </Link>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border"></div>
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileOpen ? "rotate-45 top-3" : "top-1"}`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current top-3 transition-all duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"}`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileOpen ? "-rotate-45 top-3" : "top-5"}`}></span>
              </div>
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive(link.href) ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-foreground border-l-4 border-blue-600" : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="h-px bg-border my-2"></div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-center rounded-xl border border-border hover:bg-accent transition-all duration-300"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}