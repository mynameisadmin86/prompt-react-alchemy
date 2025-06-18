
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
import { Settings, GripVertical, Edit2, Eye, EyeOff, ArrowDown, ArrowUp } from 'lucide-react';
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
  const [dragOverSection, setDragOverSection] = useState<'main' | 'sub' | null>(null);

  const hasSubRowSupport = Boolean(onSubRowToggle);

  const orderedColumns = preferences.columnOrder
    .map(id => columns.find(col => col.id === id))
    .filter(Boolean) as Column<T>[];

  // Separate main-row and sub-row columns
  const mainRowColumns = orderedColumns.filter(col => !preferences.subRowColumns?.includes(col.id));
  const subRowColumns = orderedColumns.filter(col => preferences.subRowColumns?.includes(col.id));

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, section: 'main' | 'sub') => {
    e.preventDefault();
    if (draggedColumn) {
      setDragOverSection(section);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverSection(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetSection: 'main' | 'sub', targetColumnId?: string) => {
    e.preventDefault();
    if (!draggedColumn) return;

    const isCurrentlyInSubRow = preferences.subRowColumns?.includes(draggedColumn);
    const shouldMoveToSubRow = targetSection === 'sub';

    // Toggle sub-row status if moving between sections
    if (isCurrentlyInSubRow !== shouldMoveToSubRow && onSubRowToggle) {
      onSubRowToggle(draggedColumn);
    }

    // Handle reordering within the same section
    if (targetColumnId && draggedColumn !== targetColumnId) {
      const newOrder = [...preferences.columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(targetColumnId);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);

      onColumnOrderChange(newOrder);
    }

    setDraggedColumn(null);
    setDragOverSection(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverSection(null);
  };

  const handleHeaderSave = (columnId: string, newHeader: string) => {
    onColumnHeaderChange(columnId, newHeader);
    setEditingHeader(null);
  };

  const handleMoveToSubRow = (columnId: string) => {
    if (onSubRowToggle) {
      onSubRowToggle(columnId);
    }
  };

  const handleMoveToMainRow = (columnId: string) => {
    if (onSubRowToggle) {
      onSubRowToggle(columnId);
    }
  };

  const renderColumnItem = (column: Column<T>, section: 'main' | 'sub') => {
    const isHidden = preferences.hiddenColumns.includes(column.id);
    const customHeader = preferences.columnHeaders[column.id];
    const displayHeader = customHeader || column.header;
    const isDragged = draggedColumn === column.id;

    return (
      <div
        key={column.id}
        className={`border rounded p-3 hover:bg-gray-50 transition-all ${
          isDragged ? 'opacity-50 scale-95' : ''
        }`}
        draggable
        onDragStart={() => handleDragStart(column.id)}
        onDragOver={(e) => handleDragOver(e, section)}
        onDrop={(e) => handleDrop(e, section, column.id)}
        onDragEnd={handleDragEnd}
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

            {/* Move buttons - only show if sub-row support is enabled */}
            {hasSubRowSupport && (
              <div className="flex items-center space-x-1">
                {section === 'main' ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveToSubRow(column.id)}
                    className="h-6 w-6 p-0"
                    title="Move to sub-row"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveToMainRow(column.id)}
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
            Configure column visibility, order, and placement
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Main Row Columns Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Main Row Columns</h3>
              <span className="text-xs text-gray-500">
                {mainRowColumns.filter(col => !preferences.hiddenColumns.includes(col.id)).length} visible
              </span>
            </div>
            <div
              className={`space-y-2 max-h-48 overflow-y-auto p-2 rounded-lg border-2 border-dashed transition-colors ${
                dragOverSection === 'main' ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
              }`}
              onDragOver={(e) => handleDragOver(e, 'main')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'main')}
            >
              {mainRowColumns.length > 0 ? (
                mainRowColumns.map((column) => renderColumnItem(column, 'main'))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No main row columns
                </div>
              )}
            </div>
          </div>

          {/* Sub-row Columns Section - only show if sub-row support is enabled */}
          {hasSubRowSupport && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-purple-900">Sub-row Columns</h3>
                <span className="text-xs text-purple-600">
                  {subRowColumns.filter(col => !preferences.hiddenColumns.includes(col.id)).length} visible
                </span>
              </div>
              <div
                className={`space-y-2 max-h-48 overflow-y-auto p-2 rounded-lg border-2 border-dashed transition-colors ${
                  dragOverSection === 'sub' ? 'border-purple-400 bg-purple-50' : 'border-purple-200'
                }`}
                onDragOver={(e) => handleDragOver(e, 'sub')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'sub')}
              >
                {subRowColumns.length > 0 ? (
                  subRowColumns.map((column) => renderColumnItem(column, 'sub'))
                ) : (
                  <div className="text-center py-4 text-purple-500 text-sm">
                    Drag columns here for sub-row display
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary section */}
          <div className="pt-3 border-t text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total visible columns:</span>
              <span className="font-medium">{orderedColumns.length - preferences.hiddenColumns.length}</span>
            </div>
            {hasSubRowSupport && (
              <>
                <div className="flex justify-between">
                  <span>Main row columns:</span>
                  <span className="font-medium">{mainRowColumns.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sub-row columns:</span>
                  <span className="font-medium">{subRowColumns.length}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
