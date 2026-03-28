import { apiClient } from "@/lib/api/axios";
import { METype } from "@/utils/types";

const base = "/auth";

export const fetchMe = async () => {
  const { data } = await apiClient.get(`${base}/me`);
  return data;
};

export const updateMe = async (userData: METype) => {
  const { data } = await apiClient.patch(`${base}/me`, userData);
  return data;
};

export const signin = async (email: string, password: string) => {
  const { data } = await apiClient.post(`${base}/signin`, { email, password });
  return data;
};
export const resendToken = async (email: string) => {
  const { data } = await apiClient.post(`${base}/resendToken`, { email });
  return data;
};

export const verifyEmail = async (email: string, otp: string) => {
  const { data } = await apiClient.post(`${base}/verify`, { email, otp });
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await apiClient.post(`${base}/forgotPassword`, { email });
  return data;
};
export const resetPassword = async (
  email: string,
  token: string,
  password: string,
) => {
  const { data } = await apiClient.post(`${base}/resetPassword`, {
    email,
    token,
    password,
  });
  return data;
};

/* STAFFS */

export const addStaff = async (staffData: METype) => {
  const { data } = await apiClient.post(`${base}/createStaff`, staffData);
  return data;
};

export const getStaffs = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const { data } = await apiClient.get(
    `${base}/staffs?page=${page}&limit=${limit}`,
  );
  return data;
};

export const getStaff = async (staffId: string) => {
  const { data } = await apiClient.get(`${base}/staffs/${staffId}`);
  return data;
};

export const updateStaff = async (staffId: string, staffData: METype) => {
  const { data } = await apiClient.patch(
    `${base}/staffs/${staffId}`,
    staffData,
  );
  return data;
};

export const deleteStaff = async (staffId: string) => {
  const { data } = await apiClient.delete(`${base}/staffs/${staffId}`);
  return data;
};
