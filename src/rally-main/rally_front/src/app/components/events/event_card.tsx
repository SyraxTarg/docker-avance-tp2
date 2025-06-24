import Image from "next/image";
import LikeButton from "../likes/like_button";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { Chip } from "@heroui/chip";

type CardProps = {
  title: string;
  username: string;
  address: string;
  price: number;
  nb_likes: number;
  pictureUrl?: string;
  description: string;
  isLoggedIn: boolean;
  event_id: number;
  organizer_id: number;
  types: {
    id: number;
    type: string;
  }[];
  isLiked: boolean;
};

export default function Card({
  title,
  username,
  address,
  price,
  nb_likes,
  pictureUrl,
  isLoggedIn,
  event_id,
  organizer_id,
  description,
  types,
  isLiked
}: CardProps) {
  const router = useRouter();
  console.log(pictureUrl)
  return (
    <>
      <div
        className="rounded-2xl shadow-md bg-white overflow-hidden max-w-xs transition-shadow hover:shadow-lg"
      >
        {/* Image */}
        <div className="w-full h-32 relative">
          <Image
            src={pictureUrl || "/no_pic.jpg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 250px"
          />
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-gray-400 italic text-sm">
            <Link
              href={`/profiles/${organizer_id}`}
              className="text-[#0F172A] hover:underline transition-colors"
            >
              @{username}
            </Link>
          </p>
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {address}
          </p>
          <p className="text-sm text-gray-700 mt-2 line-clamp-3">
            {description}
          </p>

          {/* Prix avec icône ticket */}
          <div className="flex items-center mt-2 gap-2 text-[#D7263D] font-semibold">
            <span>{price}€</span>
          </div>

          {/* Likes avec icône cœur */}
          <LikeButton
            event_id={event_id}
            nb_likes={nb_likes}
            isLoggedIn={isLoggedIn}
            liked={isLiked}
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 p-2">
          {
            types.map((type) => (
              <Chip
                key={type.id}
                variant="solid"
                color="default"
                className="text-xs font-semibold bg-[#CBD5E1] text-[#0F172A] px-3 py-1 rounded-full"
              >
                {type.type}
              </Chip>
            ))
          }
        </div>
        <div className="px-4 pb-4">
          <button
            onClick={() => router.push(`/events/${event_id}`)}
            className="w-full bg-[#4338CA] hover:bg-[#6366F1] text-white font-semibold py-2 px-4 rounded-xl mt-2 transition-colors duration-200 cursor-pointer"
          >
            Voir plus
          </button>
        </div>

      </div>
    </>
  );
}
