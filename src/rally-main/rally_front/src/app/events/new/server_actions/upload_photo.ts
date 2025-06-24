"use server";
import { uploadPictureApi } from "@/app/fetcher_api";

export async function uploadPhoto(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await uploadPictureApi(formData);
  if (!res || !res.url) {
    console.warn("Échec de l'upload ou URL manquante dans la réponse.");
    return null;
  }

  return res.url;
}
