import {
  fetchProfileApi,
  fetchEventsProfileApi,
  fetchMeApi,
  fetchReasonsApi
} from "@/app/fetcher_api";
import ProfilePage from "../../components/profiles/profile_page";
import PrivateProfilePage from "@/app/components/profiles/profile_page_private";
import { notFound } from "next/navigation";


type ProfilePageProps = {
  params: Promise<{ profile_id: string }>;
  searchParams: Promise<{
    eventCurrentPage?: string;
  }>;
};


export default async function Profile({
  params,
  searchParams,
}: ProfilePageProps) {
  const user = await fetchMeApi();

  const {
    eventCurrentPage = "1"
  } = await searchParams;
  const { profile_id } = await params;

  const profile = await fetchProfileApi(Number(profile_id));

  if (!profile) {
    notFound();
  }
  const currentPageEvents = Number(eventCurrentPage);
  const limit = 1;
  const eventOffset = (currentPageEvents - 1) * limit;

  const eventsData = await fetchEventsProfileApi(profile.id, eventOffset, limit);
  const events = eventsData.data;
  const totalPagesEvents = eventsData.total;

  const reasonsData = await fetchReasonsApi();
  const reasons = reasonsData.data;

  return (
    <div className="pt-16">
      {
        profile.user.is_planner ?

          <ProfilePage
            profile={profile}
            profileEvents={events}
            totalPages={totalPagesEvents}
            currentPage={currentPageEvents}
            user={user}
            reasons={reasons}
          />
          :
          <PrivateProfilePage
            profile={profile}
            user={user}
            reasons={reasons}
          />
      }
    </div>

  );
}
