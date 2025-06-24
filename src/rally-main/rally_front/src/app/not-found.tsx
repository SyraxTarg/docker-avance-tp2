'use client';
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold text-rose-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oups ! La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className="text-white bg-rose-600 px-4 py-2 rounded-md hover:bg-rose-700 transition">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
