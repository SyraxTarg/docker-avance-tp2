"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchMe } from './server_fetcher/fetch_me';

type Profile = {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  nb_like: number;
  user: {
    id: number;
    email: string;
    phone_number: string;
    is_planner: boolean;
    account_id: string | null;
    role: {
      id: number;
      role: string;
    }
  };
  created_at: Date;
  updated_at: Date;
};

type UserContextType = {
  user: Profile | null;
  refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);


  const fetchUser = async () => {
    try {
      const data = await fetchMe();
      setUser(data);

    } catch{
      setUser(null);
    }
  };


  useEffect(() => {
      fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
