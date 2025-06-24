"use client";

import React, { useState } from "react";
import Pagination from "@/app/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { createtype } from "../../../../admin/super-admin/tables/server_actions/create_type";
import { createReason } from "../../../../admin/super-admin/tables/server_actions/create_reason";
import { z } from "zod";

const typeSchema = z.string().trim().min(1, "Le type ne peut pas être vide.").max(50, "50 caractères maximum.");
const reasonSchema = z.string().trim().min(1, "La raison ne peut pas être vide.").max(50, "50 caractères maximum.");

interface Reason {
  id: number;
  reason: string;
}

interface Type {
  id: string;
  type: string;
}

interface Props {
  types: Type[];
  reasons: Reason[];
  typesCurrentPage: number;
  typesTotalPages: number;
  reasonCurrentPage: number;
  reasonsTotalPages: number;
}

export default function TypesAndReasonsList({
  types,
  reasons,
  typesCurrentPage,
  typesTotalPages,
  reasonCurrentPage,
  reasonsTotalPages
}: Props) {
  const [newType, setNewType] = useState("");
  const [newReason, setNewReason] = useState("");
  const [typeError, setTypeError] = useState<string | null>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = typeSchema.safeParse(newType);
    if (!result.success) {
      setTypeError(result.error.issues[0].message);
      return;
    }

    setTypeError(null);
    const params = new URLSearchParams(searchParams.toString());
    await createtype(result.data);
    router.push(`/admin/super-admin/tables?${params.toString()}`, { scroll: false });
    setNewType("");
  };

  const handleAddReason = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = reasonSchema.safeParse(newReason);
    if (!result.success) {
      setReasonError(result.error.issues[0].message);
      return;
    }

    setReasonError(null);
    const params = new URLSearchParams(searchParams.toString());
    await createReason(result.data);
    router.push(`/admin/super-admin/tables?${params.toString()}`);
    setNewReason("");
  };

  const handleTypePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("typeCurrentPage", page.toString());
    router.push(`/admin/super-admin/tables?${params.toString()}`, { scroll: false });
  };

  const handleReasonPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("reasonCurrentPage", page.toString());
    router.push(`/admin/super-admin/tables?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="p-8 space-y-16 bg-gray-50 min-h-screen">
      {/* Types */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-[#0F172A]">Types</h2>

        <form onSubmit={handleAddType} className="mb-6 flex flex-wrap items-start gap-4">
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Nouveau type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className={`border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 ${typeError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#6366F1]"
                }`}
            />
            {typeError && <p className="text-sm text-red-600 mt-1">{typeError}</p>}
          </div>
          <button
            type="submit"
            className="bg-[#4338CA] hover:bg-[#6366F1] focus:ring-4 focus:ring-[#6366F1] text-white px-6 py-2 rounded-lg font-semibold transition cursor-pointer"
          >
            Ajouter
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-left text-sm rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b">ID</th>
                <th className="px-6 py-3 border-b">Type</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr key={type.id} className="border-b bg-white hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{type.id}</td>
                  <td className="px-6 py-4">{type.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={typesCurrentPage}
          totalPages={typesTotalPages}
          onPageChange={handleTypePageChange}
        />
      </div>

      {/* Raisons */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-[#0F172A]">Raisons</h2>

        <form onSubmit={handleAddReason} className="mb-6 flex flex-wrap items-start gap-4">
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Nouvelle raison"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className={`border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 ${reasonError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#6366F1]"
                }`}
            />
            {reasonError && <p className="text-sm text-red-600 mt-1">{reasonError}</p>}
          </div>
          <button
            type="submit"
            className="bg-[#4338CA] hover:bg-[#6366F1] focus:ring-4 focus:ring-[#6366F1] text-white px-6 py-2 rounded-lg font-semibold transition cursor-pointer"
          >
            Ajouter
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-left text-sm rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b">ID</th>
                <th className="px-6 py-3 border-b">Raison</th>
              </tr>
            </thead>
            <tbody>
              {reasons.map((reason) => (
                <tr key={reason.id} className="border-b bg-white hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{reason.id}</td>
                  <td className="px-6 py-4">{reason.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={reasonCurrentPage}
          totalPages={reasonsTotalPages}
          onPageChange={handleReasonPageChange}
        />
      </div>
    </div>
  );
}
