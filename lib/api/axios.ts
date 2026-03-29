import axios from "axios";
import { getCookie } from "../helpers/helper";

const token = getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN!);
// console.log(token);
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 60_000,
  withCredentials: true,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
