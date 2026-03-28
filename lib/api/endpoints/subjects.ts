import { SubjectClassType, SubjectType } from "@/utils/types";
import { apiClient } from "../axios";

const subjectBase = `/subjects`;

const addNewSubject = (subject: SubjectType) => {
  return apiClient.post(subjectBase, subject);
};

const getSubjects = ({ page, limit }: { page: number; limit: number }) => {
  return apiClient.get(subjectBase, {
    params: { page, limit },
  });
};

const getSubject = (subjectId: string) => {
  return apiClient.get(`${subjectBase}/${subjectId}`);
};

const updateSubject = (subjectId: string, subject: SubjectType) => {
  return apiClient.patch(`${subjectBase}/${subjectId}`, subject);
};

const deleteSubject = (subjectId: string) => {
  return apiClient.delete(`${subjectBase}/${subjectId}`);
};

// SUBJECT CLASSES

const getClassSubjects = (classId: string) => {
  return apiClient.get(`${subjectBase}/class/${classId}`);
};

const getSubjectClass = (subjectId: string) => {
  return apiClient.get(`${subjectBase}/${subjectId}/class`);
};

const addNewSubjectClass = (
  subjectId: string,
  subjectClass: SubjectClassType,
  classId: string,
) => {
  return apiClient.post(
    `${subjectBase}/${subjectId}/class/${classId}`,
    subjectClass,
  );
};

// const updateSubjectClass = (
//   subjectId: string,
//   classId: string,
//   subjectClass: SubjectClassType,
// ) => {
//   return apiClient.patch(
//     `${subjectBase}/${subjectId}/class/${classId}`,
//     subjectClass,
//   );
// };

// const deleteSubjectClass = (subjectId: string, subjectClassId: string) => {
//   return apiClient.delete(
//     `${subjectBase}/${subjectId}/classes/${subjectClassId}`,
//   );
// };

export {
  addNewSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,

  // SUBJECT CLASSES
  getClassSubjects,
  getSubjectClass,
  addNewSubjectClass,
  // updateSubjectClass,
  // deleteSubjectClass,
};
