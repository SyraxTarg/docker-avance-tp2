
"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/app/fetcher_api";
export async function createComment(content: string, event_id: number) {
    await fetchApi(`/comments`, "POST", JSON.stringify({
        event_id: event_id,
        content: content
    }));
    revalidatePath(`/events/${event_id}`);
}
