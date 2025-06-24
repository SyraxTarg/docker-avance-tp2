import { fetchCommentsApi } from "@/app/fetcher_api";
import AdminComments from "@/app/components/admin/comments/comments_table";

interface Props {
  searchParams: Promise<{
    search?: string;
    date?: string;
    email?: string;
    event_email?: string;
    currentPage?: string;
  }>;
}

export default async function Comments({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;

  const {
    search,
    date,
    email,
    event_email,
    currentPage = "1",
  } = resolvedSearchParams;

  const limit = 1;
  const page = Number(currentPage);
  const offset = (page - 1) * limit;

  const commentFilters = {
    search,
    date,
    email,
    event_email,
  };

  const data = await fetchCommentsApi(limit, offset, commentFilters);
  const comments = data.data;
  const total = data.total;
  const totalPages = Math.ceil(total / limit);

  return (
    <AdminComments
      comments={comments}
      currentPage={page}
      totalPages={totalPages}
      filters={commentFilters}
    />
  );
}
