
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, GripVertical, Edit2, Eye, EyeOff } from 'lucide-react';
import { Column, GridPreferences } from '@/types/smartgrid';

interface ColumnManagerProps<T> {
  columns: Column<T>[];
  preferences: GridPreferences;
  onColumnOrderChange: (newOrder: string[]) => void;
  onColumnVisibilityToggle: (columnId: string) => void;
  onColumnHeaderChange: (columnId: string, header: string) => void;
}

export function ColumnManager<T>({
  columns,
  preferences,
  onColumnOrderChange,
  onColumnVisibilityToggle,
  onColumnHeaderChange
}: ColumnManagerProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

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

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2"
      >
        <Settings className="h-4 w-4" />
        <span>Columns</span>
      </Button>
    );
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Manage Columns</h3>
        <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
          ×
        </Button>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {orderedColumns.map((column) => {
          const isHidden = preferences.hiddenColumns.includes(column.id);
          const customHeader = preferences.columnHeaders[column.id];
          const displayHeader = customHeader || column.header;

          return (
            <div
              key={column.id}
              className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
              draggable
              onDragStart={() => handleDragStart(column.id)}
              onDragOver={(e) => handleDragOver(e, column.id)}
            >
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

              {column.mandatory && (
                <span className="text-xs text-orange-600 font-medium">Required</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
