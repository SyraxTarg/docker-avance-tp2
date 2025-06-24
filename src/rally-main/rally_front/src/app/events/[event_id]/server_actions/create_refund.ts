
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function createRefund(event_id: number) {
    return await fetchApi(`/payments/refund`, "POST", JSON.stringify({ event_id: event_id }));
}
