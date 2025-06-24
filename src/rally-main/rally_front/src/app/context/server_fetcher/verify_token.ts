"use server";
import { verifyTokenApi, refreshTokenApi } from "@/app/fetcher_api";
import { cookies } from "next/headers";

export async function verifyToken() {
    let res = await verifyTokenApi();

    if (res?.status === 401) {
        const refreshData = await refreshTokenApi();

        if (refreshData?.access_token) {

            const cookieStore = await cookies();

            cookieStore.set("user_access_token", refreshData.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60,
            });

            res = await verifyTokenApi();
        }
    }

    return res;
}
