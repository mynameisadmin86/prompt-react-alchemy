
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  const filterableSubRowColumns = subRowColumns.filter(col => col.filterable !== false);

  if (filterableSubRowColumns.length === 0) {
    return null;
  }

  const activeSubRowFilters = Object.keys(activeFilters).filter(key => key.startsWith('subrow-'));

  return (
    <Accordion type="single" collapsible className="w-full border-0">
      <AccordionItem value="sub-row-filters" className="border-0">
        <AccordionTrigger className="px-4 py-2 hover:no-underline bg-blue-50 border-b border-blue-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-700">Sub-row Filters</span>
            {activeSubRowFilters.length > 0 && (
              <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
                {activeSubRowFilters.length}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-2 bg-blue-25">
          <div className="flex flex-wrap gap-2">
            {filterableSubRowColumns.map((column) => (
              <div key={`subrow-${column.key}`} className="flex-1 min-w-[120px]">
                <div className="text-xs text-blue-600 mb-1 truncate">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
