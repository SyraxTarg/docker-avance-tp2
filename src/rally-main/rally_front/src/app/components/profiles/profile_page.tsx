"use client";

import Image from "next/image";
import Card from "@/app/components/events/event_card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import Pagination from "@/app/components/pagination";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import SignalUserModal from "@/app/components/profiles/SignalingUsers";
import { useRouter } from "next/navigation";
import { UserCheck, Flag } from 'lucide-react';

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
  };
  types: {
    id: number;
    type: string;
  }[];
  address: {
    id: number;
    city: string;
    zipcode: string;
    number: string;
    street: string;
    country: string;
  };
  pictures: {
    id: number;
    photo: string;
  }[];
  is_liked: boolean;
}

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  nb_like: number;
  user: {
    id: number;
    email: string;
    phone_number: string;
    is_planner: boolean;
  };
  created_at: string;
  updated_at: string;
}

interface Reason {
  id: number;
  reason: string;
}

interface Props {
  profile: Profile;
  profileEvents: Event[];
  totalPages: number;
  currentPage: number;
  user: Profile;
  reasons: Reason[];
}

export default function ProfilePage(
  {
    profile,
    profileEvents,
    totalPages,
    currentPage,
    user,
    reasons
  }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  if (!profile) {
    return <div>Chargement du profil...</div>;
  }

  const handlePagination = (page: number) => {
    const params = new URLSearchParams();

    params.set("eventCurrentPage", page.toString());

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        {/* Profil */}
        <div className="relative flex flex-col md:flex-row items-center justify-between p-8 bg-white shadow-lg rounded-2xl">
          {/* Badge Organisateur en haut à droite */}
          {profile.user.is_planner && (
            <div className="absolute top-4 right-4 group">
              <div className="p-1.5 rounded-full bg-[#D9F7E4]">
                <UserCheck
                  className="w-4 h-4 text-[#0F172A] cursor-help"
                  aria-label="Organisateur"
                />
              </div>
              <div className="absolute -top-8 right-1 scale-0 group-hover:scale-100 transition-transform bg-[#D9F7E4] text-[#0F172A] text-xs px-2 py-1 rounded shadow whitespace-nowrap z-10">
                Organisateur
              </div>
            </div>
          )}

          {/* Avatar */}
          <div className="flex-shrink-0">
            <Image
              className="w-40 h-40 rounded-full bg-gray-300 object-cover"
              src={profile.photo}
              alt="Photo de profil"
              width={160}
              height={160}
              // priority
            />
          </div>

          {/* Infos */}
          <div className="flex-1 mt-6 md:mt-0 md:ml-10 space-y-4 text-center md:text-left">
            {/* Nom */}
            <p className="text-3xl font-bold text-gray-900">
              {profile.first_name} {profile.last_name}
            </p>

            {/* Email et Téléphone */}
            <div className="space-y-1 text-gray-600">
              <p><span className="font-semibold text-gray-700">Email :</span> {profile.user.email}</p>
              <p><span className="font-semibold text-gray-700">Contact :</span> {profile.user.phone_number}</p>
            </div>

            {/* Chips Likes & Évènements */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <Chip
                variant="solid"
                className="text-sm font-medium bg-rose-100 text-rose-600 px-3 py-1 rounded-full"
              >
                ❤️ {profile.nb_like} likes
              </Chip>

              <Chip
                variant="solid"
                className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                📅 {profileEvents.length} évènement{profileEvents.length > 1 ? "s" : ""}
              </Chip>
            </div>
          </div>
          {user && (
            <button
              onClick={onOpen}
              title="Signaler"
              aria-label="Signaler l’évènement"
              className="flex items-center justify-center cursor-pointer"
            >
              <Flag className="w-6 h-6 block translate-y-[1px] hover:text-red-500 transition-colors" />
            </button>
          )}
        </div>

        {/* Accordion avec événements */}
        <div className="w-full">
          <Accordion className="border-t border-gray-200 divide-y divide-gray-200 dark:divide-gray-700 dark:border-gray-700">
            <AccordionItem
              key="1"
              aria-label="Mes évènements"
              title={
                <div className="text-[#0F172A] dark:text-white font-semibold text-lg">
                  Evènements
                </div>
              }
              className="p-0"
            >
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 w-full mt-6">
                {profileEvents.map((event: Event) => (
                  <Card
                    key={event.id}
                    title={event.title}
                    username={`${profile.first_name} ${profile.last_name}`}
                    price={event.price}
                    nb_likes={event.nb_likes}
                    pictureUrl={
                      event.pictures && event.pictures.length > 0
                        ? event.pictures[0].photo
                        : "/no_pic.jpg"
                    }
                    isLoggedIn={!!user}
                    event_id={event.id}
                    description={event.description}
                    address={`${event.address.number}, ${event.address.street}, ${event.address.city}, ${event.address.country}`}
                    types={event.types}
                    organizer_id={event.profile.id}
                    isLiked={event.is_liked}
                  />
                ))}

                {/* Pagination */}
                <div className="col-span-full flex justify-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => handlePagination(page)}
                  />
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <SignalUserModal isOpen={isOpen} onClose={onClose} user_id={profile.id} reasons={reasons} />
    </>
  );
}
