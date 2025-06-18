
import React from 'react';
import { Column, GridPreferences } from '@/types/smartgrid';
import { ColumnItem } from './ColumnItem';

interface ColumnSectionProps<T> {
  title: string;
  columns: Column<T>[];
  section: 'main' | 'sub';
  preferences: GridPreferences;
  draggedColumn: string | null;
  dragOverSection: 'main' | 'sub' | null;
  hasSubRowSupport: boolean;
  onDragStart: (columnId: string) => void;
  onDragOver: (e: React.DragEvent, section: 'main' | 'sub') => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetSection: 'main' | 'sub', targetColumnId?: string) => void;
  onDragEnd: () => void;
  onColumnVisibilityToggle: (columnId: string) => void;
  onColumnHeaderChange: (columnId: string, header: string) => void;
  onMoveToSubRow: (columnId: string) => void;
  onMoveToMainRow: (columnId: string) => void;
}

export function ColumnSection<T>({
  title,
  columns,
  section,
  preferences,
  draggedColumn,
  dragOverSection,
  hasSubRowSupport,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onColumnVisibilityToggle,
  onColumnHeaderChange,
  onMoveToSubRow,
  onMoveToMainRow
}: ColumnSectionProps<T>) {
  const visibleCount = columns.filter(col => !preferences.hiddenColumns.includes(col.id)).length;
  const isSubRow = section === 'sub';
  const borderColor = isSubRow ? 'border-purple-200' : 'border-gray-200';
  const activeBorderColor = isSubRow ? 'border-purple-400 bg-purple-50' : 'border-blue-400 bg-blue-50';
  const titleColor = isSubRow ? 'text-purple-900' : 'text-gray-900';
  const countColor = isSubRow ? 'text-purple-600' : 'text-gray-500';
  const emptyTextColor = isSubRow ? 'text-purple-500' : 'text-gray-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-medium ${titleColor}`}>{title}</h3>
        <span className={`text-xs ${countColor}`}>
          {visibleCount} visible
        </span>
      </div>
      <div
        className={`space-y-2 max-h-48 overflow-y-auto p-2 rounded-lg border-2 border-dashed transition-colors ${
          dragOverSection === section ? activeBorderColor : borderColor
        }`}
        onDragOver={(e) => onDragOver(e, section)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, section)}
      >
        {columns.length > 0 ? (
          columns.map((column) => (
            <ColumnItem
              key={column.id}
              column={column}
              section={section}
              preferences={preferences}
              draggedColumn={draggedColumn}
              hasSubRowSupport={hasSubRowSupport}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              onColumnVisibilityToggle={onColumnVisibilityToggle}
              onColumnHeaderChange={onColumnHeaderChange}
              onMoveToSubRow={onMoveToSubRow}
              onMoveToMainRow={onMoveToMainRow}
            />
          ))
        ) : (
          <div className={`text-center py-4 ${emptyTextColor} text-sm`}>
            {isSubRow ? 'Drag columns here for sub-row display' : 'No main row columns'}
          </div>
        )}
      </div>
    </div>
  );
}
