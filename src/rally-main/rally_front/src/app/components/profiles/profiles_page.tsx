"use client";
import Pagination from "@/app/components/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileCard from "./profile_card";
import SearchBar from "./search_profiles";

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    photo: string;
    nb_like: number;
    created_at: string;
}

type Filters = {
    search: string;
};

type Props = {
    profiles: Profile[];
    currentPage: number;
    totalPages: number;
};

export default function PlannersPage({
    profiles,
    currentPage,
    totalPages,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("currentPage", page.toString());
        router.push(`/profiles?${params.toString()}`, { scroll: false });
    };

    const handleApplyFilters = (filters: Filters) => {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        params.set("currentPage", "1");
        router.push(`/profiles?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-12">
            {/* Header */}
            <div className="w-full max-w-4xl text-center space-y-2">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    Organisateurs
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base">
                    Découvrez les profils des organisateurs d&apos;événements.
                </p>
            </div>

            {/* Barre de recherche */}
            <div className="w-full max-w-2xl">
                <SearchBar onSearch={handleApplyFilters} />
            </div>

            {/* Cartes des profils */}
            <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {profiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="w-full flex justify-center pt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
