
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function createFreeRegistration(event_id: number) {
    return await fetchApi(`/registrations`, "POST", JSON.stringify({
        event_id: event_id,
    }));
}
