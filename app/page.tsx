import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Beranda | Hilal Scope",
  description:
    "Aplikasi kalender Hijriyah modern berbasis astronomi presisi dan kearifan lokal.",
};

export default function HomePage() {
  return <HomeClient />;
}
