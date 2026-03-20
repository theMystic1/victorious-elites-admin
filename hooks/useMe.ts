"use client";

import { fetchMe } from "@/lib/api/endpoints/auth";
import { useQuery } from "@tanstack/react-query";

const useMe = () => {
  const { data: me, isLoading: isLoadingMe } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchMe().then((res) => res.data),
  });
  return { me, isLoadingMe };
};

export default useMe;
