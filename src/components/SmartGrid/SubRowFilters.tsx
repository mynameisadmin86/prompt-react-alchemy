
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

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="sub-row-filters" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-700">Sub-row Filters</span>
            {Object.keys(activeFilters).some(key => key.startsWith('subrow-')) && (
              <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5">
                {Object.keys(activeFilters).filter(key => key.startsWith('subrow-')).length} active
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
            {filterableSubRowColumns.map((column) => (
              <div key={`subrow-${column.key}`} className="space-y-1">
                <div className="text-xs font-medium text-blue-600 truncate">
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
