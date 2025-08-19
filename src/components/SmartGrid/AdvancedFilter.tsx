import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GridColumnConfig, AdvancedFilterField, FilterCondition } from '@/types/smartgrid';
import { FilterValue, FilterSet, FilterSystemAPI } from '@/types/filterSystem';
import { FilterSetModal } from './FilterSetModal';
import { FilterSetDropdown } from './FilterSetDropdown';
import { useToast } from '@/hooks/use-toast';

interface AdvancedFilterProps {
  columns: GridColumnConfig[];
  extraFilters?: AdvancedFilterField[];
  onApply: (filters: FilterCondition[]) => void;
  onClear: () => void;
  className?: string;
  defaultShowAdvancedFilter?: boolean;
  gridId?: string;
  userId?: string;
  api?: FilterSystemAPI;
}

// Helper function to determine filter type from column type
const getFilterType = (columnType: string): 'text' | 'dropdown' | 'date' | 'dateRange' | 'number' => {
  switch (columnType) {
    case 'Date':
    case 'DateTimeRange':
      return 'date';
    case 'Dropdown':
    case 'Badge':
      return 'dropdown';
    default:
      return 'text';
  }
};

export function AdvancedFilter({
  columns,
  extraFilters = [],
  onApply,
  onClear,
  className,
  defaultShowAdvancedFilter = false,
  gridId = 'advanced-filter',
  userId = 'user',
  api
}: AdvancedFilterProps) {
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>({});
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(defaultShowAdvancedFilter);
  const [filterSets, setFilterSets] = useState<FilterSet[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  // Combine column filters with extra filters
  const allFilters = useMemo(() => {
    const filterableColumns = columns.filter(col => col.showInAdvancedFilter !== false);
    const columnFilters: AdvancedFilterField[] = filterableColumns.map(col => ({
      field: col.key,
      label: col.label,
      type: getFilterType(col.type),
      options: col.options?.map(opt => ({ label: opt, value: opt }))
    }));
    
    return [...columnFilters, ...extraFilters];
  }, [columns, extraFilters]);

  const applyFilterSet = useCallback((filterSet: FilterSet) => {
    setFilterValues(filterSet.filters);
    
    // Apply filters directly
    const conditions: FilterCondition[] = Object.entries(filterSet.filters)
      .filter(([_, filterValue]) => filterValue.value !== '' && filterValue.value !== undefined && filterValue.value !== null)
      .map(([field, filterValue]) => {
        const filter = allFilters.find(f => f.field === field);
        return {
          field,
          value: filterValue.value,
          operator: filterValue.operator as any,
          type: filter?.type as any
        };
      });

    onApply(conditions);
    
    toast({
      title: "Filter Set Applied",
      description: `Applied "${filterSet.name}" with ${Object.keys(filterSet.filters).length} filters`,
    });
  }, [allFilters, onApply, toast]);

  // Load saved filter sets on mount
  useEffect(() => {
    if (api && userId) {
      loadFilterSets();
    }
  }, [api, userId, gridId]);

  // Apply default filter set on load
  useEffect(() => {
    const defaultSet = filterSets.find(set => set.isDefault);
    if (defaultSet && Object.keys(filterValues).length === 0) {
      applyFilterSet(defaultSet);
    }
  }, [filterSets, filterValues, applyFilterSet]);

  const getDefaultOperator = (type: string): FilterValue['operator'] => {
    switch (type) {
      case 'text':
        return 'contains';
      case 'dropdown':
        return 'equals';
      case 'date':
        return 'equals';
      case 'number':
        return 'equals';
      default:
        return 'contains';
    }
  };

  const loadFilterSets = async () => {
    if (!api) return;
    
    try {
      setLoading(true);
      const sets = await api.getUserFilterSets(userId, gridId);
      setFilterSets(sets);
    } catch (error) {
      console.error('Failed to load filter sets:', error);
      toast({
        title: "Error",
        description: "Failed to load saved filter sets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((field: string, value: any) => {
    const filter = allFilters.find(f => f.field === field);
    const operator = filterValues[field]?.operator || getDefaultOperator(filter?.type || 'text');
    
    setFilterValues(prev => {
      const newFilters = { ...prev };
      
      if (value === undefined || value === '' || value === null) {
        delete newFilters[field];
      } else {
        newFilters[field] = { value, operator };
      }
      
      return newFilters;
    });
  }, [allFilters, filterValues]);

  const handleApply = useCallback(() => {
    const conditions: FilterCondition[] = Object.entries(filterValues)
      .filter(([_, filterValue]) => filterValue.value !== '' && filterValue.value !== undefined && filterValue.value !== null)
      .map(([field, filterValue]) => {
        const filter = allFilters.find(f => f.field === field);
        return {
          field,
          value: filterValue.value,
          operator: filterValue.operator as any,
          type: filter?.type as any
        };
      });

    onApply(conditions);
  }, [filterValues, allFilters, onApply]);

  const handleClear = useCallback(() => {
    setFilterValues({});
    onClear();
  }, [onClear]);

  const handleSaveFilterSet = async (name: string, isDefault: boolean) => {
    if (!api) {
      toast({
        title: "Error",
        description: "Filter set API not available",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // If setting as default, remove default from other sets
      if (isDefault) {
        const promises = filterSets
          .filter(set => set.isDefault)
          .map(set => api.updateFilterSet(set.id, { isDefault: false }));
        await Promise.all(promises);
      }

      const newSet = await api.saveUserFilterSet(userId, name, filterValues, isDefault, gridId);
      setFilterSets(prev => [...prev.map(set => ({ ...set, isDefault: false })), newSet]);
      
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


  const handleSetDefault = async (filterSetId: string) => {
    if (!api) return;

    try {
      setLoading(true);
      
      // Remove default from all sets
      const promises = filterSets.map(set => 
        api.updateFilterSet(set.id, { isDefault: set.id === filterSetId })
      );
      await Promise.all(promises);
      
      setFilterSets(prev => prev.map(set => ({
        ...set,
        isDefault: set.id === filterSetId
      })));
      
      const filterSet = filterSets.find(set => set.id === filterSetId);
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

  const handleRename = async (filterSetId: string, newName: string) => {
    if (!api) return;

    try {
      const updatedSet = await api.updateFilterSet(filterSetId, { name: newName });
      setFilterSets(prev => prev.map(set => 
        set.id === filterSetId ? updatedSet : set
      ));
      
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

  const handleDelete = async (filterSetId: string) => {
    if (!api) return;

    try {
      await api.deleteFilterSet(filterSetId);
      const deletedSet = filterSets.find(set => set.id === filterSetId);
      setFilterSets(prev => prev.filter(set => set.id !== filterSetId));
      
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

  const renderFilterInput = (filter: AdvancedFilterField) => {
    const currentValue = filterValues[filter.field]?.value || '';

    switch (filter.type) {
      case 'dropdown':
        return (
          <Select 
            value={currentValue} 
            onValueChange={(value) => handleFilterChange(filter.field, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Filter ${filter.label.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border z-50">
              {filter.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !currentValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentValue ? format(new Date(currentValue), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border z-50" align="start">
              <Calendar
                mode="single"
                selected={currentValue ? new Date(currentValue) : undefined}
                onSelect={(date) => handleFilterChange(filter.field, date?.toISOString())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            placeholder={`Filter ${filter.label.toLowerCase()}...`}
            className="w-full"
          />
        );

      default: // text
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            placeholder={`Filter ${filter.label.toLowerCase()}...`}
            className="w-full"
          />
        );
    }
  };

  const activeFiltersCount = Object.keys(filterValues).filter(
    key => filterValues[key]?.value !== '' && filterValues[key]?.value !== undefined && filterValues[key]?.value !== null
  ).length;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Filter Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
        <div className="flex items-center space-x-2">
          <Button
            variant={showAdvancedFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className={cn(
              "transition-all",
              showAdvancedFilter && "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 text-xs bg-white text-blue-600 rounded-full px-1.5 py-0.5">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
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
            filterSets={filterSets}
            onApply={applyFilterSet}
            onSetDefault={handleSetDefault}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Filter Panel - Only show when showAdvancedFilter is true */}
      {showAdvancedFilter && (
        <div className="bg-white border rounded shadow-sm">
          <div className="grid gap-2 p-3" style={{ gridTemplateColumns: `repeat(${Math.min(allFilters.length, 4)}, 1fr)` }}>
            {allFilters.map((filter) => (
              <div key={filter.field} className="space-y-1">
                <div className="text-xs font-medium text-gray-600 truncate">
                  {filter.label}
                </div>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Filter Set Modal */}
      <FilterSetModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveFilterSet}
        activeFilters={filterValues}
        existingNames={filterSets.map(set => set.name)}
      />
    </div>
  );
}