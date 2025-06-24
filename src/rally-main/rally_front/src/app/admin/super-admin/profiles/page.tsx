import { fetchProfilesSuperAdminApi } from "@/app/fetcher_api";
import ProfileBackOffice from "../../../components/admin/profiles/profiles_page";


interface Props {
  searchParams: Promise<{
    currentPage: string;
    search: string;
    role: string;
    is_planner: string;
    nb_like: string;
  }>;
}
export default async function ProfilesPage({ searchParams }: Props) {
  const {
    currentPage = "1",
    search,
    role,
    is_planner,
    nb_like,
  } = await searchParams;


  const filters = {
    search,
    role,
    is_planner: is_planner === "true" ? true : is_planner === "false" ? false : undefined,
    nb_like,
  };

  const limit = 1;

  const page = Number(currentPage);
  const offset = (page - 1) * limit;
  const data = await fetchProfilesSuperAdminApi(limit, offset, filters);
  const profiles = data.data;
  const total = data.total;
  const totalPages = Math.ceil(total / limit);

  return (
    <ProfileBackOffice
      profiles={profiles}
      currentPage={page}
      totalPages={totalPages}
      filters={filters}
    />
  )
}