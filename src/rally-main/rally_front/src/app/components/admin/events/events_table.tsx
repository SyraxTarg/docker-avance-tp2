"use client";
import Pagination from "@/app/components/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import EventFiltersModal from "./filter_events_modal";
import { useDisclosure } from "@heroui/modal";

type Event = {
    id: number;
    title: string;
    description: string;
    nb_places: number;
    price: number;
    created_at: string;
    profile: {
        id: number;
        first_name: string;
        last_name: string;
        photo: string;
        nb_like: number;
        email: string;
        created_at: string;
    };
};

type Filters ={
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
    events: Event[];
    currentPage: number;
    totalPages: number;
    filters: Filters;
    types: {
        id: number;
        type: string;
    }[];

};

export default function AdminEvents({ events, currentPage, totalPages, filters, types }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("currentPage", page.toString());
        router.push(`/admin/events?${params.toString()}`);
    };

    const handleApplyFilters = (filters: Filters) => {
        const params = new URLSearchParams();

        if (filters.date_avant) params.set("date_avant", filters.date_avant.toString());
        if (filters.date_apres) params.set("date_apres", filters.date_apres.toString());

        if (filters.type_ids && Array.isArray(filters.type_ids)) {
            filters.type_ids.forEach((id: number) => {
                params.append("type_ids", id.toString());
            });
        }

        if (filters.country) params.set("country", filters.country.toString());
        if (filters.city) params.set("city", filters.city.toString());
        if (filters.popularity !== undefined) params.set("popularity", filters.popularity.toString());
        if (filters.recent !== undefined) params.set("recent", filters.recent.toString());
        if (filters.nb_places !== undefined) params.set("nb_places", filters.nb_places.toString());
        if (filters.search) params.set("search", filters.search.toString());
        if (filters.price) params.set("price", filters.price.toString());

        params.set("currentPage", "1");
        router.push(`/admin/events?${params.toString()}`);
    };


    return (
        <>
            {/* Header + Filters Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl sm:text-3xl font-extrabold max-w-[70%] sm:max-w-full text-gray-900 dark:text-white">
                    Liste des Événements
                </h1>

                <button
                    onClick={onOpen}
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-[#4338CA] hover:bg-[#6366F1] focus:ring-4 focus:ring-[#6366F1] text-white font-semibold px-5 py-2 rounded-md shadow transition cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    Filtres
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block relative overflow-x-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            {["ID", "Titre", "Description", "Places", "Prix", "Organisateur", "Email", "Date de création"].map(
                                (header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300"
                                    >
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{event.id}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{event.title}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{event.description}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{event.nb_places}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{event.price} €</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                    {event.profile.first_name} {event.profile.last_name}
                                </td>
                                <td className="px-6 py-4 text-blue-600 dark:text-blue-400 hover:underline">
                                    <a href={`mailto:${event.profile.email}`}>{event.profile.email}</a>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    {new Date(event.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden p-4 space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 space-y-2"
                    >
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>ID :</strong> {event.id}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Titre :</strong> {event.title}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Description :</strong>
                            <p className="mt-1 text-gray-800 dark:text-gray-200">{event.description}</p>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Places :</strong> {event.nb_places}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Prix :</strong> {event.price} €
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Organisateur :</strong> {event.profile.first_name} {event.profile.last_name}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Email :</strong> <a href={`mailto:${event.profile.email}`} className="text-blue-600 dark:text-blue-400 underline">{event.profile.email}</a>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Date de création :</strong> {new Date(event.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}

            {/* Modal de Filtres */}
            <EventFiltersModal
                isOpen={isOpen}
                initialFilters={filters}
                onApply={handleApplyFilters}
                onClose={onClose}
                types={types}
            />
        </>
    );
}
