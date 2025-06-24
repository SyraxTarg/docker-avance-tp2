"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Select, SelectItem } from "@heroui/select";
import { toast } from "react-toastify";
import { createSignaledComment } from "@/app/events/[event_id]/server_actions/create_signaled_comment";
interface SignalCommentModalProps {
  isOpen: boolean;
  comment_id: number;
  onClose: () => void;
  reasons: Reason[];
}

interface Reason {
  id: number;
  reason: string;
}

export default function SignalCommentModal({ isOpen, comment_id, onClose, reasons }: SignalCommentModalProps) {
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);
  console.log(reasons);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const onSignal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedReason) return;

    try {
      await createSignaledComment(selectedReason.id, comment_id);
      toast.success(`Le commentaire a été signalé pour raison : ${selectedReason.reason}`)
      onClose();
    } catch (error) {
      console.error("Erreur lors du signalement :", error);
      toast.error(`Erreur lors du signalement : ${error}`)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <form
        onSubmit={onSignal}
        className="relative bg-white rounded-xl shadow-xl z-50 p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-lg font-semibold mb-4">
          Pourquoi signaler ce commentaire ?
        </h2>

        <div className="flex w-full flex-col gap-2 mb-6">
          <label htmlFor="reason" className="text-sm font-medium text-gray-700">
            Raison du signalement
          </label>
          <div className="relative">
            <Select
              id="reason"
              className="w-full"
              placeholder="Sélectionnez une raison"
              selectedKeys={new Set(selectedReason ? [selectedReason.id.toString()] : [])}
              variant="bordered"
              aria-label="Sélectionnez une raison"
              onSelectionChange={(key) => {
                const selectedId = Array.from(key)[0];
                const found = reasons.find((r) => r.id.toString() === selectedId);
                setSelectedReason(found || null);
              }}
              classNames={{
                trigger:
                  "bg-white text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#123c69] focus:border-[#123c69] transition-all",
                listboxWrapper: "rounded-lg border border-gray-200 shadow-md bg-white",
                listbox: "p-1",
                popoverContent: "z-50",
              }}
            >
              {reasons.map((reason) => (
                <SelectItem
                  aria-label={reason.reason}
                  key={reason.id.toString()}
                  className="hover:bg-gray-100 text-sm px-2 py-1 cursor-pointer rounded"
                >
                  {reason.reason}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 disabled:bg-gray-300"
            disabled={!selectedReason}
          >
            Signaler
          </button>
        </div>
      </form>
    </div>
  );
}
