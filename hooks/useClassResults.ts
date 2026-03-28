"use client";

import { getOverAllClassResults } from "@/lib/api/endpoints/results";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

const useClassResults = ({
  termId,
  classId,
}: {
  termId?: string;
  classId?: string;
}) => {
  const params = useSearchParams();
  const termIdPar = params.get("termId") || termId;
  const classIdPar = params.get("classId") || classId;

  const enable = Boolean(termIdPar && classIdPar);
  const {
    data: resulttClassesData,
    isLoading: isLoadingResultClasses,
    refetch: refetchResultClasses,
  } = useQuery({
    queryKey: ["class-results", termIdPar, classIdPar],
    queryFn: async () =>
      await getOverAllClassResults({
        termId: termIdPar!,
        classId: classIdPar!,
      }).then((res) => res.data),
    enabled: enable,
  });

  return { resulttClassesData, isLoadingResultClasses, refetchResultClasses };
};

export { useClassResults };
