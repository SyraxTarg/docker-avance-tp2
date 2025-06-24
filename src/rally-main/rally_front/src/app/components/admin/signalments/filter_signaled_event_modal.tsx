'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectItem } from '@heroui/select';
import { z } from 'zod';

// Zod schema de validation
const filtersSchema = z.object({
  eventDate: z.string().optional(),
  event_signaled_by_user: z.string().email().optional(),
  event_email_user: z.string().email().optional(),
  event_reason_id: z.number().optional()
});

type Filters = z.infer<typeof filtersSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
  reasons: Reason[];
};

interface Reason {
  id: number;
  reason: string;
}

export default function SignalementEventFiltersModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  reasons
}: Props) {
  const [filters, setFilters] = useState<Filters>({});
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters || {});

      if (initialFilters.event_reason_id) {
        const found = reasons.find((r) => r.id === initialFilters.event_reason_id);
        setSelectedReason(found || null);
      } else {
        setSelectedReason(null);
      }
    }
  }, [isOpen, initialFilters, reasons]);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = filtersSchema.safeParse(filters);

    if (!parsed.success) {
      console.error('Erreur de validation Zod', parsed.error.format());
      return;
    }

    onApply(parsed.data);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    setSelectedReason(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={handleApply}
        className="relative z-50 max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800 dark:text-white">Date</label>
          <input
            type="date"
            value={filters.eventDate || ''}
            onChange={(e) => setFilters((f) => ({ ...f, eventDate: e.target.value }))}
            className="border border-gray-300 p-2.5 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Signalé par */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800 dark:text-white">Signalé par</label>
          <input
            type="text"
            placeholder="email"
            value={filters.event_signaled_by_user || ''}
            onChange={(e) => setFilters((f) => ({ ...f, event_signaled_by_user: e.target.value }))}
            className="border border-gray-300 p-2.5 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Utilisateur signalé */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800 dark:text-white">
            Auteur de l&apos;évènement signalé
          </label>
          <input
            type="text"
            placeholder="email"
            value={filters.event_email_user || ''}
            onChange={(e) => setFilters((f) => ({ ...f, event_email_user: e.target.value }))}
            className="border border-gray-300 p-2.5 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Raison */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800 dark:text-white">Raison</label>
          <Select
            id="reason"
            className="w-full"
            placeholder="Sélectionnez une raison"
            selectedKeys={new Set(selectedReason ? [selectedReason.id.toString()] : [])}
            aria-label="Sélectionnez une raison"
            variant="bordered"
            onSelectionChange={(key) => {
              const selectedId = Array.from(key)[0];
              const found = reasons.find((r) => r.id.toString() === selectedId);
              setSelectedReason(found || null);
              setFilters((f) => ({
                ...f,
                event_reason_id: found ? found.id : undefined
              }));
            }}
            classNames={{
              trigger:
                "bg-white text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:border-[#4338CA] transition-all",
              listboxWrapper: "rounded-lg border border-gray-200 shadow-md bg-white",
              listbox: "p-1",
              popoverContent: "z-50"
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

        {/* Boutons */}
        <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-lg transition shadow"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            className="bg-[#4338CA] hover:bg-[#6366F1] focus:ring-4 focus:ring-[#6366F1] font-semibold px-6 py-2 rounded-lg transition shadow cursor-pointer"
          >
            Filtrer
          </button>
        </div>
      </form>
    </div>
  );
}
