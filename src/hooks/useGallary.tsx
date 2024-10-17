import { viewAllGallary } from "@/api/API";
import useSWR from "swr";

export const useGallary = () => {
  const { data, isLoading } = useSWR(`api/view-gallary/`, () => {
    return viewAllGallary()?.then((res) => {
      return res;
    });
  });
  return { data, isLoading };
};
