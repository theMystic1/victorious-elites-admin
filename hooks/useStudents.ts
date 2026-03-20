import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import { useParams, useSearchParams } from "next/navigation";
import { getStudent, getStudents } from "@/lib/api/endpoints/students";

export const useStudents = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const classId = searchParams.get("classId");
  const {
    data: studentsData,
    isLoading: isLoadingStudent,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students", sessionId, classId],
    queryFn: () => getStudents(classId!).then((res) => res.data),
  });
  return { studentsData, isLoadingStudent, refetchStudents };
};

export const useSingleStudent = () => {
  const { studentsId } = useParams();

  console.log(studentsId);
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
