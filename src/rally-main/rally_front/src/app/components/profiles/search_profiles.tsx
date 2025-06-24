"use client";

import React, { useState, useRef } from "react";
import { z } from "zod";

// Définition du schéma
const searchSchema = z
    .string()
    .trim()
    .max(100, "La recherche ne peut pas dépasser 100 caractères.");

interface SearchBarProps {
    placeholder?: string;
    onSearch: (filters: Filters) => void;
}

type Filters = {
    search: string;
};

const DEBOUNCE_DELAY = 400;

export default function SearchBar({
    placeholder = "Recherchez un organisateur",
    onSearch,
}: SearchBarProps){
    const [query, setQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            const validation = searchSchema.safeParse(value);

            if (!validation.success && value.trim() !== "") {
                setError(validation.error.issues[0].message);
                return;
            }

            setError(null);
            onSearch({ search: value.trim() });
        }, DEBOUNCE_DELAY);
    };

    return (
        <div className="w-full">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all ${error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#4338CA] focus:border-[#4338CA]"
                    } dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400`}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};
