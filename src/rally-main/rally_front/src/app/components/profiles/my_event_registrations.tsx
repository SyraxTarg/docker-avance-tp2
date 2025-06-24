"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import Pagination from "../pagination";
import { useRouter, useSearchParams } from "next/navigation";
import RegistrationCard from "../registrations/registration_card";

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    photo: string;
    nb_like: number;
    email: string;
    created_at: string;
}

type Registration = {
    id: number;
    event_id: number;
    event_title: string;
    registered_at: string;
    payment_status: string;
    profile?: Profile;
};

interface Props {
    registrations: Registration[];
    totalPages: number;
    currentPage: number;
}

export default function MyEventsRegistrations({
    registrations,
    totalPages,
    currentPage,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePagination = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("myERCurrentPage", page.toString());

        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <Accordion className="border-t border-gray-200 divide-y divide-gray-200 dark:divide-gray-700 dark:border-gray-700">
            <AccordionItem
                key="1"
                aria-label="Inscriptions"
                title={
                    <div className="text-[#0F172A] dark:text-white font-semibold text-lg">
                        Inscriptions
                    </div>
                }
                className="p-0"
            >
                <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 w-full mt-6">
                    {registrations.map((registration) => (
                        <RegistrationCard
                            registration={registration}
                            key={registration.id}
                        />
                    ))}
                    {totalPages > 1 && (
                        <div className="col-span-full flex justify-center mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => { handlePagination(page) }}
                            />
                        </div>
                    )}
                </div>
            </AccordionItem>
        </Accordion>
    );
}
