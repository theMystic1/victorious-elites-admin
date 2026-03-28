import { useQuery } from "@tanstack/react-query";
import { getSubject, getSubjects } from "@/lib/api/endpoints/subjects";
import { useParams, useSearchParams } from "next/navigation";

const useSubjects = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const {
    data: subjectsData,
    isLoading: isLoadingSubjects,
    refetch: refetchSubjects,
  } = useQuery({
    queryKey: ["subjects", page, limit],
    queryFn: async () =>
      await getSubjects({ page, limit }).then((res) => res.data),
  });

  return { subjectsData, isLoadingSubjects, refetchSubjects };
};

const useSubject = (subjectId?: string) => {
  const { subjectId: paramsSubjectId } = useParams();

  const subjectIdToUse = paramsSubjectId ?? subjectId;

  const {
    data: subjectData,
    isLoading: isLoadingSubject,
    refetch: refetchSubject,
  } = useQuery({
    queryKey: ["subject", subjectIdToUse],
    queryFn: async () =>
      await getSubject(subjectIdToUse as string).then((res) => res.data),
    enabled: !!subjectIdToUse,
  });

  return { subjectData, isLoadingSubject, refetchSubject };
};
export { useSubjects, useSubject };
