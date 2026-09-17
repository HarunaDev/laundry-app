import type {
    JSX,
    ReactNode,
  } from "react";
  
  export interface TableColumn<T> {
    key: string;
  
    header: string;
  
    render: (
      row: T
    ) => ReactNode;
  
    className?: string;
  }
  
  interface DataTableProps<T> {
    data: T[];
  
    columns: TableColumn<T>[];
  
    getRowKey: (
      row: T
    ) => string | number;
  
    isLoading?: boolean;
  
    emptyMessage?: string;
  }
  
  const DataTable = <T,>({
    data,
    columns,
    getRowKey,
    isLoading = false,
    emptyMessage = "No data found.",
  }: DataTableProps<T>): JSX.Element => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                    ${column.className ?? ""}
                  `}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
  
            {isLoading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="
                    px-6
                    py-12
                    text-center
                    text-sm
                    text-gray-500
                  "
                >
                  Loading...
                </td>
              </tr>
            )}
  
            {!isLoading &&
              data.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="
                    border-b
                    border-gray-100
                    transition
                    hover:bg-gray-50
                  "
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-sm
                        text-gray-700
                      "
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
  
            {!isLoading &&
              data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="
                      px-6
                      py-12
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
  
          </tbody>
        </table>
      </div>
    );
  };
  
  export default DataTable;