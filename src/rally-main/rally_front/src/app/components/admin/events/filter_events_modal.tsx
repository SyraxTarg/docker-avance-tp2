"use client";

import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/select";

type Filters = {
    date_avant?: string;
    date_apres?: string;
    type_ids?: number[];
    country?: string;
    city?: string;
    popularity?: boolean;
    recent?: boolean;
    nb_places?: number;
    search?: string;
    price?: number;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Filters) => void;
    initialFilters: Filters;
    types: {
        id: number;
        type: string;
    }[];
};

export default function EventsFiltersModal({
    isOpen,
    onClose,
    onApply,
    initialFilters,
    types
}: Props) {
    console.log(types)
    const [filters, setFilters] = useState<Filters>({});

    useEffect(() => {
        if (isOpen) setFilters(initialFilters || {});
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
                className="relative z-50 max-w-5xl w-full bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {/* Recherche */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Recherche</label>
                    <input
                        type="text"
                        placeholder="Titre, description..."
                        className="border border-gray-300 p-2.5 rounded-lg"
                        value={filters.search || ""}
                        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    />
                </div>

                {/* Date après */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Après le</label>
                    <input
                        type="date"
                        className="border border-gray-300 p-2.5 rounded-lg"
                        value={filters.date_apres || ""}
                        onChange={(e) => setFilters((f) => ({ ...f, date_apres: e.target.value }))}
                    />
                </div>

                {/* Date avant */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Avant le</label>
                    <input
                        type="date"
                        className="border border-gray-300 p-2.5 rounded-lg"
                        value={filters.date_avant || ""}
                        onChange={(e) => setFilters((f) => ({ ...f, date_avant: e.target.value }))}
                    />
                </div>

                {/* Nombre de places */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Places</label>
                    <input
                        type="number"
                        min={0}
                        placeholder="Ex: 10"
                        className="border border-gray-300 p-2.5 rounded-lg"
                        value={filters.nb_places ?? ""}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                nb_places: e.target.value ? parseInt(e.target.value) : undefined,
                            }))
                        }
                    />
                </div>

                {/* Classer par prix */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Classer par prix</label>
                    <input
                        type="number"
                        min={0}
                        placeholder="Ex: 10"
                        step="0.01"
                        className="border border-gray-300 p-2.5 rounded-lg"
                        value={Number.isFinite(filters.price) ? filters.price : ""}
                        onChange={(e) =>
                            setFilters((f) => ({
                            ...f,
                            price: e.target.value !== "" ? parseFloat(e.target.value) : undefined,
                            }))
                        }
                    />

                </div>

                {/* Pays */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Pays</label>
                    <input
                        type="text"
                        placeholder="France, Canada..."
                        className="border border-gray-300 p-2.5 rounded-lg"
                        value={filters.country || ""}
                        onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))}
                    />
                </div>

                {/* Ville */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Ville</label>
                    <input
                        type="text"
                        placeholder="Paris, Montréal..."
                        className="border border-gray-300 p-2.5 rounded-lg"
                        value={filters.city || ""}
                        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                    />
                </div>

                {/* Popularité */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Populaire</label>
                    <Select
                        placeholder="Populaire ?"
                        selectedKeys={
                            filters.popularity === true
                                ? new Set(["true"])
                                : filters.popularity === false
                                    ? new Set(["false"])
                                    : new Set()
                        }
                        onSelectionChange={(selected) => {
                            const [val] = Array.from(selected);
                            setFilters((f) => ({
                                ...f,
                                popularity: val === "true" ? true : val === "false" ? false : undefined,
                            }));
                        }}
                    >
                        <SelectItem key="true">Oui</SelectItem>
                        <SelectItem key="false">Non</SelectItem>
                    </Select>
                </div>

                {/* Récents */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Récents</label>
                    <Select
                        placeholder="Tri par récence"
                        selectedKeys={
                            filters.recent === true
                                ? new Set(["true"])
                                : filters.recent === false
                                    ? new Set(["false"])
                                    : new Set()
                        }
                        onSelectionChange={(selected) => {
                            const [val] = Array.from(selected);
                            setFilters((f) => ({
                                ...f,
                                recent: val === "true" ? true : val === "false" ? false : undefined,
                            }));
                        }}
                    >
                        <SelectItem key="true">Oui</SelectItem>
                        <SelectItem key="false">Non</SelectItem>
                    </Select>
                </div>

                {/* Types d’événement */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">Types d’événement</label>
                    <Select
                        aria-label="Sélectionnez des types"
                        placeholder="Sélectionnez des types"
                        selectionMode="multiple"
                        selectedKeys={new Set((filters.type_ids || []).map(String))}
                        onSelectionChange={(selectedKeys) => {
                            const selectedIds = Array.from(selectedKeys).map(Number);
                            setFilters((f) => ({
                                ...f,
                                type_ids: selectedIds,
                            }));
                        }}
                    >
                        {types.map((type) => (
                            <SelectItem key={type.id.toString()}>
                                {type.type}
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
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow"
                    >
                        Filtrer
                    </button>
                </div>
            </form>
        </div>
    );
}
