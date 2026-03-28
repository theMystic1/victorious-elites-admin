import { apiClient } from "../axios";

const baseUrl = "/ratings";

const rateStudent = ({
  sessionId,
  termId,
  classId,
  studentId,
  ratings,
  formTeacherRemark,
  principalsRemark,
}: {
  sessionId: string;
  termId: string;
  classId: string;
  studentId: string;
  ratings: { ratingItemId: string; rating: number }[];
  formTeacherRemark: string;
  principalsRemark: string;
}) => {
  return apiClient.post(
    `${baseUrl}/${sessionId}/term/${termId}/class/${classId}/student/${studentId}`,
    {
      ratings,
      formTeacherRemark,
      principalsRemark,
    },
  );
};

const getStudentRatings = ({
  sessionId,
  termId,
  classId,
  studentId,
}: {
  sessionId: string;
  termId: string;
  classId: string;
  studentId: string;
}) => {
  return apiClient.get(
    `${baseUrl}/${sessionId}/term/${termId}/class/${classId}/student/${studentId}`,
  );
};

export { rateStudent, getStudentRatings };
