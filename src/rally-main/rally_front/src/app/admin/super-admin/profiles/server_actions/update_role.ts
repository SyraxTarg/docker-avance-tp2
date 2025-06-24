
"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/app/fetcher_api";
export async function updateRole(role: string, user_id: number) {
    await fetchApi(`/super-admin/user/${user_id}?role=${role}`, "POST");
    revalidatePath(`/admin/super-admin/profiles`);
}
