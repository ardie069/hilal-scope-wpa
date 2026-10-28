"use client";

import { useHome } from "@/hooks/home/use-home";
import HomeView from "@/components/home/HomeView";

export default function HomeClient() {
  const state = useHome();
  return <HomeView {...state} />;
}
