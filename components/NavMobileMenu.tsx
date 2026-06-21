"use client";

import Link from "next/link";
import { Info, Calendar, Map, Clock, Search } from "lucide-react";

const NAV_ITEMS = [
  { href: "/moon-info",       label: "Info Bulan",       icon: Info },
  { href: "/calendar",        label: "Kalender",         icon: Calendar },
  { href: "/visibility-map",  label: "Peta Visibilitas", icon: Map },
  { href: "/prayer-times",    label: "Jadwal Sholat",    icon: Clock },
  { href: "/search",          label: "Cari Tanggal",     icon: Search },
];

interface Props {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
  onToggle: () => void;
}

export default function NavMobileMenu({ isOpen, pathname, onClose, onToggle }: Props) {
  return (
    <div className="md:hidden relative">
      <button
        onClick={onToggle}
        className="btn btn-ghost btn-circle btn-sm hover:bg-primary/10"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[-1]" onClick={onClose} />
          <ul className="absolute right-0 mt-4 p-3 shadow-2xl bg-card-light dark:bg-card-dark rounded-3xl w-60 border border-gray-100 dark:border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <li className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3 px-4 pt-2">Menu</li>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <li key={href} className="mt-1">
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 p-4 font-bold rounded-2xl transition-all ${
                    pathname === href ? "bg-primary text-white" : "hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Icon size={16} /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
