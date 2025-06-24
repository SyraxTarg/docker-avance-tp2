"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const searchSchema = z
  .string()
  .trim()
  .max(100, { message: "La recherche ne peut pas dépasser 100 caractères." });

type SearchBarProps = {
  search?: string;
  prop_type: string;
};

export default function SearchBar({ search, prop_type }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== searchTerm) {
      setSearchTerm(currentSearch);
    }
  }, [searchParams, searchTerm]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchTerm.trim();

      const validation = searchSchema.safeParse(trimmed);
      if (!validation.success && trimmed !== "") {
        setError(validation.error.issues[0].message);
        return;
      }

      setError(null);

      const params = new URLSearchParams(searchParams.toString());
      const existing = params.get("search");

      if (trimmed && existing !== trimmed) {
        params.set("search", trimmed);
        router.push(`/events/?${params.toString()}`, { scroll: false });
      } else if (!trimmed && existing) {
        params.delete("search");
        router.push(`/events/?${params.toString()}`, { scroll: false });
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeout);
  }, [searchTerm, searchParams, router]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto my-6 space-y-1">
      <input
        type="text"
        placeholder={`Rechercher un ${prop_type}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-[#4338CA]"
          }`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
