"use client";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { createStripeAccount } from "@/app/profiles/me/server_actions/create_stripe_account";


export default function StripeAccountButton() {
  const handleClick = useCallback(async () => {
    try {
      const data = await createStripeAccount();
      window.location.href = data.onboarding_url;
    } catch {
      toast.error("Une erreur est survenue, le compte n'a pas été crée");
    }

  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`py-2 px-6 rounded-xl transition whitespace-nowrap mt-4 md:mt-0 bg-[#4338CA] hover:bg-[#6366F1] text-white cursor-pointer`}
    >
      Créer mon compte stripe
    </button>
  );
}
