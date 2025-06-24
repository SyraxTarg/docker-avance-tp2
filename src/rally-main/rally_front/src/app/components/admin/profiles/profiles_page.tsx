"use client";

import { useState } from "react";
import RoleModal from "@/app/components/admin/profiles/role_modal";
import ProfilesFiltersModal from "@/app/components/admin/profiles/filters_modal";
import Pagination from "@/app/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";

type Profile = {
    id: number;
    first_name: string;
    last_name: string;
    photo: string;
    nb_like: number;
    user: {
        id: number;
        email: string;
        phone_number: string;
        is_planner: boolean;
        account_id: string | null;
        role: {
            id: number;
            role: string;
        }
    };
    created_at: Date;
    updated_at: Date;
};

export interface Filters {
    search?: string;
    role?: string;
    is_planner?: boolean;
    nb_like?: string;
}


interface Props {
    profiles: Profile[];
    currentPage: number;
    totalPages: number;
    filters: Filters;
}

export default function ProfileBackOffice({ profiles, currentPage, totalPages, filters }: Props) {
    const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("currentPage", page.toString());
        router.push(`/admin/super-admin/profiles?${params.toString()}`, { scroll: false });
    };

    const handleApplyFilters = (newFilters: Filters) => {
        const params = new URLSearchParams();

        if (newFilters.search) params.set("search", newFilters.search);
        if (newFilters.role) params.set("role", newFilters.role);
        if (newFilters.is_planner !== undefined) params.set("is_planner", String(newFilters.is_planner));
        if (newFilters.nb_like) params.set("nb_like", newFilters.nb_like);

        params.set("currentPage", "1"); // reset pagination

        router.push(`/admin/super-admin/profiles?${params.toString()}`);
    };


    return (
        <>
            {/* Filtres */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Liste des Profils</h1>
                <button
                    onClick={() => setIsFiltersOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#4338CA] hover:bg-[#6366F1] focus:ring-4 focus:ring-[#6366F1] text-white font-semibold px-5 py-2 rounded-md shadow transition cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    Filtres
                </button>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block relative overflow-x-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            {["ID", "Utilisateur", "Email", "Rôle", "Organisateur", "Créé le", "Téléphone", "Changer de rôle"].map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        {profiles.map((profile) => (
                            <tr key={profile.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{profile.id}</td>
                                <td className="px-6 py-4 text-blue-600 dark:text-blue-400 hover:underline">
                                    <a href={`/profiles/${profile.id}`}>
                                        {profile.first_name} {profile.last_name}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{profile.user.email}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{profile.user.role.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full
                    ${profile.user.is_planner
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}>
                                        {profile.user.is_planner ? "Oui" : "Non"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    {new Date(profile.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{profile.user.phone_number}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => {
                                            setSelectedProfile(profile);
                                            setIsRoleOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden p-4 space-y-4">
                {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 space-y-2">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {profile.first_name} {profile.last_name}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Email :</strong> {profile.user.email}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Rôle :</strong> {profile.user.role.role}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Organisateur :</strong>{" "}
                            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full
                ${profile.user.is_planner
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}>
                                {profile.user.is_planner ? "Oui" : "Non"}
                            </span>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Créé le :</strong> {new Date(profile.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Téléphone :</strong> {profile.user.phone_number}
                        </div>
                        <button
                            onClick={() => {
                                setSelectedProfile(profile);
                                setIsRoleOpen(true);
                            }}
                            className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                            Modifier le rôle
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page: number) => { handlePageChange(page) }}
            />

            {/* Modales */}
            <ProfilesFiltersModal
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                onApply={handleApplyFilters}
                initialFilters={filters}
            />
            <RoleModal
                isOpen={isRoleOpen}
                onClose={() => setIsRoleOpen(false)}
                profile={selectedProfile}
                onSuccess={() => router.refresh()}
            />
        </>
    );

};
