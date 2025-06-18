
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
import { Settings, GripVertical, Edit2, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Column, GridPreferences } from '@/types/smartgrid';

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

  const hasSubRowSupport = Boolean(onSubRowToggle);

  const orderedColumns = preferences.columnOrder
    .map(id => columns.find(col => col.id === id))
    .filter(Boolean) as Column<T>[];

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const newOrder = [...preferences.columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    onColumnOrderChange(newOrder);
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
            Configure column visibility, order, and sub-row settings
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Sub-row bulk actions - only show if sub-row support is enabled */}
          {hasSubRowSupport && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-purple-800">Sub-row Actions</span>
                <span className="text-xs text-purple-600">
                  {preferences.subRowColumns?.length || 0} selected
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllSubRows}
                  className="flex-1 text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAllSubRows}
                  className="flex-1 text-xs"
                >
                  Deselect All
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {orderedColumns.map((column) => {
              const isHidden = preferences.hiddenColumns.includes(column.id);
              const isSubRow = preferences.subRowColumns?.includes(column.id);
              const customHeader = preferences.columnHeaders[column.id];
              const displayHeader = customHeader || column.header;

              return (
                <div
                  key={column.id}
                  className="border rounded p-3 hover:bg-gray-50"
                  draggable
                  onDragStart={() => handleDragStart(column.id)}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                >
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    
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

                    {/* Sub-row icon indicator - only show if sub-row support is enabled */}
                    {hasSubRowSupport && isSubRow && (
                      <ChevronDown className="h-4 w-4 text-purple-600" />
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

                      {/* Sub-row checkbox - only show if sub-row support is enabled */}
                      {hasSubRowSupport && (
                        <div className="flex items-center space-x-1">
                          <Checkbox
                            checked={isSubRow}
                            onCheckedChange={() => handleSubRowToggle(column.id)}
                            className="shrink-0"
                          />
                          <span className="text-xs text-gray-600">Sub-row</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary section */}
          <div className="mt-4 pt-3 border-t text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Visible columns:</span>
              <span className="font-medium">{orderedColumns.length - preferences.hiddenColumns.length}</span>
            </div>
            {hasSubRowSupport && (
              <div className="flex justify-between">
                <span>Sub-row columns:</span>
                <span className="font-medium">{preferences.subRowColumns?.length || 0}</span>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
