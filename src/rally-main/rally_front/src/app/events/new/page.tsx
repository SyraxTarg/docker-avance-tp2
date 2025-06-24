export const dynamic = "force-dynamic";
import { fetchTypesApi } from "@/app/fetcher_api";
import NewEvent from "@/app/components/events/new_events_page";
import { fetchMe } from "@/app/context/server_fetcher/fetch_me";

export default async function NewEventPage() {
  const user = await fetchMe();

  const typesData = await fetchTypesApi();
  const types = typesData.data;

  return (
    <main className="pt-16">
      <NewEvent types={types} user={user} />
    </main>
  )
}
