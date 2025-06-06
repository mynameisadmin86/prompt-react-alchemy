
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, FilterX } from 'lucide-react';
import { GridColumnConfig, FilterConfig } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface ColumnFilterProps {
  column: GridColumnConfig;
  currentFilter?: FilterConfig;
  onFilterChange: (filter: FilterConfig | null) => void;
}

const filterOperators = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'gt', label: 'Greater than' },
  { value: 'lt', label: 'Less than' },
  { value: 'gte', label: 'Greater than or equal' },
  { value: 'lte', label: 'Less than or equal' }
];

export function ColumnFilter({ column, currentFilter, onFilterChange }: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [operator, setOperator] = useState(currentFilter?.operator || 'contains');
  const [value, setValue] = useState(currentFilter?.value || '');

  if (!column.filterable) {
    return null;
  }

  const handleApplyFilter = () => {
    if (value.trim()) {
      onFilterChange({
        column: column.key,
        value: value.trim(),
        operator: operator as any
      });
    } else {
      onFilterChange(null);
    }
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setValue('');
    onFilterChange(null);
    setIsOpen(false);
  };

  const hasActiveFilter = currentFilter && currentFilter.value;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 w-6 p-0 hover:bg-gray-100",
            hasActiveFilter && "text-blue-600 bg-blue-50"
          )}
        >
          {hasActiveFilter ? (
            <FilterX className="h-4 w-4" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white border shadow-lg" align="start">
        <div className="space-y-4">
          <div className="font-medium text-sm">Filter {column.label}</div>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Operator</label>
            <Select value={operator} onValueChange={setOperator}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {filterOperators.map(op => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-600">Value</label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter filter value..."
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyFilter();
                }
              }}
            />
          </div>

          <div className="flex space-x-2">
            <Button size="sm" onClick={handleApplyFilter} className="flex-1">
              Apply
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearFilter} className="flex-1">
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
