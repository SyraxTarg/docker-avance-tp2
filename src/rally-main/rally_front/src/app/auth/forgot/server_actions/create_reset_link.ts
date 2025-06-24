
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function createResetLink(email: string) {
    await fetchApi(`/authent/generate-reset?user_email=${email}`, "POST");
}
