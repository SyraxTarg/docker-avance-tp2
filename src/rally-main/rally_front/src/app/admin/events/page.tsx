import { fetchEventsApi, fetchTypesApi } from "@/app/fetcher_api";
import AdminEvents from "@/app/components/admin/events/events_table";

interface EventProps {
    searchParams: Promise<{
        date_avant?: string;
        date_apres?: string;
        country?: string;
        city?: string;
        popularity?: string;
        recent?: string;
        nb_places?: string;
        search?: string;
        currentPage?: string;
        type_ids?: string;
        price?: string;
    }>;
}

export default async function Events({ searchParams }: EventProps) {
    const limit = 1;

    const {
        date_avant,
        date_apres,
        country,
        city,
        popularity,
        recent,
        nb_places,
        search,
        currentPage = '1',
        type_ids: rawTypeIds,
        price
    } = await searchParams;

    const type_ids = Array.isArray(rawTypeIds)
        ? rawTypeIds.map(Number).filter((id) => !isNaN(id))
        : rawTypeIds
            ? [Number(rawTypeIds)].filter((id) => !isNaN(id))
            : [];

    const eventFilters = {
        date_avant,
        date_apres,
        type_ids,
        country,
        city,
        popularity: popularity === "true" ? true : popularity === "false" ? false : undefined,
        recent: recent === "true" ? true : recent === "false" ? false : undefined,
        nb_places: nb_places ? Number(nb_places) : undefined,
        search,
        price: Number(price)
    };

    const page = Number(currentPage);
    const offset = (page - 1) * limit;

    const typesData = await fetchTypesApi();
    const types = typesData.data;

    const data = await fetchEventsApi(offset, limit, eventFilters);
    const events = data.data;
    const total = data.total;
    const totalPages = Math.ceil(total / limit);

    return (
        <AdminEvents
            events={events}
            currentPage={page}
            totalPages={totalPages}
            filters={eventFilters}
            types={types}
        />
    );
}
