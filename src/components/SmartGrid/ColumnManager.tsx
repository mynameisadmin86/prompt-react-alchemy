
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { Column, GridPreferences } from '@/types/smartgrid';
import { ColumnSection } from './ColumnSection';
import { ColumnSummary } from './ColumnSummary';

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
          <ColumnSection
            title="Main Row Columns"
            columns={mainRowColumns}
            section="main"
            preferences={preferences}
            draggedColumn={draggedColumn}
            dragOverSection={dragOverSection}
            hasSubRowSupport={hasSubRowSupport}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onColumnVisibilityToggle={onColumnVisibilityToggle}
            onColumnHeaderChange={onColumnHeaderChange}
            onMoveToSubRow={handleMoveToSubRow}
            onMoveToMainRow={handleMoveToMainRow}
          />

          {/* Sub-row Columns Section - only show if sub-row support is enabled */}
          {hasSubRowSupport && (
            <ColumnSection
              title="Sub-row Columns"
              columns={subRowColumns}
              section="sub"
              preferences={preferences}
              draggedColumn={draggedColumn}
              dragOverSection={dragOverSection}
              hasSubRowSupport={hasSubRowSupport}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onColumnVisibilityToggle={onColumnVisibilityToggle}
              onColumnHeaderChange={onColumnHeaderChange}
              onMoveToSubRow={handleMoveToSubRow}
              onMoveToMainRow={handleMoveToMainRow}
            />
          )}

          {/* Summary section */}
          <ColumnSummary
            orderedColumns={orderedColumns}
            mainRowColumns={mainRowColumns}
            subRowColumns={subRowColumns}
            preferences={preferences}
            hasSubRowSupport={hasSubRowSupport}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
