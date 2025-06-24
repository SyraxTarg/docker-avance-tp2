import { cookies } from "next/headers";

const NEXT_PUBLIC_RALLY_BACK_HOST = process.env.NEXT_PUBLIC_RALLY_BACK_HOST;

export async function fetchApi(route: string, method: string = "GET", body?: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user_access_token')?.value;

    let headers: Record<string, string> = { "Content-Type": "application/json", }
    if (token) {
      headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }
    const res = await fetch(`${NEXT_PUBLIC_RALLY_BACK_HOST}${route}`, {
      method: method,
      headers: headers,
      body: body
    });

    if (!res.ok) {
      console.error("Échec du chargement des données", res, route);
      return;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
}


export async function fetchMyProfileApi() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user_access_token')?.value;

    const res = await fetch(`${NEXT_PUBLIC_RALLY_BACK_HOST}/profiles/me`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });


    return res;
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
}


export async function verifyTokenApi() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user_access_token')?.value;

    const res = await fetch(`${NEXT_PUBLIC_RALLY_BACK_HOST}/authent/verify`, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });


    return res;
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
}

export async function refreshTokenApi() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user_refresh_token')?.value;

    if (!token) {
      console.warn("Aucun refresh token trouvé.");
      return null;
    }

    const res = await fetch(`${NEXT_PUBLIC_RALLY_BACK_HOST}/authent/refresh`, {
      method: "POST",
      headers: {
        "refresh-token": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Échec du chargement des données", res);
      return;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
}


export async function uploadPictureApi(body: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_refresh_token')?.value;

    if (!token) {
      console.warn("Aucun refresh token trouvé.");
      return null;
    }

    const res = await fetch(`${NEXT_PUBLIC_RALLY_BACK_HOST}/pictures/`, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${token}`,
      },
      body,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Échec du chargement des données KJFE:", res.status, errorText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Erreur réseau :", err);
    return null;
  }
}



export async function fetchCommentsEventApi(event_id: number, limit: number, offset: number) {
  return await fetchApi(`/comments/events/${event_id}?limit=${limit}&offset=${offset}`)
}

export async function isRegisteredApi(event_id: number) {
  return await fetchApi(`/registrations/is-registered?event_id=${event_id}`)
}

export async function fetchbannedUsersApi(offset: number, limit: number) {
  return await fetchApi(`/bannedUsers/?limit=${limit}&offset=${offset}`)
}

export async function fetchFailedLoginsApi(offset: number, limit: number) {
  return await fetchApi(`/failedLogins/?limit=${limit}&offset=${offset}`)
}

export async function fetchTypesApi(limit?: number, offset?: number) {
  const params = new URLSearchParams();

  if (limit !== undefined) params.append("limit", limit.toString());
  if (offset !== undefined) params.append("offset", offset.toString());

  const query = params.toString();
  const url = query ? `/types/?${query}` : "/types/";

  return await fetchApi(url);
}

export async function fetchPlacesTakenEvent(event_id: number) {
  return await fetchApi(`/registrations/places/${event_id}`)
}

export async function fetchProfilesApi(
  limit: number,
  offset: number,
  filters?: {
    nb_like?: string;
    is_planner?: boolean;
    role?: string;
    search?: string;
  }
) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (filters) {
    if (filters.nb_like) {
      params.set("nb_like", filters.nb_like);
    }
    if (filters.is_planner !== undefined) {
      params.set("is_planner", filters.is_planner.toString());
    }
    if (filters.role) {
      params.set("role", filters.role);
    }
    if (filters.search) {
      params.set("search", filters.search);
    }
  }

  return await fetchApi(`/profiles/?${params.toString()}`);
}

export async function fetchProfilesSuperAdminApi(
  limit: number,
  offset: number,
  filters?: {
    nb_like?: string;
    is_planner?: boolean;
    role?: string;
    search?: string;
  }
) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (filters) {
    if (filters.nb_like) {
      params.set("nb_like", filters.nb_like);
    }
    if (filters.is_planner !== undefined) {
      params.set("is_planner", filters.is_planner.toString());
    }
    if (filters.role) {
      params.set("role", filters.role);
    }
    if (filters.search) {
      params.set("search", filters.search);
    }
  }

  return await fetchApi(`/super-admin/profiles?${params.toString()}`);
}

export async function fetchProfilesPlannerApi(
  limit: number,
  offset: number,
  filters?: {
    search?: string;
  }
) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (filters) {
    if (filters.search) {
      params.set("search", filters.search);
    }
  }

  return await fetchApi(`/profiles/planners?${params.toString()}`);
}

export async function fetchCommentsApi(
  limit: number,
  offset: number,
  filters?: {
    search?: string;
    date?: string;
    email?: string;
    event_email?: string;
  }
) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (filters) {
    if (filters.search) {
      params.set("search", filters.search);
    }
    if (filters.date) {
      params.set("date", filters.date);
    }
    if (filters.email) {
      params.set("email", filters.email);
    }
    if (filters.event_email) {
      params.set("event_email", filters.event_email);
    }
  }

  return await fetchApi(`/comments/?${params.toString()}`);
}

export async function fetchRegistrationsApi(
  limit: number,
  offset: number,
  filters?: {
    date?: string;
    email?: string;
    event_email?: string;
    payment_status?: string;
  }
) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (filters) {
    if (filters.date) {
      params.set("date", filters.date);
    }
    if (filters.email) {
      params.set("email", filters.email);
    }
    if (filters.event_email) {
      params.set("event_email", filters.event_email);
    }
    if (filters.payment_status) {
      params.set("payment_status", filters.payment_status);
    }
  }

  return await fetchApi(`/registrations/?${params.toString()}`);
}

export async function fetchPaymentsApi(
  limit: number,
  offset: number,
  filters?: {
    event_title?: string;
    buyer_email?: string;
    organizer_email?: string;
    amount_min?: number;
    amount_max?: number;
    fee_min?: number;
    fee_max?: number;
    brut_amount_min?: number;
    brut_amount_max?: number;
    stripe_session_id?: string;
    stripe_payment_intent_id?: string;
    status?: string;
    date_apres?: string;
    date_avant?: string;
  }
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (filters?.event_title) params.append("event_title", filters.event_title);
  if (filters?.buyer_email) params.append("buyer_email", filters.buyer_email);
  if (filters?.organizer_email) params.append("organizer_email", filters.organizer_email);
  if (filters?.amount_min !== undefined) params.append("amount_min", String(filters.amount_min));
  if (filters?.amount_max !== undefined) params.append("amount_max", String(filters.amount_max));
  if (filters?.fee_min !== undefined) params.append("fee_min", String(filters.fee_min));
  if (filters?.fee_max !== undefined) params.append("fee_max", String(filters.fee_max));
  if (filters?.brut_amount_min !== undefined) params.append("brut_amount_min", String(filters.brut_amount_min));
  if (filters?.brut_amount_max !== undefined) params.append("brut_amount_max", String(filters.brut_amount_max));
  if (filters?.stripe_session_id) params.append("stripe_session_id", filters.stripe_session_id);
  if (filters?.stripe_payment_intent_id) params.append("stripe_payment_intent_id", filters.stripe_payment_intent_id);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.date_apres) params.append("date_apres", filters.date_apres);
  if (filters?.date_avant) params.append("date_avant", filters.date_avant);

  return await fetchApi(`/super-admin/payments?${params.toString()}`)
}

export async function fetchLogsApi(
  limit: number,
  offset: number,
  filters?: {
    date?: string;
    action_type?: string;
    log_type?: string;
  }
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (filters?.date) params.append("date", filters.date);
  if (filters?.action_type) params.append("action_type", filters.action_type);
  if (filters?.log_type) params.append("log_type", filters.log_type);

  return await fetchApi(`/super-admin/logs?${params.toString()}`)
}

export async function fetchReasonsApi(limit?: number, offset?: number) {

  const params = new URLSearchParams();

  if (limit !== undefined) params.append("limit", limit.toString());
  if (offset !== undefined) params.append("offset", offset.toString());

  const query = params.toString();
  const url = query ? `/reasons?${query}` : "/reasons";

  return await fetchApi(url);
}

export async function fetchMeApi() {
  return await fetchApi("/profiles/me", "GET");
}

export async function fetchSignaledUsers(
  offset: number,
  limit: number,
  filters: {
    userDate?: string,
    user_signaled_by_user?: string,
    user_user_signaled?: string,
    user_reason_id?: number,
  }
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (filters.userDate) params.append("date", filters.userDate.toString());
  if (filters.user_signaled_by_user) params.append("signaled_by_user", filters.user_signaled_by_user.toString());
  if (filters.user_reason_id) params.append("reason_id", filters.user_reason_id.toString());
  if (filters.user_user_signaled) params.append("user_signaled", filters.user_user_signaled.toString());

  return await fetchApi(`/signaledUsers?${params.toString()}`)
}

export async function fetchSignaledEventsApi(
  offset: number,
  limit: number,
  filters: {
    eventDate?: string;
    event_signaled_by_user?: string;
    event_email_user?: string;
    event_reason_id?: number;
  }
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (filters.eventDate) params.append("date", filters.eventDate.toString());
  if (filters.event_signaled_by_user) params.append("email_user", filters.event_signaled_by_user.toString());
  if (filters.event_email_user) params.append("email_event_user", filters.event_email_user.toString());
  if (filters.event_reason_id) params.append("reason_id", filters.event_reason_id.toString());

  return await fetchApi(`/signaledEvents?${params.toString()}`)
}

export async function fetchSignaledCommentsApi(
  offset: number,
  limit: number,
  filters: {
    commentDate?: string,
    comment_signaled_by_user?: string,
    email_comment_signaled?: string,
    comment_reason_id?: number,
  }
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (filters.commentDate) params.append("date", filters.commentDate.toString());
  if (filters.comment_signaled_by_user) params.append("email_user", filters.comment_signaled_by_user.toString());
  if (filters.comment_reason_id) params.append("reason_id", filters.comment_reason_id.toString());
  if (filters.email_comment_signaled) params.append("email_comment_user", filters.email_comment_signaled.toString());

  return await fetchApi(`/signaledComments?${params.toString()}`)
}

export async function fetchIsLiked(event_id: number) {
  return await fetchApi(`/likes/is_liked?event_id=${event_id}`)
}

export async function fetchLikesCountEventApi(event_id: number) {
  return await fetchApi(`/likes/${event_id}`)
}

export async function fetchEventsProfileApi(user_id: number, offset: number, limit: number) {
  return await fetchApi(`/events/profiles/${user_id}?offset=${offset}&limit=${limit}`)
}

export async function fetchEventApi(event_id: number) {
  return await fetchApi(`/events/${event_id}`)
}

export async function fetchEventsApi(
  offset: number,
  limit: number,
  filters?: {
    date_avant?: string;
    date_apres?: string;
    type_ids?: number[];
    country?: string;
    city?: string;
    popularity?: boolean;
    recent?: boolean;
    nb_places?: number;
    search?: string;
    price?: number;
  }
) {
  const params = new URLSearchParams();

  params.set("offset", offset.toString());
  params.set("limit", limit.toString());

  if (filters) {
    if (filters.date_avant) params.set("date_avant", filters.date_avant);
    if (filters.date_apres) params.set("date_apres", filters.date_apres);
    if (filters.type_ids && filters.type_ids.length > 0) {
      filters.type_ids.forEach((id) => {
        params.append("type_ids", id.toString());
      });
    }
    if (filters.country) params.set("country", filters.country);
    if (filters.city) params.set("city", filters.city);
    if (filters.popularity !== undefined)
      params.set("popularity", filters.popularity ? "true" : "false");
    if (filters.recent !== undefined)
      params.set("recent", filters.recent ? "true" : "false");
    if (filters.nb_places !== undefined)
      params.set("nb_places", filters.nb_places.toString());
    if (filters.search) params.set("search", filters.search.toString());
    if (filters.price) params.set("price", filters.price.toString());
  }

  return await fetchApi(`/events/?${params.toString()}`);
}

export async function fetchProfileApi(profile_id: number) {
  return await fetchApi(`/profiles/${profile_id}`);
}

export async function fetchMyEventsApi(user_id: number, offset: number, limit: number) {
  return await fetchApi(`/events/profiles/${user_id}?offset=${offset}&limit=${limit}`);
}

export async function fetchMyRegistrationsApi(offset: number, limit: number) {
  return await fetchApi(`/registrations/self?offset=${offset}&limit=${limit}`);
}

export async function fetchMyEventsRegistrationsApi(event_id: number, offset: number, limit: number) {
  return await fetchApi(`/registrations/self/events?event_id=${event_id}&offset=${offset}&limit=${limit}`);
}

export async function fetchMyPaymentsApi(offset: number, limit: number) {
  return await fetchApi(`/payments?offset=${offset}&limit=${limit}`);
}
