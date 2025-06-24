import SingleEventPage from "@/app/components/events/event_page";
import {
  fetchEventApi,
  fetchCommentsEventApi,
  fetchPlacesTakenEvent,
  fetchMeApi,
  isRegisteredApi,
  fetchMyEventsRegistrationsApi,
  fetchTypesApi,
  fetchReasonsApi
} from "@/app/fetcher_api";
import { notFound } from "next/navigation";


type Registration = {
  id: number;
  event_id: number;
  event_title: string;
  registered_at: string;
  payment_status: string;
  profile?: {
      id: number;
      first_name: string;
      last_name: string;
      photo: string;
      nb_like: number;
      email: string;
      created_at: string;
  };
};


interface Props {
  params: Promise<{
    event_id: string;
  }>;
  searchParams: Promise<{
    commentCurrentPage?: string;
    myERCurrentPage?: string;
  }>;
}

export default async function EventPage({ params, searchParams }: Props) {
  const { event_id } = await params;
  const limit = 1;

  const {
    commentCurrentPage = "1",
    myERCurrentPage = "1"
  } = await searchParams;

  const currentPageComments = Number(commentCurrentPage);
  const commentOffset = (currentPageComments - 1) * limit;

  const user = await fetchMeApi();

  const [
    event,
    data_comments,
    places,
    typesData,
    reasonsData
  ] = await Promise.all([
    fetchEventApi(Number(event_id)),
    fetchCommentsEventApi(Number(event_id), limit, commentOffset),
    fetchPlacesTakenEvent(Number(event_id)),
    fetchTypesApi(),
    fetchReasonsApi()
  ]);

  if (!event) {
    notFound();
  }

  const comments = data_comments.data;
  const totalComments = data_comments.total;

  let isRegistered = false;
  let myER: Registration[] = [];
  let totalER = 0;
  const currentPageMyER = Number(myERCurrentPage);

  if (user) {
    const [isRegisteredData, myER_data] = await Promise.all([
      isRegisteredApi(Number(event_id)),
      user.id === event.profile.id
        ? fetchMyEventsRegistrationsApi(Number(event_id), (currentPageMyER - 1) * limit, limit)
        : Promise.resolve({ data: [], total: 0 })
    ]);

    isRegistered = isRegisteredData.registered;
    myER = myER_data.data;
    totalER = myER_data.total;
  }

  const totalPagesComments = Math.ceil(totalComments / limit);
  const totalPagesRegistrations = Math.ceil(totalER / limit);
  const types = typesData.data;
  const reasons = reasonsData.data;

  return (
    <div className="pt-16">
      <SingleEventPage
        event={event}
        comments={comments}
        commentCount={totalComments}
        placesTaken={places.number}
        user={user ?? null}
        isRegistered={isRegistered}
        currentPageComments={currentPageComments}
        totalCommentsPages={totalPagesComments}
        myERegistrations={myER}
        currentPageMyER={currentPageMyER}
        totalMyERPages={totalPagesRegistrations}
        types={types}
        reasons={reasons}
      />
    </div>
  );
}
