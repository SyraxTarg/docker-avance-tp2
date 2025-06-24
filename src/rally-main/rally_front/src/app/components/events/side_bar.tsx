"use client";
import React, { useState } from "react";
import CustomDatePicker from "./date_picker";
import { useRouter, useSearchParams } from "next/navigation";

type SidebarProps = {
  children: React.ReactNode;
  filters: Filters;
  types: EventType[];
};

type EventType = {
  id: number;
  type: string;
};

interface Filters {
  search?: string;
  type_ids?: number[];
  date_avant?: string;
  date_apres?: string;
  city?: string;
  country?: string;
  popularity?: boolean;
  recent?: boolean;
  price?: number;
}

export default function Sidebar({ children, filters, types }: SidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const searchParams = useSearchParams();

  const updateQuery = (updated: Filters) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type_ids");

    updated.type_ids?.forEach((id) => params.append("type_ids", id.toString()));

    if (updated.date_avant) {
      params.set("date_avant", updated.date_avant);
    } else {
      params.delete("date_avant");
    }

    if (updated.date_apres) {
      params.set("date_apres", updated.date_apres);
    } else {
      params.delete("date_apres");
    }

    if (updated.city !== undefined) {
      if (updated.city) {
        params.set("city", updated.city);
      } else {
        params.delete("city");
      }
    }

    if (updated.country !== undefined) {
      if (updated.country) {
        params.set("country", updated.country);
      } else {
        params.delete("country");
      }
    }

    if (updated.popularity !== undefined) {
      if (updated.popularity) {
        params.set("popularity", "true");
      } else {
        params.delete("popularity");
      }
    }

    if (updated.recent !== undefined) {
      if (updated.recent) {
        params.set("recent", "true");
      } else {
        params.delete("recent");
      }
    }

    router.push(`/events/?${params.toString()}`, { scroll: false });
  };
  

  const toggleType = (typeId: number) => {
    const updatedTypes = localFilters.type_ids?.includes(typeId)
      ? localFilters.type_ids.filter((id) => id !== typeId)
      : [...(localFilters.type_ids || []), typeId];
    const updated = { ...localFilters, type_ids: updatedTypes };
    setLocalFilters(updated);
    updateQuery(updated);
  };

  const onDateAvantChange = (date: string | null) => {
    const updated = { ...localFilters, date_avant: date || undefined };
    setLocalFilters(updated);
    updateQuery(updated);
  };

  const onDateApresChange = (date: string | null) => {
    const updated = { ...localFilters, date_apres: date || undefined };
    setLocalFilters(updated);
    updateQuery(updated);
  };

  const onCityChange = (city: string) => {
    const updated = { ...localFilters, city };
    setLocalFilters(updated);
    updateQuery(updated);
  };

  const onCountryChange = (country: string) => {
    const updated = { ...localFilters, country };
    setLocalFilters(updated);
    updateQuery(updated);
  };

  const onPopularToggle = (value: boolean) => {
    const updated = { ...localFilters, popularity: value };
    setLocalFilters(updated);
    updateQuery(updated);
  };

  const onRecentToggle = (value: boolean) => {
    const updated = { ...localFilters, recent: value };
    setLocalFilters(updated);
    updateQuery(updated);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      {/* Sidebar */}
      <div className={`bg-white shadow-md transition-all duration-300 ease-in-out z-40 sm:relative fixed top-16 sm:top-0 left-0 ${isOpen ? "w-64" : "w-0"} overflow-hidden`}>
        {isOpen && (
          <div className="p-4 relative">
            <button
              className="absolute top-2 right-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer la barre latérale"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6">Filtres</h2>

            {/* Types */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Types</h3>
              <ul className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {types.map((eventType) => (
                  <li key={eventType.id}>
                    <button
                      onClick={() => toggleType(eventType.id)}
                      className={`px-3 py-1 rounded-full text-sm transition ${localFilters.type_ids?.includes(eventType.id)
                          ? "bg-[#4338CA] text-white"
                          : "bg-gray-200 text-[#4338CA] hover:bg-[#4338CA]/10"
                        }`}
                    >
                      {eventType.type}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dates */}
            <div className="mb-6 space-y-4">
              <CustomDatePicker
                label="Date avant"
                value={localFilters.date_avant || ""}
                onChange={onDateAvantChange}
                ariaLabel="choisir une date avant évenement"
              />
              <CustomDatePicker
                label="Date après"
                value={localFilters.date_apres || ""}
                onChange={onDateApresChange}
                ariaLabel="choisir une date après évenement"
              />
            </div>

            {/* Localisation */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Localisation</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="city" className="block text-sm text-gray-600 mb-1">Ville</label>
                  <input
                    id="city"
                    defaultValue={localFilters.city}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex : Paris"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm text-gray-600 mb-1">Pays</label>
                  <input
                    id="country"
                    defaultValue={localFilters.country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex : France"
                  />
                </div>
              </div>
            </div>

            {/* Tri */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Trier par</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => onPopularToggle(!localFilters.popularity)}
                  className={`px-3 py-1 rounded-full text-sm transition ${localFilters.popularity ? "bg-[#4338CA] text-white" : "bg-gray-200 text-[#4338CA]"
                    }`}
                >
                  Les plus populaires
                </button>
                <button
                  onClick={() => onRecentToggle(!localFilters.recent)}
                  className={`px-3 py-1 rounded-full text-sm transition ${localFilters.recent ? "bg-[#4338CA] text-white" : "bg-gray-200 text-[#4338CA]"
                    }`}
                >
                  Les plus récents
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className={`flex-1 p-4 transition-all duration-300 ${isOpen ? "ml-0 sm:ml-64" : ""}`}>
        {!isOpen && (
          <button
            className="fixed top-20 left-4 z-30 bg-[#0F172A] text-white p-2 rounded-md shadow-md cursor-pointer"
            onClick={() => setIsOpen(true)}
            aria-label="Ouvrir la barre latérale"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="w-6 h-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
