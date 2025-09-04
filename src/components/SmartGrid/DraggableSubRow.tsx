
import React, { useState, useCallback } from 'react';
import { GridColumnConfig, GridPreferences } from '@/types/smartgrid';
import { GripVertical } from 'lucide-react';
import { CellRenderer } from './CellRenderer';
import { cn } from '@/lib/utils';

interface DraggableSubRowProps {
  row: any;
  rowIndex: number;
  columns: GridColumnConfig[];
  subRowColumnOrder: string[];
  editingCell: { rowIndex: number; columnKey: string } | null;
  onReorderSubRowColumns: (newOrder: string[]) => void;
  onSubRowEdit: (rowIndex: number, columnKey: string, value: any) => void;
  onSubRowEditStart: (rowIndex: number, columnKey: string) => void;
  onSubRowEditCancel: () => void;
  preferences?: GridPreferences;
}

export const DraggableSubRow: React.FC<DraggableSubRowProps> = ({
  row,
  rowIndex,
  columns,
  subRowColumnOrder,
  editingCell,
  onReorderSubRowColumns,
  onSubRowEdit,
  onSubRowEditStart,
  onSubRowEditCancel,
  preferences
}) => {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Get sub-row columns and apply custom ordering
  const subRowColumns = columns.filter(col => col.subRow === true);
  const orderedSubRowColumns = subRowColumnOrder.length > 0 
    ? subRowColumnOrder
        .map(id => subRowColumns.find(col => col.key === id))
        .filter((col): col is GridColumnConfig => col !== undefined)
        .concat(subRowColumns.filter(col => !subRowColumnOrder.includes(col.key)))
    : subRowColumns;

  const handleDragStart = useCallback((e: React.DragEvent, columnKey: string) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnKey);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== targetColumnKey) {
      setDragOverColumn(targetColumnKey);
      e.dataTransfer.dropEffect = 'move';
    }
  }, [draggedColumn]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const currentOrder = orderedSubRowColumns.map(col => col.key);
    const draggedIndex = currentOrder.indexOf(draggedColumn);
    const targetIndex = currentOrder.indexOf(targetColumnKey);

    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    onReorderSubRowColumns(newOrder);
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, [draggedColumn, orderedSubRowColumns, onReorderSubRowColumns]);

  const handleDragEnd = useCallback(() => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, []);

  const renderSubRowCellValue = useCallback((value: any, column: GridColumnConfig, columnIndex: number) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
    const isEditable = column.editable;

    return (
      <CellRenderer
        value={value}
        row={row}
        column={column}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        isEditing={isEditing}
        isEditable={isEditable || false}
        onEdit={onSubRowEdit}
        onEditStart={onSubRowEditStart}
        onEditCancel={onSubRowEditCancel}
      />
    );
  }, [editingCell, rowIndex, row, onSubRowEdit, onSubRowEditStart, onSubRowEditCancel]);

  if (orderedSubRowColumns.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No sub-row columns configured
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-2 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {orderedSubRowColumns.map((column, columnIndex) => {
          const value = row[column.key];
          const isDragged = draggedColumn === column.key;
          const isDragOver = dragOverColumn === column.key;
          
          return (
            <div
              key={column.key}
              className={cn(
                "group relative p-2 bg-white rounded border transition-all duration-200 ease-in-out cursor-move",
                isDragged && "opacity-50 scale-95 shadow-lg",
                isDragOver && "bg-blue-100 border-blue-300 scale-105",
                "hover:shadow-md"
              )}
              draggable
              onDragStart={(e) => handleDragStart(e, column.key)}
              onDragOver={(e) => handleDragOver(e, column.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.key)}
              onDragEnd={handleDragEnd}
              aria-grabbed={isDragged}
              aria-dropeffect="move"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <GripVertical className="h-4 w-4 text-gray-400 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {preferences?.columnHeaders[column.key] || column.label}
                    </div>
                    {column.editable && (
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Editable
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-900">
                    {renderSubRowCellValue(value, column, columnIndex)}
                  </div>
                </div>
              </div>
              
              {/* Drag indicator overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-blue-200/30 rounded-lg border-2 border-blue-400 border-dashed animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
