"use client";

import Pagination from "@/app/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";

export interface BannedUser {
    id: number;
    banned_email: string;
    banned_by_email: string;
    banned_at: string;
}

interface BannedUsersPageProps {
    bannedUsers: BannedUser[];
    currentPage: number;
    totalPages: number;
}

export default function BannedUsersTable({
    bannedUsers,
    currentPage,
    totalPages,
}: BannedUsersPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("currentPage", page.toString());
        router.push(`/admin/super-admin/banned-users?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Utilisateurs bannis</h1>
            </div>

            {/* Table (desktop) */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Email banni</th>
                            <th className="px-4 py-3">Banni par</th>
                            <th className="px-4 py-3">Date du bannissement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {bannedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3">{user.id}</td>
                                <td className="px-4 py-3">{user.banned_email}</td>
                                <td className="px-4 py-3">{user.banned_by_email}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {new Date(user.banned_at).toLocaleString("fr-FR", {
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
                {bannedUsers.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-sm text-gray-700"
                    >
                        <div><strong>ID:</strong> {user.id}</div>
                        <div><strong>Email banni:</strong> {user.banned_email}</div>
                        <div><strong>Banni par:</strong> {user.banned_by_email}</div>
                        <div>
                            <strong>Date:</strong>{" "}
                            {new Date(user.banned_at).toLocaleString("fr-FR", {
                                dateStyle: "short",
                                timeStyle: "short",
                            })}
                        </div>
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
    );
}
