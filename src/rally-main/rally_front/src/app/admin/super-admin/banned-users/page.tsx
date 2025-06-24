import { fetchbannedUsersApi } from "@/app/fetcher_api";
import BannedUsersTable from "@/app/components/admin/super-admin/banned-users/banned_users_table";

type Props = {
  searchParams: Promise<{
    curentPage?: string;
  }>
};


export default async function BannedUsersPage({ searchParams }: Props) {

  const {
    curentPage = "1",
  } = await searchParams;

  const limit = 1;
  const page = Number(curentPage);
  const data = await fetchbannedUsersApi(0, limit);
  const users = data.data;
  const total = data.total;
  const totalPages = Math.ceil(total / limit);

  return (
    <BannedUsersTable
      bannedUsers={users}
      currentPage={page}
      totalPages={totalPages}
    />
  );

}