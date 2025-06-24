export const dynamic = "force-dynamic";
import EventsFeed from "../components/events/events_feed";
import { fetchEventsApi, fetchTypesApi, fetchMeApi } from "../fetcher_api";


interface Props {
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

export default async function Events({ searchParams }: Props) {

  const limit = 4;
  const user = await fetchMeApi();

  const {
    date_avant,
    date_apres,
    country,
    city,
    popularity,
    recent,
    search,
    currentPage = '1',
    type_ids: rawTypeIds,
    price
  } = await searchParams;

  const type_ids = (Array.isArray(rawTypeIds) ? rawTypeIds : rawTypeIds ? [rawTypeIds] : [])
    .map((val) => parseInt(val, 10))
    .filter((id) => !isNaN(id));

  const filters = {
    date_avant,
    date_apres,
    type_ids,
    country,
    city,
    popularity: popularity === "true" ? true : popularity === "false" ? false : false,
    recent: recent === "true" ? true : recent === "false" ? false : false,
    search,
    price: Number(price),
  };


  const page = Number(currentPage);
  const offset = (page - 1) * limit;

  const typesData = await fetchTypesApi();
  const types = typesData.data;

  const data = await fetchEventsApi(offset, limit, filters);
  const events = data.data;
  const total = data.total;
  const totalPages = Math.ceil(total / limit);
  return (
    <EventsFeed
      events={events}
      eventTypes={types}
      user={user}
      currentPage={page}
      totalPages={totalPages}
      totalResults={total}
      countResults={data.count}
      filters={filters}
    />
  );
}
