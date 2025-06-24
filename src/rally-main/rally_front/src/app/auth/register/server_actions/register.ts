
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function registerUser(body: string) {
    return await fetchApi(`/authent/register/user`, "POST", body);
}
