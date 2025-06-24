
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function createSignaledEvent(reason_id: number, event_id: number) {
    await fetchApi(`/signaledEvents`, "POST", JSON.stringify({
        reason_id: reason_id,
        event_id: event_id
    }));
}
