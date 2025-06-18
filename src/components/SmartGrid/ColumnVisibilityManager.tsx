import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Settings2, Eye, EyeOff, Search, RotateCcw, ChevronDown, Check, X, GripVertical } from 'lucide-react';
import { GridColumnConfig, GridPreferences } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface ColumnVisibilityManagerProps {
  columns: GridColumnConfig[];
  preferences: GridPreferences;
  onColumnVisibilityToggle: (columnId: string) => void;
  onColumnHeaderChange?: (columnId: string, newHeader: string) => void;
  onSubRowToggle?: (columnId: string) => void;
  onSubRowReorder?: (newOrder: string[]) => void;
  onResetToDefaults: () => void;
}

export function ColumnVisibilityManager({
  columns,
  preferences,
  onColumnVisibilityToggle,
  onColumnHeaderChange,
  onSubRowToggle,
  onSubRowReorder,
  onResetToDefaults
}: ColumnVisibilityManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [draggedSubRowIndex, setDraggedSubRowIndex] = useState<number | null>(null);
  const [dragOverSubRowIndex, setDragOverSubRowIndex] = useState<number | null>(null);

  const filteredColumns = columns.filter(column =>
    column.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCount = columns.filter(col => !preferences.hiddenColumns.includes(col.key)).length;
  const totalCount = columns.length;
  const subRowCount = preferences.subRowColumns?.length || 0;
  const subRowColumns = preferences.subRowColumns || [];

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

  const handleEditStart = (columnKey: string, currentLabel: string) => {
    setEditingColumn(columnKey);
    setEditingValue(currentLabel);
  };

  const handleEditSave = (columnKey: string) => {
    if (onColumnHeaderChange && editingValue.trim()) {
      onColumnHeaderChange(columnKey, editingValue.trim());
    }
    setEditingColumn(null);
    setEditingValue('');
  };

  const handleEditCancel = () => {
    setEditingColumn(null);
    setEditingValue('');
  };

  const handleSubRowToggle = (columnKey: string) => {
    if (onSubRowToggle) {
      onSubRowToggle(columnKey);
    }
  };

  const handleSubRowDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSubRowIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSubRowDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSubRowIndex(index);
  };

  const handleSubRowDragLeave = () => {
    setDragOverSubRowIndex(null);
  };

  const handleSubRowDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedSubRowIndex === null || draggedSubRowIndex === dropIndex) {
      setDraggedSubRowIndex(null);
      setDragOverSubRowIndex(null);
      return;
    }

    const newOrder = [...subRowColumns];
    const draggedItem = newOrder[draggedSubRowIndex];
    
    // Remove the dragged item
    newOrder.splice(draggedSubRowIndex, 1);
    
    // Insert at the new position
    const adjustedDropIndex = draggedSubRowIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newOrder.splice(adjustedDropIndex, 0, draggedItem);

    if (onSubRowReorder) {
      onSubRowReorder(newOrder);
    }

    setDraggedSubRowIndex(null);
    setDragOverSubRowIndex(null);
  };

  const handleSubRowDragEnd = () => {
    setDraggedSubRowIndex(null);
    setDragOverSubRowIndex(null);
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Settings2 className="h-4 w-4" />
            <span>Columns ({visibleCount}/{totalCount})</span>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
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

            {/* Sub-row Columns Badges */}
            {subRowColumns.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <ChevronDown className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Sub-row Columns</span>
                  </div>
                  <span className="text-xs text-purple-600">{subRowColumns.length} column{subRowColumns.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subRowColumns.map((columnKey, index) => {
                    const column = columns.find(col => col.key === columnKey);
                    const displayLabel = preferences.columnHeaders[columnKey] || column?.label || columnKey;
                    const isDragging = draggedSubRowIndex === index;
                    const isDragOver = dragOverSubRowIndex === index;
                    
                    return (
                      <Badge
                        key={columnKey}
                        variant="secondary"
                        draggable
                        onDragStart={(e) => handleSubRowDragStart(e, index)}
                        onDragOver={(e) => handleSubRowDragOver(e, index)}
                        onDragLeave={handleSubRowDragLeave}
                        onDrop={(e) => handleSubRowDrop(e, index)}
                        onDragEnd={handleSubRowDragEnd}
                        className={cn(
                          "cursor-move bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300 transition-all flex items-center gap-1",
                          isDragging && "opacity-50 scale-95",
                          isDragOver && "ring-2 ring-purple-400 ring-offset-2"
                        )}
                        title="Drag to reorder, click X to remove from sub-row"
                      >
                        <GripVertical className="h-3 w-3 text-purple-600" />
                        {displayLabel}
                        <X 
                          className="h-3 w-3 hover:text-purple-900 cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubRowToggle(columnKey);
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
                <div className="text-xs text-purple-600 mt-2">
                  Drag badges to reorder columns or click X to move back to main row
                </div>
              </div>
            )}

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
            <div className="flex-1 overflow-y-auto space-y-3">
              {filteredColumns.map((column) => {
                const isVisible = !preferences.hiddenColumns.includes(column.key);
                const isMandatory = column.mandatory;
                const isSubRow = preferences.subRowColumns?.includes(column.key) || false;
                const isEditing = editingColumn === column.key;
                const displayLabel = preferences.columnHeaders[column.key] || column.label;

                return (
                  <div
                    key={column.key}
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      isVisible ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
                    )}
                  >
                    {/* Main Column Configuration */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
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
                          
                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  className="h-6 text-sm font-medium"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditSave(column.key);
                                    } else if (e.key === 'Escape') {
                                      handleEditCancel();
                                    }
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditSave(column.key)}
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleEditCancel}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="group/label cursor-pointer"
                                onClick={() => onColumnHeaderChange && handleEditStart(column.key, displayLabel)}
                              >
                                <div className="font-medium text-sm truncate">
                                  {displayLabel}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {column.key}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {isMandatory && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                            Required
                          </span>
                        )}
                        
                        {isSubRow && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                            <ChevronDown className="h-3 w-3" />
                            Sub-row
                          </span>
                        )}
                        
                        {column.type && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {column.type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sub-row Configuration Section */}
                    {onSubRowToggle && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <ChevronDown className="h-4 w-4 text-purple-600" />
                            <div>
                              <span className="text-sm text-gray-700 font-medium">Show in sub-row</span>
                              <div className="text-xs text-gray-500">Displays additional details below main row</div>
                            </div>
                          </div>
                          
                          <Checkbox
                            checked={isSubRow}
                            onCheckedChange={() => handleSubRowToggle(column.key)}
                            className="flex-shrink-0"
                          />
                        </div>
                      </div>
                    )}
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
                <div className="flex justify-between mt-1">
                  <span>Sub-row columns:</span>
                  <span className="font-medium">{subRowCount}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
