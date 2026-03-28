"use client";

import { getStaff, getStaffs } from "@/lib/api/endpoints/auth";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useStaffs = () => {
  const params = useSearchParams();
  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);
  const {
    data: staffsData,
    isLoading: isLoadingStaff,
    refetch: refetchStaffs,
  } = useQuery({
    queryKey: ["staffs", page, limit],
    queryFn: async () =>
      getStaffs({
        limit,
        page,
      }),
  });
  return { staffsData, isLoadingStaff, refetchStaffs };
};

const useStaff = (staffId: string) => {
  const {
    data: staffData,
    isLoading: isLoadingStaff,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => getStaff(staffId).then((res) => res.data),
  });
  return { staffData, isLoadingStaff, refetchStaff };
};

export { useStaffs, useStaff };
