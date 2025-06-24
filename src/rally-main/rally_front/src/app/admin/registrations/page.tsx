import { fetchRegistrationsApi } from "@/app/fetcher_api";
import AdminRegistrations from "@/app/components/admin/registrations/registrations_table";

interface Props {
    searchParams: Promise<{
        date?: string;
        email?: string;
        event_email?: string;
        payment_status?: string;
        currentPage?: string;
    }>;
}

export default async function Inscriptions({ searchParams }: Props) {
    const limit = 1;
    const {
        date,
        email,
        event_email,
        payment_status,
        currentPage = '1'
    } = await searchParams;

    const inscriptionFilters = {
        date,
        email,
        event_email,
        payment_status
    }


    const page = Number(currentPage);
    const offset = (page - 1) * limit;

    const data = await fetchRegistrationsApi(limit, offset, inscriptionFilters);
    const registrations = data.data;
    const total = data.total;
    const totalPages = Math.ceil(total / limit);
    return (
        <>
            <AdminRegistrations
                registrations={registrations}
                currentPage={page}
                totalPages={totalPages}
                filters={inscriptionFilters}
            />
        </>
    )
}