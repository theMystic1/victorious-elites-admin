import { apiClient } from "../axios";

export const getDashboardCards = () => apiClient.get(`/dashboard`);
