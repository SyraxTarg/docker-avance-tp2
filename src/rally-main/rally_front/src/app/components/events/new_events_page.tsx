"use client";
import { useState } from "react";
import NewEventForm from "../../components/events/NewEventForm";
import TopBanner from "@/app/components/top_banner";

interface Type{
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

interface Props{
    types: Type[];
    user?: User;
}

export default function NewEvent({types, user}: Props) {
  const [showBanner, setShowBanner] = useState(!user?.user?.account_id);

  return (
    <div className="relative bg-gray-100 ">
      {showBanner && (
        <TopBanner
          headline="Attention"
          text="Pour ajouter des évènements payants, merci de créer votre compte Stripe."
          buttonText="Créer un compte Stripe"
          buttonLink="/profiles/me"
          height="auto"
          maxHeight="200px"
          closeButtonClicked={() => setShowBanner(false)}
        />
      )}

      <div className={`p-4`}>
        <NewEventForm eventTypes={types} user={user}/>
      </div>
    </div>
  );
}
