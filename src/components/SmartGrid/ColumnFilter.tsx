
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FilterConfig } from '@/types/smartgrid';

interface ColumnFilterProps {
  column: any; // TanStack table column
  table: any; // TanStack table instance
}

export function ColumnFilter({ column, table }: ColumnFilterProps) {
  const [value, setValue] = useState(column.getFilterValue() || '');

  useEffect(() => {
    setValue(column.getFilterValue() || '');
  }, [column.getFilterValue()]);

  const handleFilterChange = (newValue: string) => {
    setValue(newValue);
    column.setFilterValue(newValue || undefined);
  };

  const handleClearFilter = () => {
    setValue('');
    column.setFilterValue(undefined);
  };

  const hasActiveFilter = column.getFilterValue();

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={(e) => handleFilterChange(e.target.value)}
        placeholder={`Filter...`}
        className="h-8 text-xs pr-8"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleClearFilter();
          }
        }}
      />
      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilter}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          title="Clear filter"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
