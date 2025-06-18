
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Settings, GripVertical, Edit2, Eye, EyeOff, ChevronDown, X } from 'lucide-react';
import { Column, GridPreferences } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface ColumnManagerProps<T> {
  columns: Column<T>[];
  preferences: GridPreferences;
  onColumnOrderChange: (newOrder: string[]) => void;
  onColumnVisibilityToggle: (columnId: string) => void;
  onColumnHeaderChange: (columnId: string, header: string) => void;
  onSubRowToggle?: (columnId: string) => void;
}

export function ColumnManager<T>({
  columns,
  preferences,
  onColumnOrderChange,
  onColumnVisibilityToggle,
  onColumnHeaderChange,
  onSubRowToggle
}: ColumnManagerProps<T>) {
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [draggedFromSubRow, setDraggedFromSubRow] = useState<boolean>(false);
  const [dragOverTarget, setDragOverTarget] = useState<{ type: 'main' | 'subrow'; index?: number } | null>(null);

  const hasSubRowSupport = Boolean(onSubRowToggle);

  const orderedColumns = preferences.columnOrder
    .map(id => columns.find(col => col.id === id))
    .filter(Boolean) as Column<T>[];

  const mainRowColumns = orderedColumns.filter(col => !preferences.subRowColumns?.includes(col.id));
  const subRowColumns = (preferences.subRowColumns || [])
    .map(id => columns.find(col => col.id === id))
    .filter(Boolean) as Column<T>[];

  const handleDragStart = (columnId: string, fromSubRow: boolean = false) => {
    setDraggedColumn(columnId);
    setDraggedFromSubRow(fromSubRow);
  };

  const handleDragOver = (e: React.DragEvent, targetType: 'main' | 'subrow', targetIndex?: number) => {
    e.preventDefault();
    if (!draggedColumn) return;

    setDragOverTarget({ type: targetType, index: targetIndex });
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetType: 'main' | 'subrow', targetIndex?: number) => {
    e.preventDefault();
    if (!draggedColumn) return;

    if (draggedFromSubRow && targetType === 'main') {
      // Moving from sub-row to main row
      if (onSubRowToggle) {
        onSubRowToggle(draggedColumn);
      }
    } else if (!draggedFromSubRow && targetType === 'subrow') {
      // Moving from main row to sub-row
      if (onSubRowToggle) {
        onSubRowToggle(draggedColumn);
      }
    } else if (draggedFromSubRow && targetType === 'subrow' && typeof targetIndex === 'number') {
      // Reordering within sub-row
      const newSubRowOrder = [...(preferences.subRowColumns || [])];
      const draggedIndex = newSubRowOrder.indexOf(draggedColumn);
      const targetIdx = targetIndex;

      if (draggedIndex !== -1 && draggedIndex !== targetIdx) {
        newSubRowOrder.splice(draggedIndex, 1);
        newSubRowOrder.splice(targetIdx, 0, draggedColumn);
        
        // Update sub-row order in preferences
        const newPreferences = { 
          ...preferences, 
          subRowColumns: newSubRowOrder 
        };
        // Note: We would need a callback to update sub-row order specifically
        // For now, we'll use the toggle to maintain the order
      }
    } else if (!draggedFromSubRow && targetType === 'main' && typeof targetIndex === 'number') {
      // Reordering within main columns
      const newOrder = [...preferences.columnOrder];
      const mainColumns = newOrder.filter(id => !preferences.subRowColumns?.includes(id));
      const draggedIndex = mainColumns.indexOf(draggedColumn);
      const targetIdx = targetIndex;

      if (draggedIndex !== -1 && draggedIndex !== targetIdx) {
        mainColumns.splice(draggedIndex, 1);
        mainColumns.splice(targetIdx, 0, draggedColumn);
        
        // Rebuild the full order maintaining sub-row columns in their positions
        const newFullOrder = [...newOrder];
        const mainColumnPositions = newFullOrder
          .map((id, index) => ({ id, index }))
          .filter(({ id }) => !preferences.subRowColumns?.includes(id));
          
        mainColumns.forEach((id, newIndex) => {
          const originalPos = mainColumnPositions[newIndex];
          if (originalPos) {
            newFullOrder[originalPos.index] = id;
          }
        });
        
        onColumnOrderChange(newFullOrder);
      }
    }

    setDraggedColumn(null);
    setDraggedFromSubRow(false);
    setDragOverTarget(null);
  };

  const handleHeaderSave = (columnId: string, newHeader: string) => {
    onColumnHeaderChange(columnId, newHeader);
    setEditingHeader(null);
  };

  const handleSubRowToggle = (columnId: string) => {
    if (onSubRowToggle) {
      onSubRowToggle(columnId);
    }
  };

  const handleSelectAllSubRows = () => {
    if (onSubRowToggle) {
      const visibleColumns = columns.filter(col => !preferences.hiddenColumns.includes(col.id));
      visibleColumns.forEach(column => {
        if (!preferences.subRowColumns?.includes(column.id)) {
          onSubRowToggle(column.id);
        }
      });
    }
  };

  const handleDeselectAllSubRows = () => {
    if (onSubRowToggle) {
      const subRowColumns = preferences.subRowColumns || [];
      subRowColumns.forEach(columnId => {
        onSubRowToggle(columnId);
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Columns</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 sm:max-w-96">
        <SheetHeader>
          <SheetTitle>Manage Columns</SheetTitle>
          <SheetDescription>
            Configure column visibility, order, and sub-row settings. Drag columns between sections.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Main Row Columns */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Main Table Columns</h3>
              <span className="text-xs text-gray-500">{mainRowColumns.length} columns</span>
            </div>
            
            <div 
              className={cn(
                "min-h-20 p-3 border-2 border-dashed rounded-lg transition-colors",
                dragOverTarget?.type === 'main' ? "border-blue-400 bg-blue-50" : "border-gray-200"
              )}
              onDragOver={(e) => handleDragOver(e, 'main')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'main')}
            >
              <div className="space-y-2">
                {mainRowColumns.map((column, index) => {
                  const isHidden = preferences.hiddenColumns.includes(column.id);
                  const customHeader = preferences.columnHeaders[column.id];
                  const displayHeader = customHeader || column.header;
                  const isDragging = draggedColumn === column.id && !draggedFromSubRow;

                  return (
                    <div
                      key={column.id}
                      className={cn(
                        "border rounded p-3 bg-white transition-all cursor-move",
                        isDragging ? "opacity-50 scale-95" : "hover:bg-gray-50"
                      )}
                      draggable
                      onDragStart={() => handleDragStart(column.id, false)}
                      onDragOver={(e) => handleDragOver(e, 'main', index)}
                      onDrop={(e) => handleDrop(e, 'main', index)}
                    >
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        
                        <Checkbox
                          checked={!isHidden}
                          onCheckedChange={() => onColumnVisibilityToggle(column.id)}
                          disabled={column.mandatory}
                          className="shrink-0"
                        />

                        {isHidden ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-green-600" />
                        )}

                        <div className="flex-1 min-w-0">
                          {editingHeader === column.id ? (
                            <Input
                              defaultValue={displayHeader}
                              onBlur={(e) => handleHeaderSave(column.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleHeaderSave(column.id, e.currentTarget.value);
                                } else if (e.key === 'Escape') {
                                  setEditingHeader(null);
                                }
                              }}
                              className="h-6 px-1 text-sm"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm truncate">{displayHeader}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingHeader(column.id)}
                                className="h-4 w-4 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {column.mandatory && (
                            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {mainRowColumns.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Drop columns here to add them to the main table
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub-row Columns - only show if sub-row support is enabled */}
          {hasSubRowSupport && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ChevronDown className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-medium text-purple-800">Sub-row Columns</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-purple-600">{subRowColumns.length} columns</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllSubRows}
                      className="text-xs h-6 px-2"
                    >
                      Add All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAllSubRows}
                      className="text-xs h-6 px-2"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              
              <div 
                className={cn(
                  "min-h-20 p-3 border-2 border-dashed rounded-lg transition-colors bg-purple-50/30",
                  dragOverTarget?.type === 'subrow' ? "border-purple-400 bg-purple-100" : "border-purple-200"
                )}
                onDragOver={(e) => handleDragOver(e, 'subrow')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'subrow')}
              >
                <div className="space-y-2">
                  {subRowColumns.map((column, index) => {
                    const customHeader = preferences.columnHeaders[column.id];
                    const displayHeader = customHeader || column.header;
                    const isDragging = draggedColumn === column.id && draggedFromSubRow;

                    return (
                      <div
                        key={column.id}
                        className={cn(
                          "border rounded p-3 bg-white border-purple-200 transition-all cursor-move",
                          isDragging ? "opacity-50 scale-95" : "hover:bg-purple-50"
                        )}
                        draggable
                        onDragStart={() => handleDragStart(column.id, true)}
                        onDragOver={(e) => handleDragOver(e, 'subrow', index)}
                        onDrop={(e) => handleDrop(e, 'subrow', index)}
                      >
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-purple-400" />
                          <ChevronDown className="h-4 w-4 text-purple-600" />

                          <div className="flex-1 min-w-0">
                            <span className="text-sm truncate font-medium text-purple-800">{displayHeader}</span>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSubRowToggle(column.id)}
                            className="h-6 w-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                            title="Move to main table"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {subRowColumns.length === 0 && (
                    <div className="text-center py-4 text-purple-500 text-sm">
                      Drop columns here to show them in expandable sub-rows
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Summary section */}
          <div className="pt-3 border-t text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Visible main columns:</span>
              <span className="font-medium">{mainRowColumns.length - preferences.hiddenColumns.length}</span>
            </div>
            {hasSubRowSupport && (
              <div className="flex justify-between">
                <span>Sub-row columns:</span>
                <span className="font-medium text-purple-600">{subRowColumns.length}</span>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Drag columns between sections to reorganize your table layout
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
