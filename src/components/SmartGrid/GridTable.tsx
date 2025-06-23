
import React from 'react';
import { GridColumnConfig } from '@/types/smartgrid';

interface GridTableProps {
  columns: GridColumnConfig[];
  data: any[];
  showColumnFilters: boolean;
  showCheckboxes: boolean;
  viewMode: 'table' | 'card';
  editableColumns: string[] | boolean;
  onUpdate?: (row: any) => Promise<void>;
  onLinkClick?: (rowData: any, columnKey: string) => void;
  selectedRows: Set<number>;
  onSelectionChange?: (selectedRows: Set<number>) => void;
  rowClassName?: (row: any, index: number) => string;
  nestedRowRenderer?: (row: any, rowIndex: number) => React.ReactNode;
  filters: any[];
  setFilters: (filters: any[]) => void;
}

export function GridTable({
  columns,
  data,
  showColumnFilters,
  showCheckboxes,
  viewMode,
  editableColumns,
  onUpdate,
  onLinkClick,
  selectedRows,
  onSelectionChange,
  rowClassName,
  nestedRowRenderer,
  filters,
  setFilters
}: GridTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            {showCheckboxes && (
              <th className="w-12 px-4 py-2">
                <input type="checkbox" />
              </th>
            )}
            {columns.filter(col => !col.hidden).map((column) => (
              <th key={column.key} className="px-4 py-2 text-left font-medium text-gray-900">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={`border-b hover:bg-gray-50 ${rowClassName ? rowClassName(row, index) : ''}`}>
              {showCheckboxes && (
                <td className="px-4 py-2">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.has(index)}
                    onChange={() => {
                      const newSelection = new Set(selectedRows);
                      if (newSelection.has(index)) {
                        newSelection.delete(index);
                      } else {
                        newSelection.add(index);
                      }
                      onSelectionChange?.(newSelection);
                    }}
                  />
                </td>
              )}
              {columns.filter(col => !col.hidden).map((column) => (
                <td key={column.key} className="px-4 py-2">
                  {renderCell(row[column.key], column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(value: any, column: GridColumnConfig, row: any) {
  switch (column.type) {
    case 'Badge':
      if (typeof value === 'object' && value.value) {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${value.variant}`}>
            {value.value}
          </span>
        );
      }
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{value}</span>;
    
    case 'Link':
      return (
        <button 
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={() => column.onClick?.(row)}
        >
          {value}
        </button>
      );
    
    case 'DateTimeRange':
      if (typeof value === 'string' && value.includes('\n')) {
        const [start, end] = value.split('\n');
        return (
          <div className="text-sm">
            <div>{start}</div>
            <div className="text-gray-600">{end}</div>
          </div>
        );
      }
      return <span className="text-sm">{value}</span>;
    
    default:
      return <span>{value}</span>;
  }
}
