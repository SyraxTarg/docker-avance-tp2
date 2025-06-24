'use client';

import { deleteReport } from './delete_event_report';
import SignalementEventFiltersModal from './filter_signaled_event_modal';
import { useRouter, useSearchParams } from "next/navigation";
import { useDisclosure } from '@heroui/modal';
import Pagination from '../../pagination';

interface Report {
  id: number;
  event: {
    id: number;
    title: string;
    profile: {
      email: string;
    };
  };
  reason: {
    id: number;
    reason: string;
  };
  user_id: number;
  created_at: string;
}

interface Reason {
  id: number;
  reason: string;
}

interface Filters {
  eventDate?: string;
  event_signaled_by_user?: string;
  event_email_user?: string;
  event_reason_id?: number;
}


interface Props {
  reports: Report[],
  filters: Filters;
  currentPage: number;
  totalPages: number;
  reasons: Reason[];
}


export default function ReportedEventsTable({
  reports,
  filters,
  currentPage,
  totalPages,
  reasons
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleApplyFilters = (filters: Filters) => {
    console.log(filters);
    const params = new URLSearchParams();

    if (filters.eventDate) {
      params.set("eventDate", filters.eventDate.toString());
    }
    if (filters.event_signaled_by_user) {
      params.set("event_signaled_by_user", filters.event_signaled_by_user.toString());
    }
    if (filters.event_email_user) {
      params.set("event_email_user", filters.event_email_user.toString());
    }
    if (filters.event_reason_id) {
      params.set("event_reason_id", filters.event_reason_id.toString());
    }

    params.set("eventCurrentPage", "1");

    router.push(`/admin/signalements?${params.toString()}`, { scroll: false });
  };


  const handlePagination = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("eventCurrentPage", page.toString());

    router.push(`/admin/signalements?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h2>Evènements signalés</h2>
      <div className="mb-6 text-right">
        <button
          onClick={onOpen}
          className="px-5 py-2 bg-[#4338CA] hover:bg-[#6366F1] text-white text-sm font-medium rounded-lg transition shadow cursor-pointer"
        >
          Filtres
        </button>
      </div>

      {/* Table desktop */}
      <div className="hidden sm:block rounded-xl shadow overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Événement</th>
                <th className="px-6 py-3">Créateur</th>
                <th className="px-6 py-3">Raison</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {reports.map((report) => (
                <tr key={report.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{report.id}</td>
                  <td className="px-6 py-4">{report.event.title}</td>
                  <td className="px-6 py-4">{report.event.profile.email}</td>
                  <td className="px-6 py-4">{report.reason.reason}</td>
                  <td className="px-6 py-4">{new Date(report.created_at).toLocaleString('fr-FR')}</td>
                  <td className="flex gap-2 px-6 py-4">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                      onClick={() => {
                        if (confirm('Es-tu sûr de vouloir bannir le créateur de cet événement ?')) {
                          deleteReport(report.id, true);
                        }
                      }}
                    >
                      Supprimer l&apos;évènement
                    </button>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                      onClick={() => {
                        if (confirm('Rejeter ce signalement ?')) {
                          deleteReport(report.id, false);
                        }
                      }}
                    >
                      Rejeter signalement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cartes mobile */}
      <div className="sm:hidden space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow p-4 space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
              <span>ID: {report.id}</span>
            </div>
            <div className="text-gray-800 text-sm">
              <strong>Événement:</strong>
              <p className="mt-1">{report.event.title}</p>
            </div>
            <div className="text-sm text-gray-700">
              <strong>Créateur:</strong> {report.event.profile.email}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Raison:</strong> {report.reason.reason}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Date:</strong> {new Date(report.created_at).toLocaleString('fr-FR')}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                onClick={() => {
                  if (confirm('Es-tu sûr de vouloir bannir le créateur de cet événement ?')) {
                    deleteReport(report.id, true);
                  }
                }}
              >
                Supprimer
              </button>
              <button
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                onClick={() => {
                  if (confirm('Rejeter ce signalement ?')) {
                    deleteReport(report.id, false);
                  }
                }}
              >
                Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="col-span-full flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => handlePagination(page)}
          />
        </div>
      )}

      <SignalementEventFiltersModal
        isOpen={isOpen}
        initialFilters={filters}
        onApply={handleApplyFilters}
        onClose={onClose}
        reasons={reasons}
      />
    </div>
  );
}
