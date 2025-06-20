
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Filter, X } from 'lucide-react';
import { FilterSetDropdown } from './FilterSetDropdown';
import { FilterValue, FilterSet } from '@/types/filterSystem';
import { cn } from '@/lib/utils';

interface FilterControlsProps {
  showFilterRow: boolean;
  onToggleFilterRow: () => void;
  activeFilterCount: number;
  onClearAllFilters: () => void;
  onShowSaveModal: () => void;
  filterSets: FilterSet[];
  onApplyFilterSet: (filterSet: FilterSet) => void;
  onSetDefault: (filterSetId: string) => void;
  onRename: (filterSetId: string, newName: string) => void;
  onDelete: (filterSetId: string) => void;
  loading: boolean;
}

export function FilterControls({
  showFilterRow,
  onToggleFilterRow,
  activeFilterCount,
  onClearAllFilters,
  onShowSaveModal,
  filterSets,
  onApplyFilterSet,
  onSetDefault,
  onRename,
  onDelete,
  loading
}: FilterControlsProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
      <div className="flex items-center space-x-2">
        <Button
          variant={showFilterRow ? "default" : "outline"}
          size="sm"
          onClick={onToggleFilterRow}
          className={cn(
            "transition-all",
            showFilterRow && "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 text-xs bg-white text-blue-600 rounded-full px-1.5 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAllFilters}
            className="text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowSaveModal}
            disabled={loading}
            className="transition-all hover:bg-yellow-50 hover:border-yellow-300"
          >
            <Star className="h-4 w-4 mr-1" />
            Save Set
          </Button>
        )}

        <FilterSetDropdown
          filterSets={filterSets}
          onApply={onApplyFilterSet}
          onSetDefault={onSetDefault}
          onRename={onRename}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
