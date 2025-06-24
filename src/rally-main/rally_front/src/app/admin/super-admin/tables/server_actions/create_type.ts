
"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/app/fetcher_api";
export async function createtype(type: string) {
    await fetchApi(`/super-admin/types`, "POST", JSON.stringify({
        type: type,
    }));
    revalidatePath(`/admin/super-admin/tables`);
}
