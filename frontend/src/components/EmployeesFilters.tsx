import { CollectionProxy } from 'spraypaint/lib-esm/proxies';
import Department from "../resources/Department";
import { Filters } from "../utils/types";
import { useEffect, useState } from "react";

interface EmployeesFiltersProps {
  departments?: CollectionProxy<Department>;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const EmployeesFilters: React.FC<EmployeesFiltersProps> = ({departments, filters, setFilters}) => {
  const [searchValue, setSearchValue] = useState("");

  // Only submit the search on pressing enter
  // We could make it on all inputs but then need debouncing
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setFilters({...filters, name: searchValue})
    }
  };
  
  // Added this as I have added the input as "search" which includes a "x" icon that clears the input.
  useEffect(() => {
    if(!searchValue) setFilters({...filters, name: searchValue});
  }, [searchValue]);

  
  return (
    <div className="flex flex-col items-start gap-4 my-4 sm:flex-row sm:items-center">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <input 
          onKeyDown={handleSearchKeyDown} 
          type="search" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          name="search" 
          className="block w-96 rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
          placeholder="Search employees..."
        />
      </div>
      <div className="relative">
        <label className="absolute inline-block px-1 text-xs font-medium text-gray-900 bg-white rounded-lg -top-2 left-2">Department</label>
        <select 
          name="department" 
          value={filters.departmentName || ""}
          onChange={(e) => setFilters({...filters, departmentName: e.target.value})}
          className="block w-full px-3 py-2 text-sm text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          <option value="">All</option>
          {departments?.data.map((department: {id: string|number, name: string}) => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default EmployeesFilters;