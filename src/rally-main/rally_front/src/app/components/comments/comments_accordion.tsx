"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import CommentCard from "@/app/components/comments/CommentCard";
import CommentForm from "@/app/components/comments/CommentForm";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteComment } from "@/app/events/[event_id]/server_actions/delete_comment";
import Pagination from "../pagination";

interface Comment {
    id: number;
    profile: {
        id: number;
        first_name: string;
        last_name: string;
        photo: string;
        nb_like: number;
        email: string;
        created_at: string;
    };
    event_id: number;
    content: string;
    created_at: string;
}

interface Reason {
    id: number;
    reason: string;
}

type User = {
    id: number;
    first_name: string;
    last_name: string;
    photo: string;
    nb_like: number;
    user: {
      id: number;
      email: string;
      is_planner: boolean;
      account_id: string | null;
    };
    created_at: Date;
    updated_at: Date;
  };

interface Props {
    comments: Comment[];
    commentCount: number;
    user?: User;
    event_id: number;
    commentsCurrentPage: number;
    totalCommentsPages: number;
    reasons: Reason[];
}

export default function EventCommentsAccordion({
    comments,
    commentCount,
    user,
    event_id,
    commentsCurrentPage,
    totalCommentsPages,
    reasons
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleDeleteComment = async (comment_id: number) => {
        await deleteComment(comment_id, event_id);
        router.push(`/events/${event_id}`);
    };

    const handlePagination = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("commentCurrentPage", page.toString());

        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow space-y-6">
                {commentCount > 0 ? (
                    <Accordion className="border-t border-gray-200 divide-y divide-gray-200">
                        <AccordionItem
                            key="1"
                            aria-label="Commentaires"
                            title={
                                <div className="text-[#0F172A] font-semibold text-lg">
                                    {commentCount} commentaire{commentCount > 1 ? "s" : ""}
                                </div>
                            }
                            className="p-0"
                        >
                            <div className="space-y-4 p-4">
                                {comments.map((comment) => (
                                    <CommentCard
                                        key={comment.id}
                                        comment_id={comment.id}
                                        profile={comment.profile}
                                        content={comment.content}
                                        created_at={comment.created_at}
                                        user_id={user?.id ?? undefined}
                                        by_user_id={comment.profile.id}
                                        onDeleteComment={handleDeleteComment}
                                        reasons={reasons}
                                    />
                                ))}
                            </div>
                        </AccordionItem>
                    </Accordion>
                ) : (
                    <p className="text-gray-500">Pas de commentaires</p>
                )}

                {/* Pagination */}
                {commentCount > 0 && (
                    <div className="col-span-full flex justify-center mt-8">
                        <Pagination
                            currentPage={commentsCurrentPage}
                            totalPages={totalCommentsPages}
                            onPageChange={(page) => handlePagination(page)}
                        />
                    </div>
                )}

                {!!user ? (
                    <CommentForm event_id={event_id} />
                ) : (
                    <div className="flex flex-col items-center justify-center mt-4 text-center">
                        <p className="text-gray-700 text-base mb-3">
                            Pour laisser un commentaire, veuillez vous connecter.
                        </p>
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="px-6 py-2 bg-[#4338CA] text-black rounded-full hover:bg-[#6366F1] transition"
                        >
                            Se connecter
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
