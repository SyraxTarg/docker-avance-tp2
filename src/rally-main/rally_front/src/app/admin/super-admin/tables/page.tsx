import { fetchTypesApi, fetchReasonsApi } from "@/app/fetcher_api";
import TypesAndReasonsList from "../../../components/admin/super-admin/tables/tables_page";

type Props = {
  searchParams: Promise<{
    typeCurrentPage?: string;
    reasonCurrentPage?: string;
  }>;
};

export default async function tablePage({ searchParams }: Props) {
  const {
    typeCurrentPage = "1",
    reasonCurrentPage = "1"
  } = await searchParams;

  const limit = 5;

  const typePage = Number(typeCurrentPage);
  const typeOffset = (typePage - 1) * limit;
  const typesData = await fetchTypesApi(limit, typeOffset);
  const types = typesData.data;
  const typesTotal = typesData.total;
  const typesTotalPages = Math.ceil(typesTotal / limit);

  const reasonPage = Number(reasonCurrentPage);
  const reasonOffset = (reasonPage - 1) * limit;
  const reasonsData = await fetchReasonsApi(limit, reasonOffset);
  const reasons = reasonsData.data;
  const reasonsTotal = reasonsData.total;
  const reasonsTotalPages = Math.ceil(reasonsTotal / limit);

  return (
    <TypesAndReasonsList
      types={types}
      reasons={reasons}
      typesCurrentPage={typePage}
      typesTotalPages={typesTotalPages}
      reasonCurrentPage={reasonPage}
      reasonsTotalPages={reasonsTotalPages}
    />
  )

}