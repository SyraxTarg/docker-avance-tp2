
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function verifyToken(email: string, token: string) {
    return await fetchApi(`/authent/verify-token?user_email=${email}&token=${token}`, "POST");
}
