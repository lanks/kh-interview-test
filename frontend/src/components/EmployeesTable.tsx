import { useMemo } from 'react';
import { flexRender, createColumnHelper, getCoreRowModel, PaginationState, 
         useReactTable, 
         SortingState,
         Header,
         OnChangeFn} from '@tanstack/react-table';
import Employee from '../resources/Employee';

interface EmployeesTableProps {
  pagination: PaginationState;
  sorting: SortingState;
  data?: {
    data: Employee[];
    meta: Record<string, any>;
  };
  isFetching: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
  onSortingChange: OnChangeFn<SortingState>;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ 
  pagination, 
  sorting, 
  data, 
  isFetching,
  onPaginationChange,
  onSortingChange
}) => {

  // Helper methoods from Tanstack
  const columnHelper = createColumnHelper<Employee>();
  
  const columns = useMemo(() => [
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      header: () => <span>First Name</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('lastName', {
      cell: (info) => info.getValue(),
      header: () => <span>Last Name</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('age', {
      cell: (info) => info.getValue(),
      header: () => <span>Age</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('position', {
      cell: (info) => info.getValue(),
      header: () => <span>Position</span>,
      footer: (info) => info.column.id,
    }),

    columnHelper.accessor('department.name', {
      cell: (info) => info.getValue(),
      header: () => <span>Department Name</span>,
      footer: (info) => info.column.id,
      enableSorting: false
    }),
  ], []);

  // Tanstack table
  const table = useReactTable({
    columns,
    data: data?.data ?? [],
    rowCount: data?.meta?.stats?.total?.count ?? 0,
    state: {
      pagination,
      sorting
    },
    onPaginationChange,
    manualPagination: true,
    manualSorting: true, 
    enableMultiSort: true,
    isMultiSortEvent: (e) => true,
    debugTable: true,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  // Loading placeholder (this doesn't work very well ie. the table flickers when it is loading)
  const loadingRows = () => {
    return (
      <div className="animate-pulse">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-4 mt-3 mb-6 bg-gray-200 rounded"></div>
        ))}
    </div>
    )
  }

  // Rendering the table rows with tailwind classes
  const tableRows = () => {
    return table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell" key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))
  }

  // Simple helper to render the header
  const columnHeader = (header: Header<Employee, unknown>) => {
    return (
      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" key={header.id}>
        {header.isPlaceholder ? null : (
            <div
              className={
                header.column.getCanSort()
                  ? 'cursor-pointer select-none'
                  : ''
              }
              onClick={header.column.getToggleSortingHandler()}
              title={
                header.column.getCanSort()
                  ? header.column.getNextSortingOrder() === 'asc'
                    ? 'Sort ascending'
                    : header.column.getNextSortingOrder() === 'desc'
                      ? 'Sort descending'
                      : 'Clear sort'
                  : undefined
              }
            >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
              {{
                asc: ' 🔼',
                desc: ' 🔽',
              }[header.column.getIsSorted() as string] ?? null}
            </div>
          )}
      </th>
    )
  }

  // Simple pagination with arrows
  const paginator = () => {
    return (
      <><div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden">
        <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Previous</a>
        <a href="#" className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Next</a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{pagination.pageIndex == 1 ? pagination.pageIndex : ((pagination.pageIndex * pagination.pageSize) - pagination.pageSize) + 1 }</span>{' '}
            to{' '}
            <span className="font-medium">{pagination.pageIndex == 1 ? pagination.pageSize : (pagination.pageIndex * pagination.pageSize)}</span>{' '}
            of{' '}
            <span className="font-medium">{data?.meta?.stats?.total?.count ?? 0}</span>{' '}
            results
          </p>
        </div>
        <div>
          <nav className="inline-flex -space-x-px rounded-md shadow-xs isolate" aria-label="Pagination">
            <button onClick={() => table.previousPage()} disabled={pagination.pageIndex == 1 || !table.getCanPreviousPage()} className="relative inline-flex items-center px-2 py-2 text-gray-900 rounded-l-md ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span className="sr-only">Previous</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd"></path>
              </svg>
            </button>
            
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="relative inline-flex items-center px-2 py-2 text-gray-900 rounded-r-md ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span className="sr-only">Next</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div></>)
  }

  return (
    <>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                columnHeader(header)
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isFetching ? loadingRows() : tableRows()}
          
        </tbody>
      </table>
      {paginator()}
    </>
  );
}
export default EmployeesTable;