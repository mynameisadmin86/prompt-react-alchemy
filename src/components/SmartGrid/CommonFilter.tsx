
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { GridColumnConfig, FilterConfig } from '@/types/smartgrid';

interface CommonFilterProps {
  columns: GridColumnConfig[];
  onFilterChange?: (filter: FilterConfig | null) => void;
}

export function CommonFilter({ columns, onFilterChange }: CommonFilterProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  const handleFilterChange = (value: string) => {
    setGlobalFilter(value);
    if (onFilterChange) {
      onFilterChange(value ? { column: 'global', value, operator: 'contains' } : null);
    }
  };

  const handleClearFilter = () => {
    setGlobalFilter('');
    if (onFilterChange) {
      onFilterChange(null);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search all columns..."
        value={globalFilter}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="pl-9 pr-8 h-9"
      />
      {globalFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilter}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
          title="Clear search"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
