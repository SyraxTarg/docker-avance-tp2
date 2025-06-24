"use client";

import Card from "./event_card";
import styles from "./events.module.css";
import Pagination from "../pagination";
import SearchBar from "../search";
import Sidebar from "./side_bar";
import { useRouter, useSearchParams } from "next/navigation";

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

type Type = {
    id: number;
    type: string;
};


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

interface Filters {
    search?: string;
    selectedTypes?: number[];
    dateAvant?: string;
    dateApres?: string;
    city?: string;
    country?: string;
    popular?: boolean;
    recent?: boolean;
    price?: number;
}


interface Props {
    events: Event[];
    eventTypes: Type[];
    user?: User;
    currentPage: number;
    totalPages: number;
    totalResults: number;
    countResults: number;
    filters: Filters;
}

export default function EventsFeed(
    {
        events,
        eventTypes,
        user,
        currentPage,
        totalPages,
        totalResults,
        countResults,
        filters
    }: Props) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePagination = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("currentPage", page.toString());

        router.push(`/events?${params.toString()}`, { scroll: false });
    };


    return (
        <Sidebar
            filters={filters}
            types={eventTypes}
        >

            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight text-center">
                    Événements
                </h1>

                <SearchBar
                    search={filters.search}
                    prop_type="évènement"
                />

                <p className={`${styles.resultNumber}`}>
                    {countResults} résultats sur {totalResults}
                </p>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center align-items-center">


                    {events.map((event) => {
                        console.log(event.pictures);
                        return (
                            <Card
                                key={event.id}
                                title={event.title}
                                username={`${event.profile.first_name} ${event.profile.last_name}`}
                                address={`${event.address.number}, ${event.address.street}, ${event.address.city}, ${event.address.country}`}
                                price={event.price}
                                nb_likes={event.nb_likes}
                                description={event.description}
                                pictureUrl={event.pictures[0]?.photo}
                                isLoggedIn={!!user}
                                event_id={event.id}
                                organizer_id={event.profile.id}
                                types={event.types}
                                isLiked={event.is_liked}
                            />
                        );
                    })}

                </div>

                <div className="flex justify-center mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => handlePagination(page)}
                    />
                </div>

            </div>
        </Sidebar>
    );
}
