
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings2, Eye, EyeOff, Search, RotateCcw, GripVertical } from 'lucide-react';
import { GridColumnConfig, GridPreferences } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface ColumnVisibilityManagerProps {
  columns: GridColumnConfig[];
  preferences: GridPreferences;
  onColumnVisibilityToggle: (columnId: string) => void;
  onResetToDefaults: () => void;
  onColumnReorder?: (newOrder: string[]) => void;
}

export function ColumnVisibilityManager({
  columns,
  preferences,
  onColumnVisibilityToggle,
  onResetToDefaults,
  onColumnReorder
}: ColumnVisibilityManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Order columns based on preferences
  const orderedColumns = React.useMemo(() => {
    const columnMap = new Map(columns.map(col => [col.key, col]));
    const ordered = preferences.columnOrder
      .map(key => columnMap.get(key))
      .filter(Boolean) as GridColumnConfig[];
    
    // Add any new columns not in the order
    const remainingColumns = columns.filter(col => !preferences.columnOrder.includes(col.key));
    return [...ordered, ...remainingColumns];
  }, [columns, preferences.columnOrder]);

  const filteredColumns = orderedColumns.filter(column =>
    column.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCount = columns.filter(col => !preferences.hiddenColumns.includes(col.key)).length;
  const totalCount = columns.length;

  const handleToggleAll = () => {
    const allVisible = preferences.hiddenColumns.length === 0;
    const mandatoryColumns = columns.filter(col => col.mandatory).map(col => col.key);
    
    if (allVisible) {
      // Hide all non-mandatory columns
      columns.forEach(col => {
        if (!col.mandatory) {
          onColumnVisibilityToggle(col.key);
        }
      });
    } else {
      // Show all columns
      preferences.hiddenColumns.forEach(columnId => {
        onColumnVisibilityToggle(columnId);
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null || draggedIndex === index) return;

    // Create new order
    const newColumns = [...filteredColumns];
    const draggedItem = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(index, 0, draggedItem);
    
    // Update the drag index
    setDraggedIndex(index);
    
    // Call the reorder function if provided
    if (onColumnReorder) {
      const newOrder = newColumns.map(col => col.key);
      onColumnReorder(newOrder);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Settings2 className="h-4 w-4" />
          <span>Columns ({visibleCount}/{totalCount})</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>Configure Columns</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToDefaults}
              className="text-gray-600 hover:text-gray-900"
              title="Reset to defaults"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 flex-1 min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Toggle All */}
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Toggle All</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleAll}
              className="text-xs"
            >
              {preferences.hiddenColumns.length === 0 ? 'Hide All' : 'Show All'}
            </Button>
          </div>

          {/* Column List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredColumns.map((column, index) => {
              const isVisible = !preferences.hiddenColumns.includes(column.key);
              const isMandatory = column.mandatory;
              const isDragging = draggedIndex === index;

              return (
                <div
                  key={column.key}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-move",
                    isVisible ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100",
                    isDragging && "opacity-50"
                  )}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />

                  <Checkbox
                    checked={isVisible}
                    onCheckedChange={() => !isMandatory && onColumnVisibilityToggle(column.key)}
                    disabled={isMandatory}
                    className="flex-shrink-0"
                  />
                  
                  <div className="flex items-center space-x-2 min-w-0">
                    {isVisible ? (
                      <Eye className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">
                        {column.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {column.key}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {isMandatory && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                        Required
                      </span>
                    )}
                    
                    {column.type && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {column.type}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredColumns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No columns found matching "{searchTerm}"</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="pt-4 border-t bg-gray-50 rounded-lg px-4 py-3">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Visible columns:</span>
                <span className="font-medium">{visibleCount} of {totalCount}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Hidden columns:</span>
                <span className="font-medium">{totalCount - visibleCount}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
