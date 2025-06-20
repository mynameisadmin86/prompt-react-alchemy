
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
    <div className="p-4 border-b">
      <div className="text-sm font-medium text-gray-700 mb-3">Column Filters</div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
        {filterableColumns.map((column) => (
          <div key={column.key} className="space-y-1">
            <div className="text-xs font-medium text-gray-600 truncate">
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
    </div>
  );
}
