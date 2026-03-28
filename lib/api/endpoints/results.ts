import { ResultCreateType } from "@/utils/types";
import { apiClient } from "../axios";
import Results from "@/components/results/results";

const baseUrl = "/results";

const getTermResults = ({
  termId,
  classId,
  studentId,
}: {
  termId: string;
  classId: string;
  studentId: string;
}) =>
  apiClient.get(`${baseUrl}/${termId}/class/${classId}/student/${studentId}`);

const computeTermResults = ({
  termId,
  classId,
  studentId,
  results,
}: {
  termId: string;
  classId: string;
  studentId: string;
  results: {
    results: ResultCreateType[];
  };
}) =>
  apiClient.post(
    `${baseUrl}/${termId}/class/${classId}/student/${studentId}`,
    results,
  );

const getOverAllClassResults = ({
  termId,
  classId,
}: {
  termId: string;
  classId: string;
}) => apiClient.get(`${baseUrl}/${termId}/class/${classId}`);

export { computeTermResults, getTermResults, getOverAllClassResults };
