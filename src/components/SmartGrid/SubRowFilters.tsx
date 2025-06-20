
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
  mainRowColumns: GridColumnConfig[];
}

export function SubRowFilters({
  subRowColumns,
  activeFilters,
  onFilterChange,
  onApplyFilters,
  mainRowColumns
}: SubRowFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterableSubRowColumns = subRowColumns.filter(col => col.filterable !== false);
  const filterableMainColumns = mainRowColumns.filter(col => col.filterable !== false);

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
        <div className="flex items-stretch gap-0 bg-blue-25 border-b border-gray-200">
          {filterableMainColumns.map((mainColumn, index) => {
            // Find corresponding sub-row column
            const subRowColumn = filterableSubRowColumns.find(subCol => 
              subCol.key === mainColumn.key || subCol.key.replace('subrow-', '') === mainColumn.key
            );
            
            return (
              <div 
                key={`subrow-spacing-${mainColumn.key}`} 
                className="flex-none border-r border-gray-100 last:border-r-0 p-2"
                style={{ width: `${mainColumn.width || 150}px` }}
              >
                {subRowColumn && (
                  <div className="space-y-1">
                    <div className="text-xs text-blue-600 font-medium truncate">
                      {subRowColumn.label}
                    </div>
                    <ColumnFilterInput
                      column={subRowColumn}
                      value={activeFilters[`subrow-${subRowColumn.key}`]}
                      onChange={(value) => onFilterChange(`subrow-${subRowColumn.key}`, value)}
                      onApply={onApplyFilters}
                      isSubRow={true}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
