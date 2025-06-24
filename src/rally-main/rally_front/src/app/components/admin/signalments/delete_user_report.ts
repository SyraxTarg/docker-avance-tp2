
"use server";


import { fetchApi } from "@/app/fetcher_api";
import { revalidatePath } from "next/cache";
export async function deleteReportUser(report_id: number, ban: boolean) {
    await fetchApi(`/signaledUsers/${report_id}?ban=${ban}`, "DELETE");
    revalidatePath("/admin/signalements");
}
