import axios from "axios";
import { getCookie } from "../helpers/helper";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 60_000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN!);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    // remove stale header on logout
    delete (config.headers as any).Authorization;
  }

  return config;
});
