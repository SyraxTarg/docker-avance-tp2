"use client";
import { useState, useEffect } from "react";
import LikeButton from "../../components/likes/like_button";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { useDisclosure } from "@heroui/modal";
import SignalEventModal from "../../components/events/SignalingEvent";
import Caroussel from "../../components/events/Caroussel";
import RegisterButton from "../../components/events/RegisterButton";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import UpdateEventModal from "@/app/components/events/update_event_modal";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import DeleteButton from "@/app/components/events/delete_event_button";
import ConfirmDeleteModal from "@/app/components/confirm_delete_modal";
import { Chip } from "@heroui/chip";
import EventCommentsAccordion from "@/app/components/comments/comments_accordion";
import { deleteEvent } from "@/app/events/[event_id]/server_actions/delete_event";
import MyEventsRegistrations from "../profiles/my_event_registrations";
import LoadingOverlay from "../loading_overlay";

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

export interface Comment {
    id: number;
    profile: {
        id: number;
        first_name: string;
        last_name: string;
        photo: string;
        nb_like: number;
        email: string;
        created_at: string;
    };
    event_id: number;
    content: string;
    created_at: string;
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
        phone_number: string;
        is_planner: boolean;
        account_id: string | null;
        role: {
            id: number;
            role: string;
        }
    };
    created_at: Date;
    updated_at: Date;
};

type Registration = {
    id: number;
    event_id: number;
    event_title: string;
    registered_at: string;
    payment_status: string;
    profile?: {
        id: number;
        first_name: string;
        last_name: string;
        photo: string;
        nb_like: number;
        email: string;
        created_at: string;
    };
};

interface Type {
    id: number;
    type: string;
}

interface Reason {
    id: number;
    reason: string;
}

interface Props {
    event: Event;
    comments: Comment[];
    commentCount: number;
    placesTaken: number;
    user?: User;
    isRegistered: boolean;
    currentPageComments: number;
    totalCommentsPages: number;
    myERegistrations: Registration[];
    currentPageMyER: number;
    totalMyERPages: number;
    types: Type[];
    reasons: Reason[];
}

export default function SingleEventPage({
    event,
    comments,
    commentCount,
    placesTaken,
    user,
    isRegistered,
    currentPageComments,
    totalCommentsPages,
    myERegistrations,
    currentPageMyER,
    totalMyERPages,
    types,
    reasons
}: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const router = useRouter();

    const searchParams = useSearchParams();

    const handleDeleteEvent = (event_id: number) => {
        try {
            deleteEvent(event_id);
            router.push("/events");
        } catch (error) {
            console.error("Erreur lors de la suppression de l'évènement :", error);
        }
    };

    useEffect(() => {
        const onboardingStatus = searchParams.get("onboarding");
        if (onboardingStatus === "success") {
            toast.success("Paiement effectué créé avec succès !");
            const url = new URL(window.location.href);
            url.searchParams.delete("onboarding");
            window.history.replaceState({}, document.title, url.pathname);
        } else if (onboardingStatus === "error") {
            toast.error("Erreur le paiement n'a pas été pris en compte");
            const url = new URL(window.location.href);
            url.searchParams.delete("onboarding");
            window.history.replaceState({}, document.title, url.pathname);
        }
    }, [searchParams]);

    if (!event) return <LoadingOverlay text="Nous chargeons votre évenement" />;

    return (
        <>
            <div className="p-6 max-w-3xl mx-auto space-y-6">
                <Caroussel event_id={event.id} photos={event.pictures} />

                <div className="bg-white p-6 rounded-2xl shadow-md space-y-2">
                    <h1 className="text-3xl font-bold text-[#0F172A] text-center">{event.title}</h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <p className="text-sm text-gray-700">
                            par{" "}
                            <Link
                                href={`/profiles/${event.profile.id}`}
                                className="text-[#0F172A] font-medium hover:underline transition-colors"
                            >
                                {event.profile.first_name} {event.profile.last_name}
                            </Link>
                        </p>

                        <div>
                            <p className="text-xs text-gray-700">
                                Créé le {new Date(event.created_at).toLocaleDateString('fr-FR', {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                            <p className="text-xs text-gray-700">
                                Mis à jour le {new Date(event.updated_at).toLocaleDateString('fr-FR', {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-600">
                        <LikeButton event_id={event.id} nb_likes={event.nb_likes} isLoggedIn={!!user} liked={event.is_liked} />

                        {user && (
                            <button
                                onClick={onOpen}
                                title="Signaler"
                                aria-label="Signaler l’évènement"
                                className="flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 block translate-y-[1px] hover:text-red-500 transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                                    />
                                </svg>
                            </button>
                        )}

                        {!!user && user.id === event.profile.id && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => setIsUpdateModalOpen(true)}
                                    className="flex items-center gap-2 bg-[#4338CA] hover:bg-[#6366F1] text-white px-4 py-2 rounded-2xl shadow transition-all font-semibold cursor-pointer"
                                    title="Modifier l’évènement"
                                >
                                    Modifier
                                </button>

                                <DeleteButton
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    label="Supprimer"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-md gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        <div>
                            <h3 className="font-semibold text-[#0F172A]">Places</h3>
                            <p>{placesTaken} / {event.nb_places}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0F172A]">Date</h3>
                            <p>{new Date(event.date).toLocaleDateString('fr-FR', {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0F172A]">Prix</h3>
                            <p>{!event.price ? "gratuit" : `${event.price}€`}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#0F172A]">Adresse</h3>
                            <p>
                                {event.address.number} {event.address.street},<br />
                                {event.address.zipcode} {event.address.city}
                            </p>
                        </div>
                    </div>

                    <RegisterButton
                        event_id={event.id}
                        isRegistered={isRegistered}
                        onRegistered={() => { router.refresh(); }}
                        nb_places={event.nb_places}
                        places_taken={placesTaken}
                        date={event.date}
                        cloture_billets={event.cloture_billets}
                        is_free={event.price == 0}
                        user_id={user ? user.id : undefined}
                    />
                </div>

                <div className="w-full max-w-3xl mx-auto">
                    <Accordion className="border-t border-gray-200 divide-y divide-gray-200 rounded-md shadow-sm">
                        <AccordionItem
                            key="1"
                            aria-label="Types"
                            title={
                                <div className="text-[#0F172A] font-semibold text-lg">
                                    Types
                                </div>
                            }
                            className="p-0"
                        >
                            <div className="flex flex-wrap gap-2 p-4 bg-gray-50">
                                {event.types.map((type) => (
                                    <Chip
                                        key={type.id}
                                        variant="solid"
                                        color="default"
                                        className="text-xs font-semibold bg-[#CBD5E1] text-[#0F172A] px-3 py-1 rounded-full shadow-sm transition-colors"
                                    >
                                        {type.type}
                                    </Chip>
                                ))}
                            </div>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>

                <EventCommentsAccordion
                    comments={comments}
                    commentCount={commentCount}
                    user={user}
                    event_id={event.id}
                    commentsCurrentPage={currentPageComments}
                    totalCommentsPages={totalCommentsPages}
                    reasons={reasons}
                />

                {!!user && user.id === event.profile.id && (
                    <MyEventsRegistrations registrations={myERegistrations} totalPages={totalMyERPages} currentPage={currentPageMyER} />
                )}
            </div>

            <SignalEventModal isOpen={isOpen} onClose={onClose} event_id={event.id} reasons={reasons} />
            <UpdateEventModal
                event={event}
                eventTypes={types}
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
            />
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDeleteEvent(event.id)}
                title="Supprimer cet évènement"
                description="Cette action est irréversible. Voulez-vous vraiment supprimer cet évènement ?"
            />
        </>
    );
}
