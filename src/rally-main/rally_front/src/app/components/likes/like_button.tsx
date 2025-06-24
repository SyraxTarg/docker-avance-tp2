"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createLike } from "@/app/events/[event_id]/server_actions/create_like";
import { deleteLike } from "@/app/events/[event_id]/server_actions/delete_like";

type LikeProps = {
  event_id: number;
  isLoggedIn: boolean;
  liked: boolean;
  nb_likes: number;
};

export default function LikeButton({
  event_id,
  isLoggedIn,
  liked,
  nb_likes,
}: LikeProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [localLiked, setLocalLiked] = useState(liked);
  const [localCount, setLocalCount] = useState(nb_likes);

  const handleLike = async () => {
    if (localLiked) return;

    setLocalLiked(true);
    setLocalCount((prev) => prev + 1);

    try {
      await createLike(event_id);
      startTransition(() => router.refresh());
    } catch (err) {
      console.error("Erreur lors du like :", err);
      setLocalLiked(false);
      setLocalCount((prev) => prev - 1);
    }
  };

  const handleRemoveLike = async () => {
    if (!localLiked) return;

    setLocalLiked(false);
    setLocalCount((prev) => prev - 1);

    try {
      await deleteLike(event_id);
      startTransition(() => router.refresh());
    } catch (err) {
      console.error("Erreur lors du unlike :", err);
      setLocalLiked(true);
      setLocalCount((prev) => prev + 1);
    }
  };

  return (
    <div className="flex items-center mt-3 gap-1 text-pink-600">
      {isLoggedIn ? (
        <button
          onClick={localLiked ? handleRemoveLike : handleLike}
          disabled={isPending}
          aria-pressed={localLiked}
          aria-label={localLiked ? "Retirer le like" : "Ajouter un like"}
          className={`flex items-center gap-1 transition-colors duration-200 ${isPending
            ? "opacity-50 pointer-events-none cursor-wait"
            : "hover:text-pink-800 cursor-pointer"
            }`}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 transition-all duration-300 ease-in-out"
            fill={localLiked ? "#D7263D" : "none"}
            stroke="#D7263D"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.172 5.172a4.001 4.001 0 015.656 0L12 8.343l3.172-3.171a4.001 4.001 0 015.656 5.656L12 21.657 3.172 10.828a4.001 4.001 0 010-5.656z"
            />
          </svg>
          <span className="text-black select-none">{localCount}</span>
        </button>
      ) : (
        <div
          title="Connectez-vous pour liker"
          className="flex items-center gap-1 text-gray-400 cursor-not-allowed select-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            stroke="#D7263D"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.172 5.172a4.001 4.001 0 015.656 0L12 8.343l3.172-3.171a4.001 4.001 0 015.656 5.656L12 21.657 3.172 10.828a4.001 4.001 0 010-5.656z"
            />
          </svg>
          <span className="text-black">{localCount}</span>
        </div>
      )}
    </div>
  );
}
