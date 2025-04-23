import { useState } from "react";
import EmployeesFilters from "./EmployeesFilters";
import EmployeesTable from "./EmployeesTable"
import { PaginationState, SortingState } from "@tanstack/react-table";
import { Filters } from "../utils/types";
import { useEmployees } from "../hooks/useEmployees";
import NewEmployeeModal from "./NewEmployeeModal";
import { useDepartments } from "../hooks/useDepartments";
const Employees: React.FC = () => {
  const [newEmployeeOpen, setNewEmployeeOpen] = useState(false);
  // State variables for the table / filters management.
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({name: '', departmentName: '', departmentId: null});
  // Hooks to retrieve the data
  const { data: employees, isFetching } = useEmployees(pagination.pageSize, pagination.pageIndex, sorting, filters);
  const { data: departments } = useDepartments();

  return (
    <>
      <div className="flex justify-start mt-10">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setNewEmployeeOpen(true)}
        >
          <svg className="w-5 h-5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Employee
        </button>
      </div>
      <NewEmployeeModal departments={departments} open={newEmployeeOpen} setOpen={setNewEmployeeOpen}></NewEmployeeModal>
      <EmployeesFilters departments={departments} filters={filters} setFilters={setFilters}></EmployeesFilters>
      <div className="-mx-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <EmployeesTable 
          pagination={pagination} 
          sorting={sorting} 
          data={employees} 
          isFetching={isFetching}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
        />
      </div>
    </>
  );
};
export default Employees;