import Image from "next/image";

type AvatarProps = {
  src?: string;
  alt?: string;
};

export default function Avatar({ src, alt = "Avatar" }: AvatarProps) {
  return (
    <div
      className="
        relative
        rounded-full
        cursor-pointer
        transition-transform duration-200
        hover:scale-105
        w-5 h-5
        sm:w-6 sm:h-6
        md:w-7 md:h-7
        lg:w-8 lg:h-8
        xl:w-10 xl:h-10
        overflow-hidden
      "
    >
      <Image
        src={src || "/pfps/default.jpg"}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        sizes="(max-width: 640px) 1.25rem, (max-width: 768px) 1.5rem, (max-width: 1024px) 1.75rem, (max-width: 1280px) 2rem, 2.5rem"
      />
    </div>
  );
}
