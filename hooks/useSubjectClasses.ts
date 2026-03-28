"use client";

import {
  getClassSubjects,
  getSubjectClass,
} from "@/lib/api/endpoints/subjects";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const useSubjectClasses = (subId?: string) => {
  const { subjectId } = useParams();

  const idToUse = subId ?? subjectId;
  const {
    data: subjectClassesData,
    isLoading: isLoadingSubjectClasses,
    refetch: refetchSubjectClasses,
  } = useQuery({
    queryKey: ["subjectClasses"],
    queryFn: async () =>
      await getSubjectClass(idToUse as string).then((res) => res.data),
    enabled: !!idToUse,
  });

  return { subjectClassesData, isLoadingSubjectClasses, refetchSubjectClasses };
};

const useClassSubjects = (clId?: string) => {
  const { classId } = useParams();

  const idToUse = clId ?? classId;
  const {
    data: classSubjectsData,
    isLoading: isLoadingClassSubjects,
    refetch: refetchClassSubjects,
  } = useQuery({
    queryKey: ["classSubjects"],
    queryFn: async () =>
      await getClassSubjects(idToUse as string).then((res) => res.data),
    enabled: !!idToUse,
  });

  return { classSubjectsData, isLoadingClassSubjects, refetchClassSubjects };
};

export { useSubjectClasses, useClassSubjects };
