'use client';

import SignalementFiltersModal from './filter_signaled_user_modal';
import { useDisclosure } from "@heroui/modal";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from '../../pagination';
import { deleteReportUser } from './delete_user_report';


interface Reason {
  id: number;
  reason: string;
}

interface Report {
  id: number;
  user_signaled_id: number;
  user_signaled_email: string;
  reason: Reason;
  signaled_by_id: number;
  signaled_by_email: string;
  created_at: string;
}

interface Filters {
  userDate?: string;
  user_signaled_by_user?: string;
  user_user_signaled?: string;
  user_reason_id?: number;
}

interface Props {
  reports: Report[],
  filters: Filters;
  currentPage: number;
  totalPages: number;
  reasons: Reason[];
}

export default function ReportedUsersTable({
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
    const params = new URLSearchParams(searchParams.toString());

    if (filters.userDate) {
      params.set("userDate", filters.userDate.toString());
    } else {
      params.delete("userDate");
    }

    if (filters.user_signaled_by_user) {
      params.set("user_signaled_by_user", filters.user_signaled_by_user.toString());
    } else {
      params.delete("user_signaled_by_user");
    }

    if (filters.user_user_signaled) {
      params.set("user_user_signaled", filters.user_user_signaled.toString());
    } else {
      params.delete("user_user_signaled");
    }

    if (filters.user_reason_id) {
      params.set("user_reason_id", filters.user_reason_id.toString());
    } else {
      params.delete("user_reason_id");
    }

    params.set("userCurrentPage", "1");

    router.push(`/admin/signalements?${params.toString()}`, { scroll: false });
  };



  const handlePagination = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("userCurrentPage", page.toString());

    router.push(`/admin/signalements?${params.toString()}`, { scroll: false });
  };



  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {/* Bouton filtres */}
      <div className="mb-6 text-right">
        <button
          onClick={onOpen}
          className="px-5 py-2 bg-[#4338CA] hover:bg-[#6366F1] text-white text-sm font-medium rounded-lg transition shadow cursor-pointer"
        >
          Filtres
        </button>
      </div>

      {/* Table en desktop */}
      <div className="hidden sm:block rounded-xl shadow overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Utilisateur signalé</th>
                <th className="px-6 py-3">Signalé par</th>
                <th className="px-6 py-3">Raison</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {reports.map((report) => (
                <tr key={report.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{report.id}</td>
                  <td className="px-6 py-4">{report.user_signaled_email}</td>
                  <td className="px-6 py-4">{report.signaled_by_email}</td>
                  <td className="px-6 py-4">{report.reason.reason}</td>
                  <td className="px-6 py-4">{new Date(report.created_at).toLocaleString('fr-FR')}</td>
                  <td className="flex gap-2 px-6 py-4">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                      onClick={() => {
                        if (confirm("Supprimer cet utilisateur ?")) {
                          deleteReportUser(report.id, true);
                        }
                      }}
                    >
                      Bannir user
                    </button>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition"
                      onClick={() => {
                        if (confirm("Supprimer ce signalement ?")) {
                          deleteReportUser(report.id, false);
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

      {/* Format mobile */}
      <div className="sm:hidden space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Signalement #{report.id}</div>
            <div className="text-sm text-gray-600">
              <strong>Utilisateur signalé :</strong> {report.user_signaled_email}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Signalé par :</strong> {report.signaled_by_email}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Raison :</strong> {report.reason.reason}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Date :</strong> {new Date(report.created_at).toLocaleString('fr-FR')}
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

      <SignalementFiltersModal
        isOpen={isOpen}
        initialFilters={filters}
        onApply={handleApplyFilters}
        onClose={onClose}
        reasons={reasons}
      />
    </div>
  );
}
