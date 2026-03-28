"use client";

import { getDashboardCards } from "@/lib/api/endpoints/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  const {
    data: dashboardStats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["class-results"],
    queryFn: async () => getDashboardCards().then((res) => res.data),
  });

  return { dashboardStats, isLoadingStats, refetchStats };
};
