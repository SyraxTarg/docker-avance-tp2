'use client';

import React, { useEffect, useState } from 'react';

type Filters = {
    date?: string;
    search?: string;
    email?: string;
    event_email?: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Filters) => void;
    initialFilters: Filters;
};

export default function CommentFiltersModal({
    isOpen,
    onClose,
    onApply,
    initialFilters,
}: Props) {
    const [filters, setFilters] = useState<Filters>({});

    useEffect(() => {
        if (isOpen) {
            setFilters(initialFilters || {});
        }
    }, [isOpen, initialFilters]);


    if (!isOpen) return null;

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        onApply(filters);
        onClose();
    };

    const handleClear = () => {
        setFilters({});
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <form
                onSubmit={handleApply}
                className="relative z-50 max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {/* Date */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800 dark:text-white">Date</label>
                    <input
                        type="date"
                        value={filters.date || ''}
                        onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
                        className="border border-gray-300 p-2.5 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Signalé par */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800 dark:text-white">Auteur par</label>
                    <input
                        type="text"
                        placeholder="email"
                        value={filters.email || ''}
                        onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
                        className="border border-gray-300 p-2.5 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Utilisateur signalé */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800 dark:text-white">Auteur de l&apos;évènement</label>
                    <input
                        type="text"
                        placeholder="email"
                        value={filters.event_email || ''}
                        onChange={(e) => setFilters((f) => ({ ...f, event_email: e.target.value }))}
                        className="border border-gray-300 p-2.5 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800 dark:text-white">Recherche</label>
                    <input
                        type="text"
                        placeholder="text"
                        value={filters.search || ''}
                        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                        className="border border-gray-300 p-2.5 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Boutons */}
                <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-lg transition shadow"
                    >
                        Réinitialiser
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow"
                    >
                        Filtrer
                    </button>
                </div>
            </form>
        </div>
    );
}
