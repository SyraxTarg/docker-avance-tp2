import { fetchProfilesApi } from "@/app/fetcher_api";
import AdminProfiles from "../../components/admin/users/user_table";


interface Props {
    searchParams: Promise<{
        search?: string;
        role?: string;
        is_planner?: string;
        nb_like?: string;
        currentPage?: string
    }>;
}


export default async function Users({ searchParams }: Props) {
    const limit = 1;
    const {
        search,
        role,
        is_planner,
        nb_like,
        currentPage = "1",
    } = await searchParams;

    const isPlannerBool =
        is_planner === "true" ? true : is_planner === "false" ? false : undefined;

    const userFilters = {
        search,
        role,
        is_planner: isPlannerBool,
        nb_like,
    };

    const page = Number(currentPage);
    const offset = (page - 1) * limit;

    const data = await fetchProfilesApi(limit, offset, userFilters);
    const profiles = data.data;
    const total = data.total;
    const totalPages = Math.ceil(total / limit);

    return (
        <>
            <AdminProfiles
                profiles={profiles}
                currentPage={page}
                filters={userFilters}
                totalPages={totalPages}
            />
        </>
    );
}
