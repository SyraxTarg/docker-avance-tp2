import ReportedUsersTable from "@/app/components/admin/signalments/user_signaled";
import ReportedEventsTable from "@/app/components/admin/signalments/event_signaled";
import ReportedCommentsTable from "@/app/components/admin/signalments/comment_signaled";
import {
    fetchSignaledCommentsApi,
    fetchSignaledUsers,
    fetchSignaledEventsApi,
    fetchReasonsApi
} from "@/app/fetcher_api";
import { User, Calendar, MessageCircle } from "lucide-react";

interface SignalmentsProps {
    searchParams: Promise<{
        commentDate?: string;
        comment_signaled_by_user?: string;
        email_comment_signaled?: string;
        comment_reason_id?: string;
        commentCurrentPage?: string;
        userDate?: string;
        user_signaled_by_user?: string;
        user_user_signaled?: string;
        user_reason_id?: string;
        userCurrentPage?: string;
        eventDate?: string;
        event_signaled_by_user?: string;
        event_email_user?: string;
        event_reason_id?: string;
        eventCurrentPage?: string;
    }>;
}

export default async function Signalments({ searchParams }: SignalmentsProps) {
    const limit = 1;

    const {
        commentDate,
        comment_signaled_by_user,
        email_comment_signaled,
        comment_reason_id,
        commentCurrentPage = "1",
        userDate,
        user_signaled_by_user,
        user_user_signaled,
        user_reason_id,
        userCurrentPage = "1",
        eventDate,
        event_signaled_by_user,
        event_email_user,
        event_reason_id,
        eventCurrentPage = "1",
    } = await searchParams;

    const commentReasonIdNumber = comment_reason_id ? Number(comment_reason_id) : undefined;
    const userReasonIdNumber = user_reason_id ? Number(user_reason_id) : undefined;
    const eventReasonIdNumber = event_reason_id ? Number(event_reason_id) : undefined;

    const commentFilters = {
        commentDate,
        comment_signaled_by_user,
        email_comment_signaled,
        comment_reason_id: commentReasonIdNumber,
    };

    const userFilters = {
        userDate,
        user_signaled_by_user,
        user_user_signaled,
        user_reason_id: userReasonIdNumber,
    };

    const eventFilters = {
        eventDate,
        event_signaled_by_user,
        event_email_user,
        event_reason_id: eventReasonIdNumber,
    };

    const currentPageComments = Number(commentCurrentPage);
    const commentOffset = (currentPageComments - 1) * limit;

    const currentPageUsers = Number(userCurrentPage);
    const userOffset = (currentPageUsers - 1) * limit;

    const currentPageEvents = Number(eventCurrentPage);
    const eventOffset = (currentPageEvents - 1) * limit;

    const [reasonsData, data_comments, data_users, data_events] = await Promise.all([
        fetchReasonsApi(),
        fetchSignaledCommentsApi(commentOffset, limit, commentFilters),
        fetchSignaledUsers(userOffset, limit, userFilters),
        fetchSignaledEventsApi(eventOffset, limit, eventFilters),
    ]);

    const reasons = reasonsData.data;
    const comments = data_comments.data;
    const totalPagesComments = data_comments.total;

    const users = data_users.data;
    const totalPagesUsers = data_users.total;

    const events = data_events.data;
    const totalPagesEvents = data_events.total;

    return (
        <div className="p-6 space-y-10">
            {/* Utilisateurs signalés */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-6 h-6 text-[#4338CA]" />
                    <h2 className="text-2xl font-bold text-[#0F172A]">Utilisateurs signalés</h2>
                </div>
                <ReportedUsersTable
                    reports={users}
                    filters={userFilters}
                    currentPage={currentPageUsers}
                    totalPages={totalPagesUsers}
                    reasons={reasons}
                />
            </section>

            {/* Événements signalés */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-6 h-6 text-[#4338CA]" />
                    <h2 className="text-2xl font-bold text-[#0F172A]">Événements signalés</h2>
                </div>
                <ReportedEventsTable
                    reports={events}
                    filters={eventFilters}
                    currentPage={currentPageEvents}
                    totalPages={totalPagesEvents}
                    reasons={reasons}
                />
            </section>

            {/* Commentaires signalés */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-6 h-6 text-[#4338CA]" />
                    <h2 className="text-2xl font-bold text-[#0F172A]">Commentaires signalés</h2>
                </div>
                <ReportedCommentsTable
                    comments={comments}
                    filters={commentFilters}
                    currentPageComment={currentPageComments}
                    totalPagesComments={totalPagesComments}
                    reasons={reasons}
                />
            </section>
        </div>
    );
}
