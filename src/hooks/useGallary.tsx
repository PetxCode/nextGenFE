import { allAccount, viewAllGallary } from "@/api/API";
import { readAllQuestion } from "@/api/questionAPI";
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

export const useReadAllQuestion = () => {
  const { data, isLoading } = useSWR(
    `api/read-question/`,
    () => {
      return readAllQuestion()?.then((res) => {
        return res;
      });
    },
    {
      revalidateOnReconnect: true,
      refreshInterval: 100,
    }
  );
  return { data, isLoading };
};
