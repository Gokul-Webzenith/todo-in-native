import { useQuery } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";

export function useSession() {
  return useQuery({
    queryKey: ["session"],

    queryFn: async () => {
      const res = await authClient.getSession();
      return res?.data?.user ?? null;
    },

    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}