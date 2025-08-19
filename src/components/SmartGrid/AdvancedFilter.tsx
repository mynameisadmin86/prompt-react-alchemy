import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ColumnFilterInput } from './ColumnFilterInput';
import { FilterSetModal } from './FilterSetModal';
import { FilterSetDropdown } from './FilterSetDropdown';
import { GridColumnConfig, ExtraFilter } from '@/types/smartgrid';
import { FilterValue, FilterSet } from '@/types/filterSystem';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AdvancedFilterProps {
  columns: GridColumnConfig[];
  subRowColumns: GridColumnConfig[];
  showAdvancedFilter: boolean;
  onToggleAdvancedFilter: () => void;
  extraFilters?: ExtraFilter[];
  onSearch?: (filters: Record<string, FilterValue>) => void;
  onSaveSet?: (filters: Record<string, FilterValue>, name: string) => void;
  savedSets?: FilterSet[];
  onSetDefault?: (filterSetId: string) => void;
  onRename?: (filterSetId: string, newName: string) => void;
  onDelete?: (filterSetId: string) => void;
}

export function AdvancedFilter({
  columns,
  subRowColumns,
  showAdvancedFilter,
  onToggleAdvancedFilter,
  extraFilters = [],
  onSearch,
  onSaveSet,
  savedSets = [],
  onSetDefault,
  onRename,
  onDelete
}: AdvancedFilterProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, FilterValue>>({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubRowFiltersOpen, setIsSubRowFiltersOpen] = useState(false);
  const [isExtraFiltersOpen, setIsExtraFiltersOpen] = useState(false);
  
  const { toast } = useToast();

  // Get main-row filterable columns (only non-subRow columns that are filterable) - ALL columns regardless of visibility
  const mainRowFilterableColumns = columns.filter(col => 
    col.filterable !== false && 
    col.subRow !== true
  );
  
  // Get sub-row filterable columns (only subRow columns that are filterable) - ALL columns regardless of visibility
  const subRowFilterableColumns = columns.filter(col => 
    col.filterable !== false && 
    col.subRow === true
  );

  // Apply default filter set on load
  useEffect(() => {
    const defaultSet = savedSets.find(set => set.isDefault);
    if (defaultSet && Object.keys(activeFilters).length === 0) {
      applyFilterSet(defaultSet);
    }
  }, [savedSets]);

  const getFilterType = (column: GridColumnConfig): 'text' | 'select' | 'date' | 'dateRange' | 'time' | 'number' | 'boolean' => {
    if (column.options) return 'select';
    
    switch (column.type) {
      case 'Date':
      case 'DateTimeRange':
        return 'date';
      default:
        return 'text';
    }
  };

  const handleFilterChange = useCallback((columnKey: string, value: FilterValue | undefined) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (value === undefined) {
        delete newFilters[columnKey];
      } else {
        newFilters[columnKey] = value;
      }
      
      return newFilters;
    });
  }, []);

  const handleSearch = useCallback(() => {
    onSearch?.(activeFilters);
    
    toast({
      title: "Filters Applied",
      description: `Applied ${Object.keys(activeFilters).length} filters`,
    });
  }, [activeFilters, onSearch, toast]);

  const handleSaveFilterSet = async (name: string, isDefault: boolean) => {
    try {
      setLoading(true);
      onSaveSet?.(activeFilters, name);
      
      toast({
        title: "Success",
        description: `Filter set "${name}" saved successfully`,
      });
    } catch (error) {
      console.error('Failed to save filter set:', error);
      toast({
        title: "Error",
        description: "Failed to save filter set",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilterSet = (filterSet: FilterSet) => {
    setActiveFilters(filterSet.filters);
    onSearch?.(filterSet.filters);
    
    toast({
      title: "Filter Set Applied",
      description: `Applied "${filterSet.name}" with ${Object.keys(filterSet.filters).length} filters`,
    });
  };

  const handleSetDefaultInternal = async (filterSetId: string) => {
    try {
      setLoading(true);
      onSetDefault?.(filterSetId);
      
      const filterSet = savedSets.find(set => set.id === filterSetId);
      toast({
        title: "Default Set Updated",
        description: `"${filterSet?.name}" is now the default filter set`,
      });
    } catch (error) {
      console.error('Failed to update default filter set:', error);
      toast({
        title: "Error",
        description: "Failed to update default filter set",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRenameInternal = async (filterSetId: string, newName: string) => {
    try {
      onRename?.(filterSetId, newName);
      
      toast({
        title: "Filter Set Renamed",
        description: `Filter set renamed to "${newName}"`,
      });
    } catch (error) {
      console.error('Failed to rename filter set:', error);
      toast({
        title: "Error",
        description: "Failed to rename filter set",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInternal = async (filterSetId: string) => {
    try {
      const deletedSet = savedSets.find(set => set.id === filterSetId);
      onDelete?.(filterSetId);
      
      toast({
        title: "Filter Set Deleted",
        description: `"${deletedSet?.name}" has been deleted`,
      });
    } catch (error) {
      console.error('Failed to delete filter set:', error);
      toast({
        title: "Error",
        description: "Failed to delete filter set",
        variant: "destructive"
      });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onSearch?.({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;
  const subRowFilterCount = Object.keys(activeFilters).filter(key => key.startsWith('subrow-')).length;
  const extraFilterCount = Object.keys(activeFilters).filter(key => key.startsWith('extra-')).length;

  return (
    <div className="space-y-2">
      {/* Filter Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
        <div className="flex items-center space-x-2">
          <Button
            variant={showAdvancedFilter ? "default" : "outline"}
            size="sm"
            onClick={onToggleAdvancedFilter}
            className={cn(
              "transition-all",
              showAdvancedFilter && "bg-blue-600 hover:bg-blue-700 text-white"
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
              onClick={clearAllFilters}
              className="text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}

          {/* Search Button */}
          <Button
            variant="default"
            size="sm"
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveModal(true)}
              disabled={loading}
              className="transition-all hover:bg-yellow-50 hover:border-yellow-300"
            >
              <Star className="h-4 w-4 mr-1" />
              Save Set
            </Button>
          )}

          <FilterSetDropdown
            filterSets={savedSets}
            onApply={applyFilterSet}
            onSetDefault={handleSetDefaultInternal}
            onRename={handleRenameInternal}
            onDelete={handleDeleteInternal}
          />
        </div>
      </div>

      {/* Filter Panel - Only show when showAdvancedFilter is true */}
      {showAdvancedFilter && (
        <div className="bg-white border rounded shadow-sm">
          {/* Main Column Filters - Only non-subRow columns */}
          {mainRowFilterableColumns.length > 0 && (
            <div className="grid gap-2 p-3" style={{ gridTemplateColumns: `repeat(${mainRowFilterableColumns.length}, 1fr)` }}>
              {mainRowFilterableColumns.map((column) => (
                <div key={column.key} className="space-y-1">
                  <div className="text-xs font-medium text-gray-600 truncate">
                    {column.label}
                  </div>
                  <ColumnFilterInput
                    column={column}
                    value={activeFilters[column.key]}
                    onChange={(value) => handleFilterChange(column.key, value)}
                    onApply={handleSearch}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Extra Filters Section */}
          {extraFilters.length > 0 && (
            <div className="border-t">
              <Collapsible open={isExtraFiltersOpen} onOpenChange={setIsExtraFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <div className="bg-green-50/50 px-3 py-2 cursor-pointer hover:bg-green-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs font-medium text-green-700">
                          Extra Filters
                        </div>
                        {extraFilterCount > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 rounded-full px-1.5 py-0.5">
                            {extraFilterCount}
                          </span>
                        )}
                      </div>
                      {isExtraFiltersOpen ? (
                        <ChevronUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="bg-green-50/30 p-3">
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${extraFilters.length}, 1fr)` }}>
                      {extraFilters.map((filter) => (
                        <div key={`extra-${filter.key}`} className="space-y-1">
                          <div className="text-xs font-medium text-green-600 truncate">
                            {filter.label}
                          </div>
                          <ColumnFilterInput
                            column={{
                              key: filter.key,
                              label: filter.label,
                              type: 'Text',
                              options: filter.options
                            } as GridColumnConfig}
                            value={activeFilters[`extra-${filter.key}`]}
                            onChange={(value) => handleFilterChange(`extra-${filter.key}`, value)}
                            onApply={handleSearch}
                            isSubRow={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {/* Collapsible Sub-Row Filters - Only subRow columns */}
          {subRowFilterableColumns.length > 0 && (
            <div className="border-t">
              <Collapsible open={isSubRowFiltersOpen} onOpenChange={setIsSubRowFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <div className="bg-blue-50/50 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs font-medium text-blue-700">
                          Sub-row Filters
                        </div>
                        {subRowFilterCount > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5">
                            {subRowFilterCount}
                          </span>
                        )}
                      </div>
                      {isSubRowFiltersOpen ? (
                        <ChevronUp className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="bg-blue-50/30 p-3">
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${subRowFilterableColumns.length}, 1fr)` }}>
                      {subRowFilterableColumns.map((column) => (
                        <div key={`subrow-${column.key}`} className="space-y-1">
                          <div className="text-xs font-medium text-blue-600 truncate">
                            {column.label}
                          </div>
                          <ColumnFilterInput
                            column={column}
                            value={activeFilters[`subrow-${column.key}`]}
                            onChange={(value) => handleFilterChange(`subrow-${column.key}`, value)}
                            onApply={handleSearch}
                            isSubRow={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      )}

      {/* Save Filter Set Modal */}
      <FilterSetModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveFilterSet}
        activeFilters={activeFilters}
        existingNames={savedSets.map(set => set.name)}
      />
    </div>
  );
}