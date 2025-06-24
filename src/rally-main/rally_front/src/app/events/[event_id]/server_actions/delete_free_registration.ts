
"use server";
import { revalidatePath } from "next/cache";
import { fetchApi } from "@/app/fetcher_api";
export async function deleteFreeRegistration(event_id: number, profile_id: number) {
    const response = await fetchApi(`/registrations?profile_id=${profile_id}&event_id=${event_id}`, "DELETE");
    await revalidatePath(`/events/${event_id}`)
    return response;
}
