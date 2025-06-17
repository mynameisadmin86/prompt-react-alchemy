
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, ArrowUp, ArrowDown, Edit2, Check, X } from 'lucide-react';
import { GridColumnConfig } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface GridHeaderProps {
  column: GridColumnConfig;
  sortConfig?: { column: string; direction: 'asc' | 'desc' };
  onSort?: (columnKey: string) => void;
  onColumnHeaderChange?: (columnKey: string, newHeader: string) => void;
  className?: string;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  column,
  sortConfig,
  onSort,
  onColumnHeaderChange,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(column.label);

  const isSorted = sortConfig?.column === column.key;
  const sortDirection = isSorted ? sortConfig.direction : null;

  const handleSort = () => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setTempValue(column.label);
  };

  const handleSaveEdit = () => {
    if (onColumnHeaderChange && tempValue.trim() !== '' && tempValue.trim() !== column.label) {
      onColumnHeaderChange(column.key, tempValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempValue(column.label);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const getSortIcon = () => {
    if (!column.sortable) return null;
    
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    } else if (sortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4" />;
    } else {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
  };

  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200",
        column.sortable && "cursor-pointer hover:bg-gray-100",
        className
      )}
    >
      <div className="flex items-center justify-between group">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="h-7 text-xs font-medium uppercase"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveEdit}
                className="h-6 w-6 p-0"
              >
                <Check className="h-3 w-3 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          ) : (
            <>
              <span
                className={cn(
                  "truncate",
                  column.sortable && "select-none"
                )}
                onClick={handleSort}
                title={column.label}
              >
                {column.label}
              </span>
              {onColumnHeaderChange && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleStartEdit}
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                  title="Edit column name"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
        </div>
        
        {!isEditing && (
          <div
            className="flex items-center ml-2"
            onClick={handleSort}
          >
            {getSortIcon()}
          </div>
        )}
      </div>
    </th>
  );
};
