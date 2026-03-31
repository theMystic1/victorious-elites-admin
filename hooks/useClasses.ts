import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getClass, getClasses } from "@/lib/api/endpoints/school";

export const useClasses = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const classLevel = searchParams.get("classLevel");

  const {
    data: classesData,
    isLoading: isLoadingClasses,
    refetch: refetchClasses,
  } = useQuery({
    queryKey: ["classes", classLevel, page, limit],
    queryFn: () =>
      getClasses(classLevel, { page, limit }).then((res) => res.data),
  });
  return { classesData, isLoadingClasses, refetchClasses };
};

export const useClass = (id?: string) => {
  const { classId } = useParams();

  const resolvedId = id ?? (classId as string);
  const {
    data: classData,
    isLoading: isLoadingClass,
    refetch: refetchClass,
  } = useQuery({
    queryKey: ["class", resolvedId],
    queryFn: () => getClass(resolvedId).then((res) => res.data),
    enabled: !!resolvedId,
  });
  return { classData, isLoadingClass, refetchClass };
};
