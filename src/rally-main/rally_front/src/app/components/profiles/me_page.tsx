"use client";
import Image from "next/image";
import Card from "@/app/components/events/event_card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import Pagination from "@/app/components/pagination";
import { Chip } from "@heroui/chip";
import UpdateProfileModal from "./update_profile_modal";
import { useDisclosure } from "@heroui/modal";
import StripeAccountButton from "@/app/components/profiles/stripe_account_button";
import { useRouter } from "next/navigation";
import RegistrationCard from "@/app/components/registrations/registration_card";
import PaymentCard from "@/app/components/payments/payment_card";
import { UserCheck } from "lucide-react";

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

interface Profile {
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
    account_id: string;
  };
  created_at: string;
  updated_at: string;
}


type Registration = {
  id: number;
  event_id: number;
  event_title: string;
  registered_at: string;
  payment_status: string;
  profile: {
    id: number;
    first_name: string;
    last_name: string;
    photo: string;
    nb_like: number;
    email: string;
    created_at: string;
  };
};


interface Payment {
  id: number;
  event_id: number;
  event_title: string;
  buyer_id: number;
  buyer_email: string;
  organizer_id: number;
  organizer_email: string;
  brut_amount: number;
  status: string;
  created_at: string;
}


interface Props {
  myEvents: Event[];
  totalPagesEvents: number;
  user: Profile;
  currentPageEvents: number;
  myRegistrations: Registration[];
  totalPagesRegistrations: number;
  currentPageRegistrations: number;
  myPayments: Payment[];
  totalPagesPayments: number;
  currentPagePayments: number;
}


export default function MePage({
  myEvents,
  totalPagesEvents,
  user,
  currentPageEvents,
  myRegistrations,
  totalPagesRegistrations,
  currentPageRegistrations,
  myPayments,
  totalPagesPayments,
  currentPagePayments,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        {/* Profil */}
        <div className="relative flex flex-col md:flex-row items-center justify-between p-8 bg-white shadow-lg rounded-2xl">
          {user.user.is_planner && (
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

          <div className="flex-shrink-0">
            <Image
              className="w-40 h-40 rounded-full bg-gray-300 object-cover"
              src={user.photo}
              alt="Photo de profil"
              width={160}
              height={160}
              priority
            />
          </div>

          <div className="flex-1 mt-6 md:mt-0 md:ml-10 space-y-4 text-center md:text-left">
            <p className="text-3xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </p>
            <div className="space-y-1 text-gray-600">
              <p><span className="font-semibold text-gray-700">Email :</span> {user.user.email}</p>
              <p><span className="font-semibold text-gray-700">Contact :</span> {user.user.phone_number}</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <Chip
                variant="solid"
                className="text-sm font-medium bg-rose-100 text-rose-600 px-3 py-1 rounded-full"
              >
                ❤️ {user.nb_like} likes
              </Chip>

              <Chip
                variant="solid"
                className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                📅 {myEvents.length} évènement{myEvents.length > 1 ? "s" : ""}
              </Chip>
            </div>
          </div>

          <div className="mt-10 flex gap-6 flex-wrap justify-center">
            {user.user.account_id == null &&
              <StripeAccountButton />
            }
            <button className="px-6 py-2 bg-[#4338CA] text-white rounded-full hover:bg-[#6366F1] transition cursor-pointer" onClick={onOpen}>
              Modifier mon profil
            </button>
          </div>
        </div>

        {/* Accordion Mes événements */}
        <div className="w-full">
          <Accordion className="border-t border-gray-200 divide-y divide-gray-200 dark:divide-gray-700 dark:border-gray-700">
            <AccordionItem
              key="1"
              aria-label="Mes évènements"
              title={<div className="text-[#0F172A] dark:text-white font-semibold text-lg">Mes évènements</div>}
              className="p-0"
            >
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 w-full mt-6">
                {myEvents.map((event) => (
                  <Card
                    key={event.id}
                    title={event.title}
                    username={`${user.first_name} ${user.last_name}`}
                    price={event.price}
                    nb_likes={event.nb_likes}
                    pictureUrl={"/no_pic.jpg"}
                    isLoggedIn={true}
                    event_id={event.id}
                    description={event.description}
                    address={`${event.address.number}, ${event.address.street}, ${event.address.city}, ${event.address.country}`}
                    types={event.types}
                    organizer_id={event.profile.id}
                    isLiked={event.is_liked}
                  />
                ))}
                {totalPagesEvents > 0 && (
                  <div className="col-span-full flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPageEvents}
                      totalPages={totalPagesEvents}
                      onPageChange={(page) => {
                        router.push(`/profiles/me?eventCurrentPage=${page}&registrationsCurrentPage=${currentPageRegistrations}&paymentsCurrentPage=${currentPagePayments}`, { scroll: false });
                      }}
                    />
                  </div>
                )}

              </div>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-full">
          <Accordion className="border-t border-gray-200 divide-y divide-gray-200 dark:divide-gray-700 dark:border-gray-700">
            <AccordionItem
              key="2"
              aria-label="Mes inscriptions"
              title={<div className="text-[#0F172A] dark:text-white font-semibold text-lg">Mes inscriptions</div>}
              className="p-0"
            >
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 w-full mt-6">
                {myRegistrations.map((registration) => (
                  <RegistrationCard registration={registration} key={registration.id} />
                ))}
                {totalPagesRegistrations > 0 && (
                  <div className="col-span-full flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPageRegistrations}
                      totalPages={totalPagesRegistrations}
                      onPageChange={(page) => {
                        router.push(`/profiles/me?eventCurrentPage=${currentPageEvents}&registrationsCurrentPage=${page}&paymentsCurrentPage=${currentPagePayments}`, { scroll: false });
                      }}
                    />
                  </div>
                )}
              </div>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="w-full">
          <Accordion className="border-t border-gray-200 divide-y divide-gray-200 dark:divide-gray-700 dark:border-gray-700">
            <AccordionItem
              key="2"
              aria-label="Mes paiements"
              title={<div className="text-[#0F172A] dark:text-white font-semibold text-lg">Mes paiements</div>}
              className="p-0"
            >
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 w-full mt-6">
                {myPayments.map((payment) => (
                  <PaymentCard payment={payment} key={payment.id} />
                ))}
                {totalPagesPayments > 0 && (
                  <div className="col-span-full flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPagePayments}
                      totalPages={totalPagesPayments}
                      onPageChange={(page) => {
                        router.push(`/profiles/me?eventCurrentPage=${currentPageEvents}&registrationsCurrentPage=${currentPageRegistrations}&paymentsCurrentPage=${page}`, { scroll: false });
                      }}
                    />
                  </div>
                )}
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <UpdateProfileModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
