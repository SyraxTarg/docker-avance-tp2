'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectItem } from "@heroui/select";

type Filters = {
    date?: string;
    email?: string;
    event_email?: string;
    payment_status?: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Filters) => void;
    initialFilters: Filters;
};

export default function RegistrationsFiltersModal({
    isOpen,
    onClose,
    onApply,
    initialFilters,
}: Props) {
    const [filters, setFilters] = useState<Filters>({});
    const paymentStatus = [
        { value: "success", name: "réussi" },
        { value: "pending", name: "en cours" },
        { value: "failed", name: "échoué" },
        { value: "free", name: "gratuit" },
    ]


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
                    <label className="text-sm font-semibold text-gray-800 dark:text-white">Utilisateur</label>
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
                    <label className="text-sm font-semibold text-gray-800 dark:text-white">Statut</label>
                    <Select
                        className="max-w-full"
                        aria-label="Statut"
                        placeholder="Statut"
                        key={filters.payment_status || ''}
                        selectedKeys={new Set(filters.payment_status ? [filters.payment_status] : [])}
                        onSelectionChange={(selected) => {
                            const selectedValue = Array.from(selected)[0] as string | undefined;
                            setFilters((f) => ({
                                ...f,
                                payment_status: selectedValue,
                            }));
                        }}
                    >
                        {paymentStatus.map((status) => (
                            <SelectItem key={status.value}>
                                {status.name}
                            </SelectItem>
                        ))}
                    </Select>
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
                        className="bg-[#4338CA] hover:bg-[#6366F1] focus:ring-4 focus:ring-[#6366F1] font-semibold px-6 py-2 rounded-lg transition shadow"
                    >
                        Filtrer
                    </button>
                </div>
            </form>
        </div>
    );
}
