import { StudentsType } from "@/utils/types";
import { apiClient } from "../axios";

const getStudents = (classId?: string) => {
  const params = classId ? { classId } : undefined;
  return apiClient.get(`/students${classId ? `/classId/${classId}` : ""}`);
};

const getStudent = (studentId: string) => {
  return apiClient.get(`/students/${studentId}`);
};

const addStudent = (student: StudentsType) => {
  return apiClient.post(`/students`, student);
};

const updateStudent = (id: string, student: StudentsType) => {
  return apiClient.patch(`/students/${id}`, student);
};

const deleteStudent = (studentId: string) => {
  return apiClient.delete(`/students/${studentId}`);
};

export { getStudents, addStudent, updateStudent, deleteStudent, getStudent };
