"use server";

import { cookies } from "next/headers";
import { fetchApi } from "@/app/fetcher_api";

export async function login(body: { email: string, password: string, remember_me: boolean }) {
  const data = await fetchApi(`/authent/login`, "POST", JSON.stringify(body));

  const cookieStore = await cookies();

  const maxAgeAccess = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || "15") * 60;
  const maxAgeRefresh = body.remember_me
    ? 60 * 60 * 24 * 30
    : 60 * 60 * 24 * 7;

  cookieStore.set("user_access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeAccess,
  });

  cookieStore.set("user_refresh_token", data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeRefresh,
  });

  return data;
}
