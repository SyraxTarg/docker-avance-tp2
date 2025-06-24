
"use server";


import { fetchApi } from "@/app/fetcher_api";
import { revalidatePath } from "next/cache";
export async function deleteReport(report_id: number, ban: boolean) {


    await fetchApi(`/signaledEvents/${report_id}?ban=${ban}`, "DELETE");
    revalidatePath("/admin/signalements");
}
