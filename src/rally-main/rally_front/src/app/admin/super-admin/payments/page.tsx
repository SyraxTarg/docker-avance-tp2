import { fetchPaymentsApi } from "@/app/fetcher_api";
import PaymentsBackOffice from "../../../components/admin/super-admin/payments/payments_page";

interface PaymentsPageProps {
  searchParams: Promise<{
    curentPage?: string;
    buyer_email?: string;
    date_avant?: string;
    date_apres?: string;
    brut_amount_min?: string;
    brut_amount_max?: string;
    status?: string;
    organizer_email?: string;
  }>;
}


export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {

  const {
    curentPage = "1",
    buyer_email,
    date_avant,
    date_apres,
    brut_amount_min,
    brut_amount_max,
    status,
    organizer_email
  } = await searchParams;

  const filters = {
    buyer_email,
    date_avant,
    date_apres,
    brut_amount_min: brut_amount_min ? Number(brut_amount_min) : undefined,
    brut_amount_max: brut_amount_max ? Number(brut_amount_max) : undefined,
    status,
    organizer_email
  };

  const limit = 10;

  const page = Number(curentPage);
  const offset = (page - 1) * limit;
  const data = await fetchPaymentsApi(limit, offset, filters);
  const payments = data.data;
  const total = data.total;
  const totalPages = Math.ceil(total / limit);

  return (
    <PaymentsBackOffice
      payments={payments}
      currentPage={page}
      filters={filters}
      totalPages={totalPages}
    />
  );

}