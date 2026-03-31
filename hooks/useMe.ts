"use client";

import { fetchMe } from "@/lib/api/endpoints/auth";
import { getCookie } from "@/lib/helpers/helper";
import { useQuery } from "@tanstack/react-query";

const useMe = () => {
  // console.log(token);
  const { data: me, isLoading: isLoadingMe } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchMe().then((res) => res.data),
  });
  return { me, isLoadingMe };
};

export default useMe;
