import Image from "next/image";
import { useRouter } from "next/navigation";

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    photo: string;
    nb_like: number;
    created_at: string;
}

export default function ProfileCard({ profile }: { profile: Profile }) {
    const router = useRouter();

    const formattedDate = new Date(profile.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="cursor-pointer p-4 max-w-xs" onClick={() => router.push(`/profiles/${profile.id}`)}>
            <div className="rounded-2xl border bg-white px-6 pt-10 pb-8 shadow-xl transition hover:shadow-2xl w-full">
                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden">
                    <span className="absolute right-0 bottom-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white z-10"></span>
                    <Image
                        src={profile.photo}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        fill
                        className="object-cover"
                    />
                </div>

                <h1 className="mt-4 text-center text-xl font-bold text-gray-900">
                    {profile.first_name} {profile.last_name}
                </h1>
                <h3 className="text-center text-sm font-medium text-gray-600 truncate">
                    {profile.email}
                </h3>

                <ul className="mt-5 divide-y rounded-lg bg-gray-100 py-2 px-4 text-gray-700 shadow">
                    <li className="flex justify-between py-3 text-sm">
                        <span>Nombre de likes</span>
                        <span className="rounded-full px-2 py-1 text-xs font-medium text-green-700">
                            {profile.nb_like}
                        </span>
                    </li>
                    <li className="flex justify-between py-3 text-sm">
                        <span>Depuis le</span>
                        <span>{formattedDate}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
  
