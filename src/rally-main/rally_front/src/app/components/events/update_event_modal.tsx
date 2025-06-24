"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { uploadPhoto } from "@/app/events/new/server_actions/upload_photo";
import { toast } from "react-toastify";
import { updateEvent } from "@/app/events/[event_id]/server_actions/update_event";
import Image from "next/image";
import * as z from "zod";

type EventType = { id: number; type: string };

interface Event {
  id: number;
  title: string;
  description: string;
  nb_places: number;
  price: number;
  date: string;
  cloture_billets: string;
  created_at: string;
  updated_at: string;
  nb_likes: number;
  nb_comments: number;
  profile: {
    id: number;
    first_name: string;
    last_name: string;
    photo: string;
    nb_like: number;
    email: string;
    created_at: string;
  };
  types: EventType[];
  address: {
    id: number;
    city: string;
    zipcode: string;
    number: string;
    street: string;
    country: string;
  };
  pictures: { id: number; photo: string }[];
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  eventTypes: EventType[];
};

const updateEventSchema = z.object({
  event_id: z.number(),
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
  cloture_billets: z.string().min(1, "La date de clôture est requise"),
  types: z.array(z.number()).min(1, "Au moins un type doit être sélectionné"),
  country: z.string().min(1, "Le pays est requis"),
  city: z.string().min(1, "La ville est requise"),
  zipcode: z.string().min(1, "Le code postal est requis"),
  number: z.string().min(1, "Le numéro est requis"),
  street: z.string().min(1, "La rue est requise"),
  price: z.number().min(0, "Le prix ne peut pas être négatif"),
  nb_places: z.number().min(0, "Le nombre de places ne peut pas être négatif"),
  photos: z.array(z.string()).optional(),
});

export default function UpdateEventModal({ isOpen, onClose, event, eventTypes }: Props) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [places, setPlaces] = useState(event.nb_places);
  const [price, setPrice] = useState(event.price);
  const [date, setDate] = useState(event.date.slice(0, 10));
  const [clotureBillets, setClotureBillets] = useState(event.cloture_billets.slice(0, 10));
  const [types, setTypes] = useState<number[]>(event.types.map((t) => t.id));
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoURLs, setPhotoURLs] = useState<string[]>(event.pictures.map((p) => p.photo));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [address, setAddress] = useState(event.address);

  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setPhotos(Array.from(files));
  };

  const removeUploadedPhoto = (index: number) => {
    setPhotoURLs((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSelectedImage = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);

    // Construction de l'objet à valider
    const dataToValidate = {
      event_id: event.id,
      titre: title.trim(),
      description: description.trim(),
      date,
      cloture_billets: clotureBillets,
      types,
      country: address.country.trim(),
      city: address.city.trim(),
      zipcode: address.zipcode.trim(),
      number: address.number.trim(),
      street: address.street.trim(),
      price,
      nb_places: places,
      photos: photoURLs,
    };

    const result = updateEventSchema.safeParse(dataToValidate);
    if (!result.success) {
      const firstError = result.error.errors[0];
      setErrorMessage(firstError.message);
      toast.error(`Erreur de validation : ${firstError.message}`);
      return;
    }

    try {
      const uploaded: string[] = [...photoURLs];
      for (const photo of photos) {
        const url = await uploadPhoto(photo);
        uploaded.push(url);
      }

      await updateEvent({
        ...result.data,
        photos: uploaded,
      });

      router.refresh();
      toast.success("Événement modifié");
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur lors de la mise à jour de l'événement.");
      toast.error(`Erreur pendant la modification : ${errorMessage}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-none"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative z-50 w-full max-w-md sm:max-w-md bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto pointer-events-auto"
      >
        <div>
          <button
            onClick={onClose}
            className="absolute top-1 right-1 text-black-700 hover:text-gray-500 rounded-full p-1 text-xs"
            aria-label="Fermer la modale de modification d'évènement"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photos preview */}
          <div className="mt-4 max-h-48 overflow-x-auto overflow-y-hidden border border-gray-300 rounded-md bg-gray-50 p-2">
            {(photos.length > 0 || photoURLs.length > 0) && (
              <div className="flex gap-3 w-max">
                {photoURLs.map((url, index) => (
                  <div key={index} className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={url}
                      alt="event photo"
                      fill
                      className="w-full h-full object-cover rounded-md shadow"
                    />
                    <button
                      type="button"
                      onClick={() => removeUploadedPhoto(index)}
                      className="absolute top-1 right-1 text-white bg-black/60 rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {photos.map((file, index) => (
                  <div key={`new-${index}`} className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      fill
                      className="w-full h-full object-cover rounded-md shadow"
                      aria-label="Photo ajoutée de l'évènement"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(index)}
                      className="absolute top-1 right-1 text-white bg-black/60 rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photos</label>
            <input
              type="file"
              multiple
              onChange={handleFile}
              aria-label="Ajouter des photos à l'évènement"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-label="Modifier le titre de l'évènement"
              className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Modifier la description de l'évènement"
              classNames={{
                base: "w-full",
                inputWrapper:
                  "w-full min-h-[120px] resize-none overflow-y-auto rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                input: "text-gray-900 px-3 py-2 text-sm",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Places</label>
              <input
                type="number"
                value={places}
                disabled
                min={0}
                aria-label="Modifier le nombre de places de l'évènement"
                onChange={(e) => setPlaces(Number(e.target.value))}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix</label>
              <input
                type="number"
                step={0.01}
                value={price}
                disabled
                min={0}
                aria-label="Modifier le prix de l'évènement"
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de l&apos;évènement</label>
            <input
              type="date"
              value={date}
              aria-label="Modifier la date de l'évènement"
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Clôture des billets</label>
            <input
              type="date"
              value={clotureBillets}
              aria-label="Modifier la date de cloture des billets de l'évènement"
              onChange={(e) => setClotureBillets(e.target.value)}
              className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Types</label>
            <Select
              selectionMode="multiple"
              selectedKeys={new Set(types.map(String))}
              aria-label="Modifier les types de l'évènement"
              onSelectionChange={(keys) => setTypes(Array.from(keys).map(Number))}
            >
              {eventTypes.map((type) => (
                <SelectItem key={type.id.toString()}>{type.type}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            {["number", "street", "city", "zipcode", "country"].map((field) => (
              <input
                key={field}
                name={field}
                aria-label={`Modifier ${field} de l'évènement`}
                placeholder={field}
                value={address[field as keyof typeof address]}
                onChange={handleAddressChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-[#4338CA] hover:bg-[#6366F1] text-white py-2 rounded-md shadow transition cursor-pointer"
          >
            Sauvegarder
          </button>
        </form>
      </div>
    </div>
  );
}
