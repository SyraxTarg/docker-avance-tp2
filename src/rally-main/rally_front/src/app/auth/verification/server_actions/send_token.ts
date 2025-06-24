
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function sendToken(email: string) {
    return await fetchApi(`/authent/send-token?user_email=${email}`, "POST");
}
