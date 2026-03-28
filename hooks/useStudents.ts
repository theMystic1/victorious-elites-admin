import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import { useParams, useSearchParams } from "next/navigation";
import { getStudent, getStudents } from "@/lib/api/endpoints/students";

export const useStudents = ({
  sesId,
  clId,
}: {
  sesId?: string;
  clId?: string;
}) => {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const sessionId = searchParams.get("sessionId") || sesId || "";
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  const classIdToUse = clId ?? classId;
  const {
    data: studentsData,
    isLoading: isLoadingStudent,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students", classIdToUse, sessionId, page, limit],
    queryFn: () =>
      getStudents(
        classIdToUse as string,
        sessionId,
        Number(page),
        Number(limit),
      ).then((res) => res.data),
  });
  return { studentsData, isLoadingStudent, refetchStudents };
};

export const useSingleStudent = () => {
  const { studentsId } = useParams();

  // console.log(studentsId);
  const {
    data: studentData,
    isLoading: isLoadingStudent,
    refetch: refetchStudent,
  } = useQuery({
    queryKey: ["student", studentsId],
    queryFn: () => getStudent(studentsId as string).then((res) => res.data),
  });
  return { studentData, isLoadingStudent, refetchStudent };
};
