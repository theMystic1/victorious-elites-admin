import { ClassType, SessionType, TermType } from "@/utils/types";
import { apiClient } from "../axios";

const base = "/school";

const sessionBase = `${base}/sessions`;

// SESSIONS
const addNewSession = (session: SessionType) => {
  return apiClient.post(sessionBase, session);
};

const moveToNewSession = (sessionId: string, lastSessionId: string) => {
  return apiClient.post(`${sessionBase}/${lastSessionId}/promote`, {
    newSessionId: sessionId,
  });
};

const getSessions = ({ page, limit }: { page: number; limit: number }) => {
  return apiClient.get(`${sessionBase}?page=${page}&limit=${limit}`);
};

const getSession = (sessionId: string) => {
  return apiClient.get(`${sessionBase}/${sessionId}`);
};

const updateSession = (sessionId: string, session: SessionType) => {
  return apiClient.patch(`${sessionBase}/${sessionId}`, session);
};

const activateSession = (sessionId: string) => {
  return apiClient.patch(`${sessionBase}/${sessionId}/activate`, {});
};

const addSessionTerm = (termId: string, termInfo: TermType) => {
  return apiClient.post(`${sessionBase}/${termId}/term`, termInfo);
};

const getSessionTerm = (termId: string) => {
  return apiClient.get(`${sessionBase}/${termId}/term`);
};

const updateSessionTerm = (termId: string, termInfo: TermType) => {
  return apiClient.patch(`${sessionBase}/term/${termId}`, termInfo);
};

// CLASSES
const classBase = `${base}/class`;

const addNewClass = (cls: ClassType) => {
  return apiClient.post(classBase, cls);
};

const getClasses = (
  classLevel: string | null,
  { page, limit }: { page: number; limit: number },
) => {
  return apiClient.get(classBase, {
    params: { level: classLevel, page, limit },
  });
};

const getClass = (classId: string) => {
  return apiClient.get(`${classBase}/${classId}`);
};

const updateClass = (classId: string, cls: ClassType) => {
  return apiClient.patch(`${classBase}/${classId}`, cls);
};

const deleteClass = (classId: string) => {
  return apiClient.delete(`${classBase}/${classId}`);
};

export {
  addNewSession,
  getSessions,
  getSession,
  updateSession,
  activateSession,
  addSessionTerm,
  getSessionTerm,
  updateSessionTerm,
  moveToNewSession,

  // CLASSES
  addNewClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
};
