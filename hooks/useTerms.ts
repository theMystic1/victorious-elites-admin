"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSessionTerm } from "../lib/api/endpoints/school";

const useTerms = (sessId?: string) => {
  const { sessionId } = useParams();

  const sessIdToUse = sessId || sessionId;

  const {
    data: termsData,
    isLoading: isLoadingTerm,
    refetch: refetchTerms,
  } = useQuery({
    queryKey: ["session-terms", sessIdToUse],
    queryFn: () =>
      getSessionTerm(sessIdToUse as string).then((res) => res.data),
    enabled: !!sessIdToUse,
  });
  return { termsData, isLoadingTerm, refetchTerms };
};

export { useTerms };
