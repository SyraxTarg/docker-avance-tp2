'use client';

import { deleteReportComment } from "./delete_comment_report";
import { useDisclosure } from "@heroui/modal";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/app/components/pagination";
import SignalementCommentFiltersModal from "./filter_signaled_comment_modal";

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    photo: string;
    nb_like: number;
    email: string;
    created_at: string;
}

interface CommentData {
    id: number;
    profile: Profile;
    event_id: number;
    content: string;
    created_at: string;
}

interface Reason {
    id: number;
    reason: string;
}

interface ReportedComment {
    id: number;
    comment: CommentData;
    reason: Reason;
    user_id: number;
    created_at: string;
}


type Filters = {
    commentDate?: string;
    comment_signaled_by_user?: string;
    email_comment_signaled?: string;
    comment_reason_id?: number;
};

interface Props {
    comments: ReportedComment[],
    filters: Filters;
    currentPageComment: number;
    totalPagesComments: number
    reasons: Reason[];
}

export default function ReportedCommentsTable({
    comments,
    filters,
    currentPageComment,
    totalPagesComments,
    reasons
}: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleApplyFilters = (filters: Filters) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filters.commentDate) {
            params.set("commentDate", filters.commentDate.toString());
        } else {
            params.delete("commentDate");
        }

        if (filters.comment_signaled_by_user) {
            params.set("comment_signaled_by_user", filters.comment_signaled_by_user.toString());
        } else {
            params.delete("comment_signaled_by_user");
        }

        if (filters.email_comment_signaled) {
            params.set("email_comment_signaled", filters.email_comment_signaled.toString());
        } else {
            params.delete("email_comment_signaled");
        }

        if (filters.comment_reason_id) {
            params.set("comment_reason_id", filters.comment_reason_id.toString());
        } else {
            params.delete("comment_reason_id");
        }

        router.push(`/admin/signalements?${params.toString()}`, { scroll: false });
    };


    const handlePagination = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("commentCurrentPage", page.toString());

        router.push(`/admin/signalements?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="p-4 max-w-screen-xl mx-auto">
            <h2>Commentaires signalés</h2>
            <div className="mb-6 text-right">
                <button
                    onClick={onOpen}
                    className="px-5 py-2 bg-[#4338CA] hover:bg-[#6366F1] text-white text-sm font-medium rounded-lg transition shadow cursor-pointer"
                >
                    Filtres
                </button>
            </div>

            {/* Table desktop */}
            <div className="hidden sm:block rounded-xl shadow overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Commentaire</th>
                                <th className="px-6 py-3">Auteur</th>
                                <th className="px-6 py-3">Raison</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {comments.map((comment) => (
                                <tr key={comment.id} className="border-t hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{comment.id}</td>
                                    <td className="px-6 py-4">{comment.comment.content}</td>
                                    <td className="px-6 py-4">{comment.comment.profile.email}</td>
                                    <td className="px-6 py-4">{comment.reason.reason}</td>
                                    <td className="px-6 py-4">
                                        {new Date(comment.created_at).toLocaleString('fr-FR')}
                                    </td>
                                    <td className="flex gap-2 px-6 py-4">
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                                            onClick={() => {
                                                if (confirm("Supprimer ce commentaire ?")) {
                                                    deleteReportComment(comment.id, true);
                                                }
                                            }}
                                        >
                                            Supprimer le commentaire
                                        </button>
                                        <button
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                                            onClick={() => {
                                                if (confirm("Supprimer ce signalement ?")) {
                                                    deleteReportComment(comment.id, false);
                                                }
                                            }}
                                        >
                                            Rejeter signalement
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cartes mobile */}
            <div className="sm:hidden space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-xl shadow p-4 space-y-2">
                        <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                            <span>ID: {comment.id}</span>
                        </div>
                        <div className="text-gray-800 text-sm">
                            <strong>Commentaire:</strong>
                            <p className="mt-1">{comment.comment.content}</p>
                        </div>
                        <div className="text-sm text-gray-700">
                            <strong>Auteur:</strong> {comment.comment.profile.email}
                        </div>
                        <div className="text-sm text-gray-700">
                            <strong>Raison:</strong> {comment.reason.reason}
                        </div>
                        <div className="text-sm text-gray-700">
                            <strong>Date:</strong> {new Date(comment.created_at).toLocaleString('fr-FR')}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                                onClick={() => {
                                    if (confirm("Supprimer ce commentaire ?")) {
                                        deleteReportComment(comment.id, true);
                                    }
                                }}
                            >
                                Supprimer
                            </button>
                            <button
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                                onClick={() => {
                                    if (confirm("Supprimer ce signalement ?")) {
                                        deleteReportComment(comment.id, false);
                                    }
                                }}
                            >
                                Rejeter
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPagesComments > 0 && (
                <div className="col-span-full flex justify-center mt-8">
                    <Pagination
                        currentPage={currentPageComment}
                        totalPages={totalPagesComments}
                        onPageChange={(page) => handlePagination(page)}
                    />
                </div>
            )}

            <SignalementCommentFiltersModal
                isOpen={isOpen}
                initialFilters={filters}
                onApply={handleApplyFilters}
                onClose={onClose}
                reasons={reasons}
            />
        </div>
    );
}
