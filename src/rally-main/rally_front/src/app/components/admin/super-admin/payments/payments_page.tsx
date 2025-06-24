"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDisclosure } from "@heroui/modal";
import PaymentFiltersModal from "@/app/components/admin/super-admin/payments/filters_modal";
import Pagination from "@/app/components/pagination";

export interface Payment {
    id: number;
    event_id: number;
    event_title: string;
    buyer_id: number;
    buyer_email: string;
    organizer_id: number;
    organizer_email: string;
    amount: number;
    fee: number;
    brut_amount: number;
    stripe_session_id: string;
    stripe_payment_intent_id: string;
    status: "success" | "failed" | "pending" | string;
    created_at: string;
}

export interface PaymentFilters {
    buyer_email?: string;
    organizer_email?: string;
    status?: string;
    date_apres?: string;
    date_avant?: string;
    brut_amount_min?: number;
    brut_amount_max?: number;
}

export interface PaymentsBackOfficeProps {
    payments: Payment[];
    currentPage: number;
    totalPages: number;
    filters: PaymentFilters;
}


export default function PaymentsBackOffice({ payments, currentPage, filters, totalPages }: PaymentsBackOfficeProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("curentPage", page.toString());
        router.push(`/admin/super-admin/payments?${params.toString()}`, { scroll: false });
    };

    const handleApplyFilters = (newFilters: PaymentFilters) => {
        const params = new URLSearchParams();

        if (newFilters.buyer_email) params.set("buyer_email", newFilters.buyer_email.toString());
        if (newFilters.organizer_email) params.set("organizer_email", newFilters.organizer_email.toString());
        if (newFilters.status) params.set("status", newFilters.status.toString());
        if (newFilters.date_apres) params.set("date_apres", newFilters.date_apres.toString());
        if (newFilters.date_avant) params.set("date_avant", newFilters.date_avant.toString());
        if (newFilters.brut_amount_min) params.set("brut_amount_min", newFilters.brut_amount_min.toString());
        if (newFilters.brut_amount_max) params.set("brut_amount_max", newFilters.brut_amount_max.toString());

        params.set("curentPage", "1");
        router.push(`/admin/super-admin/payments?${params.toString()}`);
    };

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Liste des paiements</h1>
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

                {/* Table on Desktop */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">Événement</th>
                                <th className="px-4 py-2 text-left">Acheteur</th>
                                <th className="px-4 py-2 text-left">Organisateur</th>
                                <th className="px-4 py-2 text-left">Montant</th>
                                <th className="px-4 py-2 text-left">Frais</th>
                                <th className="px-4 py-2 text-left">Brut</th>
                                <th className="px-4 py-2 text-left">Statut</th>
                                <th className="px-4 py-2 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-4 py-3">{payment.id}</td>
                                    <td className="px-4 py-3">{payment.event_title}</td>
                                    <td className="px-4 py-3">{payment.buyer_email}</td>
                                    <td className="px-4 py-3">{payment.organizer_email}</td>
                                    <td className="px-4 py-3">{payment.amount.toFixed(2)} €</td>
                                    <td className="px-4 py-3">{payment.fee.toFixed(2)} €</td>
                                    <td className="px-4 py-3">{payment.brut_amount.toFixed(2)} €</td>
                                    <td className="px-4 py-3">{payment.status}</td>
                                    <td className="px-4 py-3">{new Date(payment.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-4 md:hidden">
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="bg-white dark:bg-gray-900 shadow rounded-md p-4 space-y-1 text-sm text-gray-700 dark:text-gray-300"
                        >
                            <div><strong>ID:</strong> {payment.id}</div>
                            <div><strong>Événement:</strong> {payment.event_title}</div>
                            <div><strong>Acheteur:</strong> {payment.buyer_email}</div>
                            <div><strong>Organisateur:</strong> {payment.organizer_email}</div>
                            <div><strong>Montant:</strong> {payment.amount.toFixed(2)} €</div>
                            <div><strong>Frais:</strong> {payment.fee.toFixed(2)} €</div>
                            <div><strong>Brut:</strong> {payment.brut_amount.toFixed(2)} €</div>
                            <div><strong>Statut:</strong> {payment.status}</div>
                            <div><strong>Date:</strong> {new Date(payment.created_at).toLocaleDateString()}</div>
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

            {/* Modal de filtres */}
            <PaymentFiltersModal
                isOpen={isOpen}
                onClose={onClose}
                onApply={handleApplyFilters}
                initialFilters={filters}
            />
        </>
    );
}
