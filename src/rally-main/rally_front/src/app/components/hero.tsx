"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

// Lazy-loaded components
const Pagination = dynamic(() => import("./pagination"), { ssr: false });
const Card = dynamic(() => import("./events/event_card"), { ssr: false });
const ProfileCard = dynamic(() => import("./profiles/profile_card"), { ssr: false });

interface Type { id: number; type: string; }

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
    profile: { id: number; first_name: string; last_name: string };
    types: Type[];
    address: {
        id: number; city: string; zipcode: string; number: string; street: string; country: string;
    };
    pictures: { id: number; photo: string }[];
    is_liked: boolean;
}

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    photo: string;
    nb_like: number;
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
        role: { id: number; role: string };
    };
    created_at: Date;
    updated_at: Date;
};

interface Props {
    types: Type[];
    totalTypePages: number;
    typeCurrentPage: number;
    eventsRecent: Event[];
    user?: User;
    eventsPopular: Event[];
    planners: Profile[];
}

export default function Hero({
    types,
    totalTypePages,
    typeCurrentPage,
    eventsRecent,
    user,
    eventsPopular,
    planners
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("typesCurrentPage", page.toString());
        router.push(`/events?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col">

            {/* HERO SECTION */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/hero/hero1.avif"
                    alt="Image de fond Rally"
                    fill
                    priority
                    className="object-cover z-0"
                />
                <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-10" />
                <div className="relative z-20 text-center max-w-xl px-4 sm:px-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                        Vivez chaque instant avec Rally&nbsp;!
                    </h1>
                    <p className="text-white mb-6 text-base sm:text-lg">
                        La plateforme pour <span className="font-semibold">ne rien manquer</span>&nbsp;: concerts, événements, rencontres, et plus encore.
                        Créez vos souvenirs dès maintenant.
                    </p>
                    {!user && (
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/auth/login" prefetch>
                                <span className="bg-[#4338CA] hover:bg-[#6366F1] text-white px-6 py-2 rounded shadow transition">
                                    Connexion
                                </span>
                            </Link>
                            <Link href="/auth/register" prefetch>
                                <span className="bg-white hover:bg-gray-200 text-[#0F172A] px-6 py-2 rounded shadow transition">
                                    Inscription
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">

                {/* TYPES D'ÉVÉNEMENTS */}
                <div>
                    <h2 className="text-3xl font-bold text-center mb-12 text-[#0F172A]">Découvrez !</h2>
                    <h3 className="text-xl font-semibold mb-6 text-[#0F172A]">Événements par type</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {types.map((type) => (
                            <Link
                                href={{ pathname: "/events", query: { type_ids: [type.id] } }}
                                key={type.id}
                                prefetch={false}
                                className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition"
                            >
                                <h4 className="font-semibold text-lg">{type.type}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Explorez tous les {type.type.toLowerCase()}s disponibles !
                                </p>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Pagination currentPage={typeCurrentPage} totalPages={totalTypePages} onPageChange={handlePageChange} />
                    </div>
                </div>

                {/* ÉVÉNEMENTS RÉCENTS */}
                <div>
                    <h3 className="text-xl font-semibold mb-6 text-[#0F172A]">Événements récents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {eventsRecent.map((event) => (
                            <Card
                                key={event.id}
                                title={event.title}
                                username={`${event.profile.first_name} ${event.profile.last_name}`}
                                address={`${event.address.number}, ${event.address.street}, ${event.address.city}, ${event.address.country}`}
                                price={event.price}
                                nb_likes={event.nb_likes}
                                description={event.description}
                                pictureUrl={"/no_pic.jpg"}
                                isLoggedIn={!!user}
                                event_id={event.id}
                                organizer_id={event.profile.id}
                                types={event.types}
                                isLiked={event.is_liked}
                            />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-start">
                        <Link href={"/events?recent=true"} prefetch>
                            <button className="text-[#0F172A] px-6 py-2 rounded transition hover:underline focus:outline-none">
                                Voir plus
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ÉVÉNEMENTS POPULAIRES */}
                <div>
                    <h3 className="text-xl font-semibold mb-6 text-[#0F172A]">Événements populaires</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {eventsPopular.map((event) => (
                            <Card
                                key={event.id}
                                title={event.title}
                                username={`${event.profile.first_name} ${event.profile.last_name}`}
                                address={`${event.address.number}, ${event.address.street}, ${event.address.city}, ${event.address.country}`}
                                price={event.price}
                                nb_likes={event.nb_likes}
                                description={event.description}
                                pictureUrl={"/no_pic.jpg"}
                                isLoggedIn={!!user}
                                event_id={event.id}
                                organizer_id={event.profile.id}
                                types={event.types}
                                isLiked={event.is_liked}
                            />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-start">
                        <Link href={"/events?popularity=true"} prefetch>
                            <button className="text-[#0F172A] px-6 py-2 rounded transition hover:underline focus:outline-none">
                                Voir plus
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ORGANISATEURS POPULAIRES */}
                <div>
                    <h3 className="text-xl font-semibold mb-6 text-[#0F172A]">Organisateurs populaires</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {planners.map((planner) => (
                            <ProfileCard key={planner.id} profile={planner} />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-start">
                        <Link href={"/profiles"} prefetch>
                            <button className="text-[#0F172A] px-6 py-2 rounded transition hover:underline focus:outline-none">
                                Voir plus
                            </button>
                        </Link>
                    </div>
                </div>

            </section>
        </div>
    );
}
