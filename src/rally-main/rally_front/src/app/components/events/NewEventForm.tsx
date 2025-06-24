"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Select, SelectItem } from "@heroui/select";
import { createEvent } from "../../events/new/server_actions/create_new_event";
import { Textarea } from "@heroui/input";
import { uploadPhoto } from "@/app/events/new/server_actions/upload_photo";
import { toast } from "react-toastify";
import LoadingOverlay from "../loading_overlay";
import Image from "next/image";
import { z } from "zod";

const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Erreur: Le titre est requis")
    .max(100, "Erreur: Le titre est trop long"),

  description: z
    .string()
    .min(1, "Erreur: La description est requise")
    .max(1000, "Erreur: La description est trop longue"),

  places: z
    .number()
    .int("Erreur: Le nombre de places doit être un entier")
    .min(1, "Erreur: Le nombre de places doit être au moins 1"),

  price: z
    .number()
    .min(0, "Erreur: Le prix ne peut pas être négatif"),

  date: z
    .string()
    .refine(
      dateStr => !isNaN(Date.parse(dateStr)),
      { message: "Erreur: Date de l'événement invalide" }
    ),

  clotureBillets: z
    .string()
    .refine(
      dateStr => !isNaN(Date.parse(dateStr)),
      { message: "Erreur: Date de clôture invalide" }
    ),

  types: z
    .array(z.number())
    .nonempty("Erreur: Veuillez sélectionner au moins un type"),

  photos: z.array(z.any()),

  address: z.object({
    city: z
      .string()
      .min(1, "Erreur: La ville est requise"),

    zipcode: z
      .string()
      .min(1, "Erreur: Le code postal est requis"),

    number: z
      .string()
      .min(1, "Erreur: Le numéro est requis"),

    street: z
      .string()
      .min(1, "Erreur: La rue est requise"),

    country: z
      .string()
      .min(1, "Erreur: Le pays est requis"),
  }),
});


interface EventType {
  id: number;
  type: string;
}

type User = {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  nb_like: number;
  user: {
    id: number;
    email: string;
    is_planner: boolean;
    account_id: string | null;
  };
  created_at: Date;
  updated_at: Date;
};

interface Props {
  eventTypes: EventType[];
  user?: User;
}

export default function NewEventForm({ eventTypes, user }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [places, setPlaces] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [date, setDate] = useState("");
  const [clotureBillets, setClotureBillets] = useState("");
  const [types, setTypes] = useState<number[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [address, setAddress] = useState({
    city: "",
    zipcode: "",
    number: "",
    street: "",
    country: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const validationResult = eventSchema.safeParse({
      title,
      description,
      places,
      price,
      date,
      clotureBillets,
      types,
      photos,
      address,
    });

    if (!validationResult.success) {
      setErrorMessage(validationResult.error.errors[0].message);
      return;
    }

    if (new Date(clotureBillets) > new Date(date)) {
      setErrorMessage("La date de clôture des billets doit être antérieure à la date de l'événement.");
      return;
    }


    try {
      setLoading(true);
      const uploadedUrls: string[] = [];

      for (const photo of photos) {
        const url = await uploadPhoto(photo);
        uploadedUrls.push(url);
      }

      const new_event = await createEvent({
        titre: title,
        description,
        date,
        cloture_billets: clotureBillets,
        types,
        country: address.country,
        city: address.city,
        zipcode: address.zipcode,
        number: address.number,
        street: address.street,
        price,
        nb_places: places,
        photos: uploadedUrls,
      });

      router.push(`/events/${new_event.id}`);
      toast.success("Evenement créé avec succès");
    } catch {
      const msg = "Erreur lors de la création de l'événement.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setPhotos(newFiles);
  };

  const removeSelectedImage = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (<LoadingOverlay text="Nous ajoutons votre évenement..." />)
  }


  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="w-full bg-[#0F172A] text-[#F7FAF6] text-center py-4 rounded-t-lg">
            <h2 className="text-2xl font-bold">Ajouter un évènement</h2>
          </div>
          <div className="pb-8 pl-8 pr-8">
            <form action="#" method="POST" className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {photos && (
                  <div className="mt-4 max-h-48 overflow-x-auto overflow-y-hidden border border-gray-300 rounded-md bg-gray-50 p-2">
                    <div className="flex flex-row items-start gap-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative flex-shrink-0 w-32 h-32">
                          <Image
                            src={URL.createObjectURL(photo)}
                            alt="Preview"
                            fill
                            className="object-cover rounded-md shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 text-xs"
                            aria-label="Supprimer l'image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                )}


                <div>
                  <label htmlFor="pictures" className="block text-sm font-medium text-gray-700">Photos</label>
                  <input
                    id="pictures"
                    name="pictures"
                    type="file"
                    multiple
                    onChange={(e) => handleFile(e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <Textarea
                    placeholder="Décrivez votre évènement"
                    variant="bordered"
                    id="description"
                    name="description"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    disableAnimation
                    maxRows={4}
                    classNames={{
                      base: "w-full",
                      inputWrapper:
                        "w-full min-h-[120px] resize-none overflow-y-auto rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      input: "text-gray-900 px-3 py-2 text-sm",
                      label: "text-sm font-medium text-gray-700 mb-1",
                    }}
                  />

                </div>

                <div>
                  <label htmlFor="places" className="block text-sm font-medium text-gray-700">Places</label>
                  <input
                    id="places"
                    name="places"
                    type="number"
                    required
                    onChange={(e) => setPlaces(e.target.valueAsNumber)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={!user || !user.user.account_id}
                    value={!user || !user.user.account_id ? 0 : price}
                    required
                    onChange={(e) => setPrice(e.target.valueAsNumber || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Champs dates */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date de l&apos;événement</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="clotureBillets" className="block text-sm font-medium text-gray-700">Date de clôture des billets</label>
                  <input
                    id="clotureBillets"
                    name="clotureBillets"
                    type="date"
                    required
                    onChange={(e) => setClotureBillets(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Types - Select */}
                <div className="flex w-full max-w-xs flex-col gap-2">
                  <Select
                    aria-label="Sélectionnez des types"
                    placeholder="Sélectionnez des types"
                    selectionMode="multiple"
                    selectedKeys={new Set(types.map(String))}
                    onSelectionChange={(selectedKeys) => {
                      const selectedIds = Array.from(selectedKeys).map(Number);
                      setTypes(selectedIds);
                    }}
                    classNames={{
                      trigger: "bg-white",
                      popoverContent: "bg-white border border-gray-200 rounded-md shadow-md transition-all duration-200",
                      listbox: "bg-white",
                    }}
                  >
                    {eventTypes.map((type) => (
                      <SelectItem
                        key={type.id.toString()}
                        aria-label={type.type}
                        className="text-black hover:bg-gray-100 hover:shadow-sm transition"
                      >
                        {type.type}
                      </SelectItem>
                    ))}
                  </Select>

                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    name="number"
                    type="text"
                    placeholder="Numéro"
                    value={address.number}
                    onChange={handleAddressChange}
                    className="mb-2 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    name="street"
                    type="text"
                    placeholder="Rue"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="mb-2 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    name="city"
                    type="text"
                    placeholder="Ville"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="mb-2 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    name="zipcode"
                    type="text"
                    placeholder="Code postal"
                    value={address.zipcode}
                    onChange={handleAddressChange}
                    className="mb-2 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    name="country"
                    type="text"
                    placeholder="Pays"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <button className="w-full py-2 px-4 bg-[#4338CA] hover:bg-[#6366F1] text-white rounded-md transition cursor-pointer" aria-label="Ajouter" name="Ajouter">
                Ajouter
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
