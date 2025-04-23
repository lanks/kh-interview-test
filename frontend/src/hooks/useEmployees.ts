import { useQuery } from "@tanstack/react-query";
import Employee from "../resources/Employee";
import { SortingState } from "@tanstack/react-table";
import { Filters } from "../utils/types";

export const useEmployees = (pageSize: number, page: number, sorting: SortingState, filters: Filters) => {
  return useQuery({
      queryKey: ["employees", pageSize, page, sorting, filters],
      queryFn: async () => {
        // Transform the sort into the graphiti format.
        // @TODO Move this outside.
        const mappedSort = sorting.reduce((acc, s) => ({ ...acc, [s.id]: s.desc ? 'desc' : 'asc' }), {});
        
        // Chain the filters query.
        // @TODO See if there is a more elegant way of doing this...
        let query = Employee.scope();
        if (filters.name) {
          query = query.where({ name: {fuzzy_match: filters.name } });
        }
        if (filters.departmentName) {
          query = query.where({ departmentName: filters.departmentName });
        }
        // I have added this for the new employee validation query.
        if (filters.departmentId) {
          query = query.where({ departmentId: filters.departmentId });
        }
        const response = await query.includes("department").stats({ total: "count" }).order(mappedSort).per(pageSize).page(page).all();
        return response;
      }
    });
};