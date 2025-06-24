"use client";

import LogsFiltersModal from "@/app/components/admin/super-admin/action-logs/filters_modal";
import Pagination from "@/app/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useDisclosure } from "@heroui/modal";

export interface Role {
    id: number;
    role: string;
}

type User = {
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

interface Log {
    id: number;
    logLevel: "info" | "warning" | "error" | "critical";
    user?: User;
    actionType: string;
    description: string;
    date: string;
}

interface Filters {
    date?: string;
    action_type?: string;
    log_type?: string;
}

interface LogsPageProps {
    logs: Log[];
    currentPage: number;
    totalPages: number;
    filters: Filters;
}

export default function LogsPage({ logs, currentPage, totalPages, filters }: LogsPageProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("curentPage", page.toString());
        router.push(`/admin/super-admin/action-logs?${params.toString()}`, { scroll: false });
    };

    const handleApplyFilters = (filters: Filters) => {
        const params = new URLSearchParams();
        if (filters.date) params.set("date", filters.date);
        if (filters.action_type) params.set("action_type", filters.action_type);
        if (filters.log_type) params.set("log_type", filters.log_type);
        params.set("currentPage", "1");
        router.push(`/admin/super-admin/action-logs?${params.toString()}`);
    };


    return (
        <>
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Journal des actions</h1>
                    <button
                        onClick={onOpen}
                        className="inline-flex items-center gap-2 bg-[#4338CA] hover:bg-[#6366F1] focus:ring-4 focus:ring-[#6366F1] text-white font-semibold px-5 py-2 rounded-md shadow transition cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Filtres
                    </button>
                </div>

                {/* Table (desktop) */}
                <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Email utilisateur</th>
                                <th className="px-4 py-3">Rôle</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">{log.id}</td>
                                    <td className="px-4 py-3">{(log.logLevel).toUpperCase()}</td>
                                    <td className="px-4 py-3">{log.user?.email || "—"}</td>
                                    <td className="px-4 py-3">{log.user?.role?.role || "—"}</td>
                                    <td className="px-4 py-3 capitalize">{log.actionType}</td>
                                    <td className="px-4 py-3">{log.description}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {new Date(log.date).toLocaleString("fr-FR", {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Cards (mobile) */}
                <div className="md:hidden space-y-4">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-sm text-gray-700"
                        >
                            <div><strong>ID:</strong> {log.id}</div>
                            <div><strong>Email:</strong> {log.user?.email || "—"}</div>
                            <div><strong>Téléphone:</strong> {log.user?.phone_number || "—"}</div>
                            <div><strong>Rôle:</strong> {log.user?.role?.role || "—"}</div>
                            <div><strong>Action:</strong> {log.actionType}</div>
                            <div><strong>Description:</strong> {log.description}</div>
                            <div><strong>Date:</strong> {new Date(log.date).toLocaleString("fr-FR", {
                                dateStyle: "short",
                                timeStyle: "short",
                            })}</div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modal */}
            <LogsFiltersModal
                isOpen={isOpen}
                onClose={onClose}
                onApply={handleApplyFilters}
                initialFilters={filters}
            />
        </>
    );
}
