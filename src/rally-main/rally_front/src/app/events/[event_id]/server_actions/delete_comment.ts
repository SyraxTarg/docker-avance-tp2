
"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/app/fetcher_api";
export async function deleteComment(comment_id: number, event_id: number) {
    await fetchApi(`/comments/${comment_id}`, "DELETE");
    revalidatePath(`/events/${event_id}`);
}
