"use server";

import { cookies } from "next/headers";
import { refreshTokenApi } from "@/app/fetcher_api";

export async function refresh() {
  const data = await refreshTokenApi();

  if (!data || !data.access_token) {
    console.error("Échec du refresh : access_token manquant");
    return null;
  }

  const cookieStore = await cookies();

  const maxAgeAccess = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || "15") * 60;

  cookieStore.set("user_access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeAccess,
  });

  return data;
}
