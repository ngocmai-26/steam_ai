import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';

export const ButtonAction = ({ children, color = 'blue', ...props }) => {
  let colorClass = '';
  if (color === 'blue') colorClass = 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-700 focus:ring-blue-200';
  else if (color === 'red') colorClass = 'border-red-500 text-red-600 hover:bg-red-50 hover:border-red-700 focus:ring-red-200';
  else if (color === 'indigo') colorClass = 'border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-700 focus:ring-indigo-200';
  else colorClass = 'border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-600 focus:ring-gray-200';
  return (
    <button
      className={`flex items-center justify-center border-2 bg-white px-2 py-1 md:px-3 md:py-1 rounded-md shadow transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorClass} text-xs md:text-sm min-w-[28px] min-h-[28px]`}
      {...props}
    >
      {children}
    </button>
  );
};

const Table = ({
  columns,
  data,
  isLoading,
  onRowClick,
  actions,
  emptyMessage = 'Không có dữ liệu',
  onAdd,
  addButtonText
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div>
      {onAdd && (
        <div className="mb-4">
          <button
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {addButtonText || 'Thêm mới'}
          </button>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg min-w-[600px]">
          <table className="min-w-[600px] min-w-full divide-y divide-gray-200 text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {column.header}
                  </th>
                ))}
                {actions && (
                  <th scope="col" className="relative px-2 md:px-4 py-2 md:py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr
                  key={item.id || index}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${index}-${colIndex}`}
                      className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-gray-700 text-xs md:text-sm"
                    >
                      {column.render
                        ? column.render(item, index)
                        : item[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-gray-500 text-center"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      header: PropTypes.string.isRequired,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  actions: PropTypes.func,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onAdd: PropTypes.func,
  addButtonText: PropTypes.string
};

export default Table; 