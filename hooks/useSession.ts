import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { getSession, getSessions } from "@/lib/api/endpoints/school";

export const useSession = () => {
  const searchParams = useSearchParams();

  const {
    data: sessionData,
    isLoading: isLoadingSession,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSessions().then((res) => res.data),
  });
  return { sessionData, isLoadingSession, refetchSession };
};

export const useSingleSession = () => {
  const { sessionId } = useParams();

  const {
    data: sessionData,
    isLoading: isLoadingSession,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession(sessionId as string).then((res) => res.data),
    enabled: !!sessionId && sessionId !== "class",
  });
  return { sessionData, isLoadingSession, refetchSession };
};
