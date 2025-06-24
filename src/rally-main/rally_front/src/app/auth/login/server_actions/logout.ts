"use server";
import { cookies } from 'next/headers';
import { fetchApi } from "@/app/fetcher_api";

export async function logout() {
  await fetchApi(`/authent/logout`, "POST");

  const cookieStore = await cookies();
  cookieStore.delete('user_access_token');
  cookieStore.delete('user_refresh_token');
  cookieStore.delete('user_connected_id');
}
