"use server";

import { fetchApi } from "@/app/fetcher_api";

interface CreateEventProp {
  titre: string;
  description: string;
  date: string;
  cloture_billets: string;
  types: number[];
  country: string;
  city: string;
  zipcode: string;
  number: string;
  street: string;
  price: number;
  nb_places: number;
  photos: string[];
}
export async function createEvent(
  {
    titre,
    description,
    date,
    cloture_billets,
    types,
    country,
    city,
    zipcode,
    number,
    street,
    price,
    nb_places,
    photos,
  }: CreateEventProp) {
  try {

    const new_event = {
      title: titre,
      description: description,
      nb_places: nb_places,
      price: price,
      date: date,
      cloture_billets: cloture_billets,
      types: {
        types: types
      },
      address: {
        city: city,
        zipcode: zipcode,
        number: number,
        street: street,
        country: country
      },
      pictures: photos.map((photo) => ({ photo }))
    };


    const res = await fetchApi("/events", "POST", JSON.stringify(new_event));
    return res;
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
}
