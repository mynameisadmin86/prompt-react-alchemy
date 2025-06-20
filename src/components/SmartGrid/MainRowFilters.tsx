
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
    <div className="flex items-stretch gap-0 bg-gray-25 border-b border-gray-200">
      {filterableColumns.map((column, index) => (
        <div 
          key={column.key} 
          className="flex-none border-r border-gray-100 last:border-r-0 p-2"
          style={{ width: `${column.width || 150}px` }}
        >
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
