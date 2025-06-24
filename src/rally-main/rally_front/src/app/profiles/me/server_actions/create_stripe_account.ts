
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function createStripeAccount() {
    return await fetchApi(`/payments/create-account`, "POST");
}
