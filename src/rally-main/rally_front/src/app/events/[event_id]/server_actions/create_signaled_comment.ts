
"use server";

import { fetchApi } from "@/app/fetcher_api";
export async function createSignaledComment(reason_id: number, comment_id: number) {
    await fetchApi(`/signaledComments`, "POST", JSON.stringify({
        reason_id: reason_id,
        comment_id: comment_id
    }));
}
