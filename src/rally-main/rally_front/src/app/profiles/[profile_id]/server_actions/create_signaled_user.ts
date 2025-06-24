
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function createSignaledUser(reason_id: number, user_id: number) {
    await fetchApi(`/signaledUsers/`, "POST", JSON.stringify({
        reason_id: reason_id,
        user_signaled_id: user_id
    }));
}
