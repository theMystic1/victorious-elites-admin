import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import { useSearchParams } from "next/navigation";

export const useClasses = () => {
  const searchParams = useSearchParams();

  const { data: classesData, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: () => apiClient.get("/school/class").then((res) => res.data),
  });
  return { classesData, isLoadingClasses };
};
