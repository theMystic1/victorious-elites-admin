"use client";

import { getStaff, getStaffs } from "@/lib/api/endpoints/auth";
import { useQuery } from "@tanstack/react-query";

const useStaffs = () => {
  const {
    data: staffsData,
    isLoading: isLoadingStaff,
    refetch: refetchStaffs,
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: () => getStaffs().then((res) => res.data),
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
