
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function createRegistration(event_id: number) {
    return await fetchApi(`/payments/checkout?event_id=${event_id}`, "POST");
}
