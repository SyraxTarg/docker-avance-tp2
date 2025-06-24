"use client";
import Image from "next/image";
import { useState } from "react";

type CarousselProps = {
  event_id: number;
  photos: {
    id: number;
    photo: string;
  }[];
};

export default function Caroussel({ event_id, photos }: CarousselProps) {
  const [current, setCurrent] = useState(0);
  const total = photos.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  return (
    <div className="relative w-full">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {photos.length === 0 ? (
          <Image
            src="/no_pic.jpg"
            alt={`photo placeholder pour événement ${event_id}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <Image
            key={photos[current].id}
            src={photos[current].photo}
            alt={`photo ${current + 1} pour événement ${event_id}`}
            fill
            className="object-cover transition-opacity duration-700 ease-in-out"
            priority={current === 0} // priorité uniquement sur la première image
          />
        )}
      </div>

      {/* Indicators */}
      {total > 1 && (
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === current ? "bg-white" : "bg-white/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Prev/Next buttons */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            aria-label="fleche gauche"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
              <svg className="w-4 h-4 text-white" viewBox="0 0 6 10" fill="none">
                <path
                  d="M5 1L1 5l4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            aria-label="fleche droite"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
              <svg className="w-4 h-4 text-white" viewBox="0 0 6 10" fill="none">
                <path
                  d="M1 9l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
