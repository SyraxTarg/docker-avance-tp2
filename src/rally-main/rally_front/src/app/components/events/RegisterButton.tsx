"use client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { createFreeRegistration } from "@/app/events/[event_id]/server_actions/create_free_registration";
import { createRegistration } from "@/app/events/[event_id]/server_actions/create_registration_checkout";
import { deleteFreeRegistration } from "@/app/events/[event_id]/server_actions/delete_free_registration";
import { createRefund } from "@/app/events/[event_id]/server_actions/create_refund";

interface RegisterButtonProps {
  event_id: number;
  isRegistered: boolean;
  onRegistered: () => void;
  nb_places: number;
  places_taken: number;
  date: string;
  cloture_billets: string;
  is_free: boolean;
  user_id?: number;
}

export default function RegisterButton({
  event_id,
  isRegistered,
  onRegistered,
  nb_places,
  places_taken,
  date,
  cloture_billets,
  is_free,
  user_id
}: RegisterButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClickFree = useCallback(async () => {
    setIsLoading(true);
    const result = await createFreeRegistration(event_id);
    if (result) {
      onRegistered();
      toast.success("Inscription enregistrée");
    } else {
      toast.error("Erreur lors de l'inscription");
    }
    setIsLoading(false);
  }, [event_id, onRegistered]);

  const handleClickPayment = useCallback(async () => {
    setIsLoading(true);
    const result = await createRegistration(event_id);
    setIsLoading(false);
    if (result) {
      window.location.href = result.session_url;
    } else {
      toast.error("Erreur lors de l'inscription");
    }
  }, [event_id]);

  const handleUnregisterFree = useCallback(async () => {
    if (!user_id) return;
    setIsLoading(true);
    const result = await deleteFreeRegistration(event_id, user_id);
    if (result) {
      onRegistered();
      toast.success("Inscription annulée");
    } else {
      toast.error("Erreur lors de l'annulation");
    }
    setIsLoading(false);
  }, [event_id, user_id, onRegistered]);

  const handleUnregisterPaid = useCallback(async () => {
    if (!user_id) return;

    const confirmed = window.confirm(
      "Vous êtes sur le point d'annuler votre inscription et de demander un remboursement.\nVous recevrez une notification par email une fois le remboursement effectué.\n\nSouhaitez-vous continuer ?"
    );

    if (!confirmed) return;

    setIsLoading(true);
    const result = await createRefund(event_id);
    setIsLoading(false);
    if (result) {
      onRegistered();
      toast.success("Inscription annulée et remboursement effectué");
    } else {
      toast.error("Erreur lors de l'annulation");
    }
  }, [event_id, user_id, onRegistered]);

  const now = new Date();
  const eventDate = new Date(date);
  const clotureDate = new Date(cloture_billets);

  const isEventPast = eventDate < now;
  const isCloturePast = clotureDate < now;
  const isFull = nb_places === places_taken;

  const isDisabled = !user_id || isEventPast || isCloturePast || isFull;

  let buttonText = "Réserver";
  if (isRegistered && is_free) buttonText = "Se désinscrire";
  else if (isRegistered) buttonText = "Se désinscrire";
  else if (isEventPast) buttonText = "Événement passé";
  else if (isCloturePast) buttonText = "Clôturé";
  else if (isFull) buttonText = "Complet";

  return (
    <button
      type="button"
      onClick={
        is_free
          ? isRegistered
            ? handleUnregisterFree
            : handleClickFree
          : isRegistered
            ? handleUnregisterPaid
            : handleClickPayment
      }
      disabled={isDisabled || isLoading}
      className={`py-2 px-6 rounded-xl transition whitespace-nowrap mt-4 md:mt-0
        ${isDisabled || isLoading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-[#4338CA] hover:bg-[#6366F1] text-white cursor-pointer"}`}
    >
      {isLoading ? "Chargement..." : buttonText}
    </button>
  );
}
