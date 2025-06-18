
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Edit2, Eye, EyeOff, ArrowDown, ArrowUp } from 'lucide-react';
import { Column, GridPreferences } from '@/types/smartgrid';

interface ColumnItemProps<T> {
  column: Column<T>;
  section: 'main' | 'sub';
  preferences: GridPreferences;
  draggedColumn: string | null;
  hasSubRowSupport: boolean;
  onDragStart: (columnId: string) => void;
  onDragOver: (e: React.DragEvent, section: 'main' | 'sub') => void;
  onDrop: (e: React.DragEvent, targetSection: 'main' | 'sub', targetColumnId?: string) => void;
  onDragEnd: () => void;
  onColumnVisibilityToggle: (columnId: string) => void;
  onColumnHeaderChange: (columnId: string, header: string) => void;
  onMoveToSubRow: (columnId: string) => void;
  onMoveToMainRow: (columnId: string) => void;
}

export function ColumnItem<T>({
  column,
  section,
  preferences,
  draggedColumn,
  hasSubRowSupport,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onColumnVisibilityToggle,
  onColumnHeaderChange,
  onMoveToSubRow,
  onMoveToMainRow
}: ColumnItemProps<T>) {
  const [editingHeader, setEditingHeader] = useState<string | null>(null);

  const isHidden = preferences.hiddenColumns.includes(column.id);
  const customHeader = preferences.columnHeaders[column.id];
  const displayHeader = customHeader || column.header;
  const isDragged = draggedColumn === column.id;

  const handleHeaderSave = (newHeader: string) => {
    onColumnHeaderChange(column.id, newHeader);
    setEditingHeader(null);
  };

  return (
    <div
      key={column.id}
      className={`border rounded p-3 hover:bg-gray-50 transition-all ${
        isDragged ? 'opacity-50 scale-95' : ''
      }`}
      draggable
      onDragStart={() => onDragStart(column.id)}
      onDragOver={(e) => onDragOver(e, section)}
      onDrop={(e) => onDrop(e, section, column.id)}
      onDragEnd={onDragEnd}
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

        <div className="flex-1 min-w-0">
          {editingHeader === column.id ? (
            <Input
              defaultValue={displayHeader}
              onBlur={(e) => handleHeaderSave(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleHeaderSave(e.currentTarget.value);
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

          {hasSubRowSupport && (
            <div className="flex items-center space-x-1">
              {section === 'main' ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMoveToSubRow(column.id)}
                  className="h-6 w-6 p-0"
                  title="Move to sub-row"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMoveToMainRow(column.id)}
                  className="h-6 w-6 p-0"
                  title="Move to main row"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
