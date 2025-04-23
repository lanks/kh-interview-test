import { useQuery } from "@tanstack/react-query";
import Department from "../resources/Department";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await Department.all();
      return response;
    }
  })
}