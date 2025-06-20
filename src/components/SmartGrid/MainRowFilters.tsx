
import React from 'react';
import { ColumnFilterInput } from './ColumnFilterInput';
import { GridColumnConfig } from '@/types/smartgrid';
import { FilterValue } from '@/types/filterSystem';

interface MainRowFiltersProps {
  columns: GridColumnConfig[];
  activeFilters: Record<string, FilterValue>;
  onFilterChange: (columnKey: string, value: FilterValue | undefined) => void;
  onApplyFilters: () => void;
}

export function MainRowFilters({
  columns,
  activeFilters,
  onFilterChange,
  onApplyFilters
}: MainRowFiltersProps) {
  const filterableColumns = columns.filter(col => col.filterable !== false);

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200">
      {filterableColumns.map((column) => (
        <div key={column.key} className="flex-1 min-w-[120px]">
          <div className="text-xs text-gray-500 mb-1 truncate">
            {column.label}
          </div>
          <ColumnFilterInput
            column={column}
            value={activeFilters[column.key]}
            onChange={(value) => onFilterChange(column.key, value)}
            onApply={onApplyFilters}
          />
        </div>
      ))}
    </div>
  );
}
