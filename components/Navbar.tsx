"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useMounted } from "@/hooks/use-mounted";
import NavMobileMenu from "./NavMobileMenu";

const DESKTOP_LINKS = [
  { href: "/moon-info",       label: "Info Bulan" },
  { href: "/calendar",        label: "Kalender" },
  { href: "/visibility-map",  label: "Peta Visibilitas" },
  { href: "/prayer-times",    label: "Jadwal Sholat" },
  { href: "/search",          label: "Cari Tanggal" },
];

function NavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-xl text-sm font-black transition-all duration-300
        ${active ? "text-primary bg-primary/5 shadow-soft" : "text-gray-500 hover:text-primary hover:bg-primary/5"}`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
      )}
    </Link>
  );
}

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const mounted = useMounted();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isDark = mounted && darkMode;

  return (
    <nav className="sticky top-0 z-1100 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-all duration-500 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between h-16 sm:h-20 relative">
          <div className="flex-none">
            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-all duration-300 group">
              <div className="text-3xl sm:text-4xl group-hover:rotate-12 transition-transform duration-500 ease-out text-primary">
                {isDark ? <Moon size={36} /> : <Sun size={36} />}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl tracking-tighter text-gray-900 dark:text-white leading-tight">
                  Hilal <span className="text-primary">Scope</span>
                </span>
                <span className="text-[9px] font-black tracking-[0.4em] opacity-40 uppercase">Lansekap Astronomi</span>
              </div>
            </Link>
          </div>

          <div className="flex flex-row items-center gap-1 sm:gap-4">
            <div className="hidden md:flex flex-row items-center gap-2 mr-4 border-r border-gray-100 dark:border-white/10 pr-6">
              {DESKTOP_LINKS.map(({ href, label }) => (
                <NavLink key={href} href={href} active={pathname === href} label={label} />
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className={`btn btn-ghost btn-circle btn-sm sm:btn-md transition-all duration-500 hover:scale-110 active:scale-90 cursor-pointer
                ${isDark ? "hover:bg-yellow-500/10" : "hover:bg-indigo-500/10"}`}
            >
              {mounted ? (
                isDark ? <Sun size={20} /> : <Moon size={20} />
              ) : (
                <span className="loading loading-spinner loading-xs opacity-20" />
              )}
            </button>

            <NavMobileMenu
              isOpen={isOpen}
              pathname={pathname}
              onClose={() => setIsOpen(false)}
              onToggle={() => setIsOpen((v) => !v)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
