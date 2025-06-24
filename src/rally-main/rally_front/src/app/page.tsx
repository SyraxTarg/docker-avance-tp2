export const dynamic = "force-dynamic";
import Hero from "./components/hero";
import { fetchTypesApi, fetchEventsApi, fetchMeApi, fetchProfilesPlannerApi } from "./fetcher_api";

type Props = {
  searchParams: Promise<{
    typesCurrentPage: string;
  }>
}

export default async function HomePage({ searchParams }: Props) {
  const user = await fetchMeApi();
  const limit = 8;

  const {
    typesCurrentPage = '1',
  } = await searchParams;

  const curentPageTypes = Number(typesCurrentPage);
  const offsetTypes = (curentPageTypes - 1) * limit;
  const typesData = await fetchTypesApi(limit, offsetTypes);
  const types = typesData.data;
  const totalTypes = typesData.total;
  const totalTypesPages = Math.ceil(totalTypes / limit);

  const eventsRecentData = await fetchEventsApi(0, limit, { recent: true })
  const eventsRecent = eventsRecentData.data;

  const eventsPopulartData = await fetchEventsApi(0, limit, { popularity: true })
  const eventsPopular = eventsPopulartData.data;

  const plannersData = await fetchProfilesPlannerApi(limit, 0);
  const planners = plannersData.data;

  return (
    <main className="pt-16">
      <Hero
        types={types}
        totalTypePages={totalTypesPages}
        typeCurrentPage={curentPageTypes}
        eventsRecent={eventsRecent}
        user={user}
        eventsPopular={eventsPopular}
        planners={planners}
      />
    </main>
  );
}
