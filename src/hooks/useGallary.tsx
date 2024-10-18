import { allAccount, viewAllGallary } from "@/api/API";
import useSWR from "swr";

export const useGallary = () => {
  const { data, isLoading } = useSWR(`api/view-gallary/`, () => {
    return viewAllGallary()?.then((res) => {
      return res;
    });
  });
  return { data, isLoading };
};

export const useUserAccount = () => {
  const { data, isLoading } = useSWR(`api/users/`, () => {
    return allAccount()?.then((res) => {
      return res;
    });
  });
  return { data, isLoading };
};
