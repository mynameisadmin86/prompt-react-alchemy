
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter } from 'lucide-react';
import { GridColumnConfig, FilterConfig } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface ColumnFilterProps {
  column: GridColumnConfig;
  currentFilter?: FilterConfig;
  onFilterChange: (filter: FilterConfig | null) => void;
}

export function ColumnFilter({ column, currentFilter, onFilterChange }: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(currentFilter?.value || '');

  if (!column.filterable) {
    return null;
  }

  const handleApplyFilter = () => {
    if (value.trim()) {
      onFilterChange({
        column: column.key,
        value: value.trim(),
        operator: 'contains'
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
            "absolute top-1 right-1 h-4 w-4 p-0 rounded transition-all duration-200 z-10",
            hasActiveFilter 
              ? "opacity-100 text-blue-600 bg-blue-50 hover:bg-blue-100" 
              : "opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          )}
        >
          <Filter className="h-3 w-3" />
          {hasActiveFilter && (
            <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white border shadow-lg" align="start">
        <div className="space-y-4">
          <div className="font-medium text-sm">Filter {column.label}</div>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Search for text that contains:</label>
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
