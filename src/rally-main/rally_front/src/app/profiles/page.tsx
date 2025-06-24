
import { fetchProfilesPlannerApi } from "@/app/fetcher_api";
import PlannersPage from "../components/profiles/profiles_page";

type Props = {
  searchParams: Promise<{
    currentPage: string;
    search: string;
  }>;
}

export default async function ProfilesPlanner({ searchParams }: Props) {
  const limit = 1;

  const {
    currentPage = '1',
    search
  } = await searchParams;

  const filters = {
    search
  };

  {/*FETCH Profiles Planners*/ }
  const profilesCurrentPage = Number(currentPage);
  const offset = (profilesCurrentPage - 1) * limit;
  const res = await fetchProfilesPlannerApi(limit, offset, filters);
  const profiles = res.data;
  const totalPages = res.total;


  return (
    <>
      <main className="pt-16">
        <PlannersPage profiles={profiles} currentPage={profilesCurrentPage} totalPages={totalPages} />
      </main>

    </>
  );
}
