
"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/app/fetcher_api";
export async function createLike(event_id: number) {
    await fetchApi(`/likes/${event_id}`, "POST");
    revalidatePath(`/events/${event_id}`);
}
