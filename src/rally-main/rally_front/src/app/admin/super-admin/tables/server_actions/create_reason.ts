
"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/app/fetcher_api";
export async function createReason(reason: string) {
    await fetchApi(`/super-admin/reasons`, "POST", JSON.stringify({
        reason: reason,
    }));
    revalidatePath(`/admin/super-admin/tables`);
}
