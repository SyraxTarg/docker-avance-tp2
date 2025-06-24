
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function updatePassword(token: string, new_password: string, confirm_password: string) {
    return await fetchApi(`/authent/reset-pwd`, "POST", JSON.stringify(
        {
            token: token,
            new_password: new_password,
            confirm_password: confirm_password
        }
    ));
}
