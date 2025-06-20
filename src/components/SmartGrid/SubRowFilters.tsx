
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ColumnFilterInput } from './ColumnFilterInput';
import { GridColumnConfig } from '@/types/smartgrid';
import { FilterValue } from '@/types/filterSystem';

interface SubRowFiltersProps {
  subRowColumns: GridColumnConfig[];
  activeFilters: Record<string, FilterValue>;
  onFilterChange: (columnKey: string, value: FilterValue | undefined) => void;
  onApplyFilters: () => void;
}

export function SubRowFilters({
  subRowColumns,
  activeFilters,
  onFilterChange,
  onApplyFilters
}: SubRowFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterableSubRowColumns = subRowColumns.filter(col => col.filterable !== false);

  if (filterableSubRowColumns.length === 0) {
    return null;
  }

  const activeSubRowFilters = Object.keys(activeFilters).filter(key => key.startsWith('subrow-'));

  return (
    <div className="border-b border-gray-200">
      {/* Toggle Header */}
      <div className="flex items-center justify-between bg-blue-50 border-b border-blue-200 px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-blue-700 hover:bg-blue-100"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">Sub-row Filters</span>
          {activeSubRowFilters.length > 0 && (
            <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
              {activeSubRowFilters.length}
            </span>
          )}
        </Button>
      </div>

      {/* Expandable Filter Content */}
      {isExpanded && (
        <div className="bg-blue-25 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filterableSubRowColumns.map((column) => (
              <div key={`subrow-${column.key}`} className="space-y-1">
                <div className="text-xs text-blue-600 font-medium truncate">
                  {column.label}
                </div>
                <ColumnFilterInput
                  column={column}
                  value={activeFilters[`subrow-${column.key}`]}
                  onChange={(value) => onFilterChange(`subrow-${column.key}`, value)}
                  onApply={onApplyFilters}
                  isSubRow={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
