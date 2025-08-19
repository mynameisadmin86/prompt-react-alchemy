import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GridColumnConfig, AdvancedFilterField, FilterCondition } from '@/types/smartgrid';

interface AdvancedFilterProps {
  columns: GridColumnConfig[];
  extraFilters?: AdvancedFilterField[];
  onApply: (filters: FilterCondition[]) => void;
  onClear: () => void;
  className?: string;
}

interface FilterValue {
  value: any;
  operator: string;
}

export function AdvancedFilter({
  columns,
  extraFilters = [],
  onApply,
  onClear,
  className
}: AdvancedFilterProps) {
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>({});

  // Get filterable columns - show all columns (visible + hidden) if showInAdvancedFilter is true or not defined
  const filterableColumns = useMemo(() => {
    return columns.filter(col => col.showInAdvancedFilter !== false);
  }, [columns]);

  // Combine column filters with extra filters
  const allFilters = useMemo(() => {
    const columnFilters: AdvancedFilterField[] = filterableColumns.map(col => ({
      field: col.key,
      label: col.label,
      type: getFilterType(col.type) as 'text' | 'dropdown' | 'date' | 'dateRange' | 'number',
      options: col.options?.map(opt => ({ label: opt, value: opt }))
    }));
    
    return [...columnFilters, ...extraFilters];
  }, [filterableColumns, extraFilters]);

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

  const getDefaultOperator = (type: string) => {
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

  const getOperatorOptions = (type: string) => {
    switch (type) {
      case 'text':
        return [
          { label: 'Contains', value: 'contains' },
          { label: 'Equals', value: 'equals' },
          { label: 'Starts with', value: 'startsWith' },
          { label: 'Ends with', value: 'endsWith' }
        ];
      case 'number':
        return [
          { label: 'Equals', value: 'equals' },
          { label: 'Greater than', value: 'gt' },
          { label: 'Less than', value: 'lt' },
          { label: 'Greater or equal', value: 'gte' },
          { label: 'Less or equal', value: 'lte' }
        ];
      case 'date':
        return [
          { label: 'Equals', value: 'equals' },
          { label: 'After', value: 'gt' },
          { label: 'Before', value: 'lt' }
        ];
      default:
        return [{ label: 'Equals', value: 'equals' }];
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    const filter = allFilters.find(f => f.field === field);
    const operator = filterValues[field]?.operator || getDefaultOperator(filter?.type || 'text');
    
    setFilterValues(prev => ({
      ...prev,
      [field]: { value, operator }
    }));
  };

  const handleOperatorChange = (field: string, operator: string) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: { ...prev[field], operator }
    }));
  };

  const handleRemoveFilter = (field: string) => {
    setFilterValues(prev => {
      const newValues = { ...prev };
      delete newValues[field];
      return newValues;
    });
  };

  const handleApply = () => {
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
  };

  const handleClear = () => {
    setFilterValues({});
    onClear();
  };

  const renderFilterInput = (filter: AdvancedFilterField) => {
    const currentValue = filterValues[filter.field]?.value || '';
    const currentOperator = filterValues[filter.field]?.operator || getDefaultOperator(filter.type);

    switch (filter.type) {
      case 'dropdown':
        return (
          <Select 
            value={currentValue} 
            onValueChange={(value) => handleFilterChange(filter.field, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select value..." />
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
            placeholder="Enter number..."
            className="w-full"
          />
        );

      default: // text
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => handleFilterChange(filter.field, e.target.value)}
            placeholder="Enter text..."
            className="w-full"
          />
        );
    }
  };

  const activeFiltersCount = Object.keys(filterValues).filter(
    key => filterValues[key]?.value !== '' && filterValues[key]?.value !== undefined && filterValues[key]?.value !== null
  ).length;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              disabled={activeFiltersCount === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button 
              size="sm" 
              onClick={handleApply}
              disabled={activeFiltersCount === 0}
            >
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allFilters.map((filter) => (
            <div key={filter.field} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {filter.label}
                </label>
                {filterValues[filter.field]?.value && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFilter(filter.field)}
                    className="h-auto p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {filter.type !== 'dropdown' && (
                  <Select 
                    value={filterValues[filter.field]?.operator || getDefaultOperator(filter.type)}
                    onValueChange={(operator) => handleOperatorChange(filter.field, operator)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border z-50">
                      {getOperatorOptions(filter.type).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                <div className="flex-1">
                  {renderFilterInput(filter)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}