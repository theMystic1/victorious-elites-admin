import { getStudentRatings } from "@/lib/api/endpoints/ratings";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

export const useStudentRatings = ({
  sesId,
  clId,
  stdId,
  trmId,
}: {
  sesId?: string;
  clId?: string;
  stdId?: string;
  trmId?: string;
}) => {
  const searchParams = useSearchParams();
  const { studentsId } = useParams();
  const classId = searchParams.get("classId") || clId || "";
  const sessionId = searchParams.get("sessionId") || sesId || "";
  const termId = searchParams.get("termId") || trmId || "";
  const studentId = (studentsId as string) || stdId || "";
  // console.log({ sessionId, classId, studentId, termId });

  const {
    data: studentsRatingData,
    isLoading: isLoadingStudentRating,
    refetch: refetchStudentsRating,
  } = useQuery({
    queryKey: ["student-ratings", sessionId, classId, termId, studentId],
    queryFn: () =>
      getStudentRatings({
        sessionId,
        classId,
        studentId,
        termId,
      }).then((res) => res.data),
  });
  return { studentsRatingData, isLoadingStudentRating, refetchStudentsRating };
};
