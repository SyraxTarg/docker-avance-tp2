"use client";

import Image from "next/image";
import { useDisclosure } from "@heroui/modal";
import SignalUserModal from "@/app/components/profiles/SignalingUsers";

interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  created_at: string;
  user: {
    id: number;
    is_planner: boolean;
  };
}

interface Reason {
  id: number;
  reason: string;
}

interface Props {
  profile: Profile;
  user: Profile;
  reasons: Reason[];
}

export default function PrivateProfilePage({ profile, user, reasons }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="relative flex flex-col md:flex-row items-center justify-between p-8 bg-white shadow-lg rounded-2xl">
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
          <p className="text-3xl font-bold text-gray-900">
            {profile.first_name} {profile.last_name}
          </p>
          <p className="text-gray-600 text-sm">
            Membre depuis le {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Bouton signalement */}
        {user && (
          <button
            onClick={onOpen}
            title="Signaler"
            aria-label="Signaler l’utilisateur"
            className="flex items-center justify-center absolute top-4 right-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 hover:text-red-500 transition-colors"
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
      </div>

      {/* Message profil privé avec icône */}
      <div className="mt-12 flex flex-col items-center text-gray-600 text-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 mb-2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0V10.5M4.5 10.5h15a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z"
          />
        </svg>
        <p>Ce profil est privé. Aucune information publique supplémentaire n’est disponible.</p>
      </div>

      <SignalUserModal isOpen={isOpen} onClose={onClose} user_id={profile.id} reasons={reasons} />
    </div>
  );
}
