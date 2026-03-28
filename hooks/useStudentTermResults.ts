"use client";

import { getTermResults } from "@/lib/api/endpoints/results";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

const useStudentsTermResults = ({
  tmId,
  classId,
  studId,
}: {
  tmId?: string;
  classId: string;
  studId?: string;
}) => {
  const { studentsId } = useParams();
  const params = useSearchParams();
  const termId = params?.get("termId");
  const tmIdToUse = tmId || termId;
  const studIdToUse = studId || studentsId;

  const {
    data: resultsData,
    isLoading: isLoadingResultsData,
    refetch: refetchResultsData,
  } = useQuery({
    queryKey: ["results", tmIdToUse, studIdToUse, classId],
    queryFn: async () =>
      await getTermResults({
        termId: tmIdToUse as string,
        classId,
        studentId: studIdToUse as string,
      }).then((res) => res.data),
    enabled: Boolean(termId && tmIdToUse && studIdToUse),
  });

  return { resultsData, isLoadingResultsData, refetchResultsData };
};

export { useStudentsTermResults };
