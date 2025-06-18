
import React, { useState, useCallback } from 'react';
import { GridColumnConfig } from '@/types/smartgrid';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableSubRowProps {
  row: any;
  columns: GridColumnConfig[];
  subRowColumnOrder: string[];
  onReorderSubRowColumns: (newOrder: string[]) => void;
}

export const DraggableSubRow: React.FC<DraggableSubRowProps> = ({
  row,
  columns,
  subRowColumnOrder,
  onReorderSubRowColumns
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

  const renderSubRowCellValue = useCallback((value: any, column: GridColumnConfig) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    switch (column.type) {
      case 'Badge':
        let displayValue: string;
        let statusColor: string;

        if (typeof value === 'object' && value !== null && 'value' in value) {
          displayValue = value.value;
          statusColor = value.variant || 'bg-gray-50 text-gray-600 border border-gray-200';
        } else {
          displayValue = String(value || '');
          statusColor = 'bg-gray-50 text-gray-600 border border-gray-200';
        }

        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {displayValue}
          </span>
        );
      case 'DateTimeRange':
        const [date, time] = String(value).split(' ');
        return (
          <div>
            <div className="font-medium">{date}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
        );
      case 'Date':
        try {
          const date = new Date(value);
          return date.toLocaleDateString();
        } catch {
          return String(value);
        }
      default:
        return String(value);
    }
  }, []);

  if (orderedSubRowColumns.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orderedSubRowColumns.map((column) => {
        const value = row[column.key];
        const isDragged = draggedColumn === column.key;
        const isDragOver = dragOverColumn === column.key;
        
        return (
          <div
            key={column.key}
            className={cn(
              "group relative p-3 bg-gray-50 rounded-lg border transition-all duration-200 ease-in-out cursor-move",
              isDragged && "opacity-50 scale-95 shadow-lg",
              isDragOver && "bg-blue-100 border-blue-300 scale-105",
              "hover:bg-gray-100 hover:shadow-md"
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
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-medium">
                  {column.label}
                </div>
                <div className="text-sm text-gray-900 font-medium break-words">
                  {renderSubRowCellValue(value, column)}
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
  );
};
