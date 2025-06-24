
"use server";


import { fetchApi } from "@/app/fetcher_api";
import { revalidatePath } from "next/cache";
export async function updateProfile(first_name: string, last_name: string, phone_number: string, photo: string) {
    const data = {
        "first_name": first_name,
        "last_name": last_name,
        "phone_number": phone_number,
        "photo": photo
    };

    await fetchApi("/profiles", "PATCH", JSON.stringify(data));
    revalidatePath("/profiles/me_copy");
}
