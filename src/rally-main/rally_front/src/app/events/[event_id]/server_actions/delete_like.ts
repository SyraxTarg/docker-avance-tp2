
"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/app/fetcher_api";
export async function deleteLike(event_id: number) {
    await fetchApi(`/likes/${event_id}`, "DELETE");
    revalidatePath(`/events/${event_id}`);
}
