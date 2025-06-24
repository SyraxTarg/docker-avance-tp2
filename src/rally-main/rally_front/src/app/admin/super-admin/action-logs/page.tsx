
import { fetchLogsApi } from "@/app/fetcher_api";
import LogsPage from "../../../components/admin/super-admin/action-logs/log_page";

type Props = {
  searchParams: Promise<{
    curentPage?: string;
    date?: string;
    action_type?: string;
    log_type?: string;
  }>
};


export default async function Logs({ searchParams }: Props) {
  const {
    curentPage = "1",
    date,
    action_type,
    log_type
  } = await searchParams;

  const filters = {
    date,
    action_type,
    log_type
  };

  const limit = 10;

  const page = Number(curentPage);
  const offset = (page - 1) * limit;
  const data = await fetchLogsApi(limit, offset, filters);
  const logs = data.data;
  const total = data.total;
  const totalPages = Math.ceil(total / limit);

  return (
    <LogsPage
      logs={logs}
      currentPage={page}
      totalPages={totalPages}
      filters={filters}
    />
  );
}
