"use client";
import Pagination from "@/app/components/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import CommentFiltersModal from "./filter_comments_modal";
import { useDisclosure } from "@heroui/modal";


type Comment = {
    id: number;
    content: string;
    created_at: string;
    event_id: number;
    event_email: string;
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

type Filters = {
    search?: string;
    date?: string;
    email?: string;
    event_email?: string;
}

type Props = {
    comments: Comment[];
    currentPage: number;
    totalPages: number;
    filters: Filters;
};

export default function AdminComments({ comments, currentPage, totalPages, filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("currentPage", page.toString());
        router.push(`/admin/comments?${params.toString()}`);
    };

    const handleApplyFilters = (filters: Filters) => {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.date) params.set("date", filters.date);
        if (filters.email) params.set("email", filters.email);
        if (filters.event_email) params.set("event_email", filters.event_email);
        params.set("currentPage", "1");
        router.push(`/admin/comments?${params.toString()}`);
    };

    return (
        <>
            {/* Header + Filters Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl sm:text-3xl font-extrabold max-w-[70%] sm:max-w-full text-gray-900 dark:text-white">
                    Liste des Commentaires
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
                            {["ID", "Auteur", "Email", "Commentaire", "Événement", "Date"].map((header) => (
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
                        {comments.map((comment) => (
                            <tr key={comment.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{comment.id}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                    {comment.profile.first_name} {comment.profile.last_name}
                                </td>
                                <td className="px-6 py-4 text-blue-600 dark:text-blue-400 hover:underline">
                                    <a href={`mailto:${comment.profile.email}`}>{comment.profile.email}</a>
                                </td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{comment.content}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{comment.event_id}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden p-4 space-y-4">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 space-y-2"
                    >
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>ID :</strong> {comment.id}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Auteur :</strong> {comment.profile.first_name} {comment.profile.last_name}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Email :</strong> <a href={`mailto:${comment.profile.email}`} className="text-blue-600 dark:text-blue-400 underline">{comment.profile.email}</a>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Commentaire :</strong>
                            <p className="mt-1 text-gray-800 dark:text-gray-200">{comment.content}</p>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Événement :</strong> {comment.event_id}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Date :</strong> {new Date(comment.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}

            {/* Modal de Filtres */}
            <CommentFiltersModal
                isOpen={isOpen}
                initialFilters={filters}
                onApply={handleApplyFilters}
                onClose={onClose}
            />
        </>
    );
}
