
"use server";


import { fetchApi } from "@/app/fetcher_api";
export async function deleteEvent(event_id: number) {
    await fetchApi(`/events/${event_id}`, "DELETE");
}
