"use client";

import { useSearch } from "@/hooks/search/use-search";
import SearchView from "./SearchView";

export default function SearchClient() {
  const state = useSearch();
  return <SearchView {...state} />;
}
