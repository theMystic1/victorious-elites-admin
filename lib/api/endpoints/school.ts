import { SessionType } from "@/utils/types";
import { apiClient } from "../axios";

const base = "/school";

const sessionBase = `${base}/sessions`;

const addNewSession = (session: SessionType) => {
  return apiClient.post(sessionBase, session);
};

const getSessions = () => {
  return apiClient.get(sessionBase);
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

const getSessionTerm = (termId: string) => {
  return apiClient.get(`${sessionBase}/term/${termId}`);
};

export {
  addNewSession,
  getSessions,
  getSession,
  updateSession,
  activateSession,
  getSessionTerm,
};
