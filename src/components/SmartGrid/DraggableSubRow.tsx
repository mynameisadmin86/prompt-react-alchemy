
import React, { useState, useCallback } from 'react';
import { GridColumnConfig, GridPreferences } from '@/types/smartgrid';
import { GripVertical, Edit2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicLazySelect } from '@/components/DynamicPanel/DynamicLazySelect';
import { format } from 'date-fns';
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
  const [tempValue, setTempValue] = useState<string>('');

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

  const handleEdit = useCallback((columnKey: string) => {
    const currentValue = row[columnKey];
    setTempValue(String(currentValue || ''));
    onSubRowEditStart(rowIndex, columnKey);
  }, [row, rowIndex, onSubRowEditStart]);

  const handleSave = useCallback((columnKey: string) => {
    onSubRowEdit(rowIndex, columnKey, tempValue);
    setTempValue('');
  }, [rowIndex, tempValue, onSubRowEdit]);

  const handleCancel = useCallback(() => {
    onSubRowEditCancel();
    setTempValue('');
  }, [onSubRowEditCancel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, columnKey: string) => {
    if (e.key === 'Enter') {
      handleSave(columnKey);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const renderSubRowCellValue = useCallback((value: any, column: GridColumnConfig) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
    const isEditable = column.editable;

    // Render editing UI based on column type
    if (isEditing) {
      switch (column.type) {
        case 'Date':
          const dateValue = tempValue ? new Date(tempValue) : undefined;
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-8 justify-start text-left font-normal text-xs px-3",
                    !dateValue && "text-muted-foreground"
                  )}
                  autoFocus
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={(date) => {
                    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
                    setTempValue(dateString);
                    handleSave(column.key);
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          );

        case 'Time':
          return (
            <div className="relative">
              <Input
                type="time"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => handleSave(column.key)}
                onKeyDown={(e) => handleKeyDown(e, column.key)}
                className="w-full h-8 text-sm"
                autoFocus
              />
              <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          );

        case 'Integer':
          return (
            <Input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => handleSave(column.key)}
              onKeyDown={(e) => handleKeyDown(e, column.key)}
              className="w-full h-8 text-sm"
              autoFocus
            />
          );

        case 'Select':
        case 'Dropdown':
          return (
            <select
              value={tempValue}
              onChange={(e) => {
                setTempValue(e.target.value);
                handleSave(column.key);
              }}
              onBlur={() => handleSave(column.key)}
              className="w-full h-8 px-3 text-xs rounded-md border border-gray-300 bg-white focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            >
              <option value="">Select...</option>
              {column.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );

        case 'LazySelect':
          if (!column.fetchOptions) {
            return (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border">
                fetchOptions is required for LazySelect
              </div>
            );
          }
          return (
            <DynamicLazySelect
              fetchOptions={column.fetchOptions}
              value={tempValue}
              onChange={(newValue) => {
                const stringValue = Array.isArray(newValue) ? newValue[0] : (newValue || '');
                setTempValue(stringValue);
                handleSave(column.key);
              }}
              placeholder="Select..."
              className="h-8 text-xs"
              hideSearch={column.hideSearch}
              disableLazyLoading={column.disableLazyLoading}
            />
          );

        case 'String':
        case 'Text':
        case 'EditableText':
        default:
          return (
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => handleSave(column.key)}
              onKeyDown={(e) => handleKeyDown(e, column.key)}
              className="w-full h-8 text-sm"
              autoFocus
            />
          );
      }
    }

    // Render display value based on column type
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    const displayContent = (() => {
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
            <Badge className={cn("text-xs", statusColor)}>
              {displayValue}
            </Badge>
          );

        case 'DateTimeRange':
          const dateTimeString = String(value);
          if (dateTimeString.includes('\n')) {
            const [startDateTime, endDateTime] = dateTimeString.split('\n');
            return (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Start:</div>
                <div className="font-medium text-sm">{startDateTime}</div>
                <div className="text-xs text-gray-500">End:</div>
                <div className="font-medium text-sm">{endDateTime}</div>
              </div>
            );
          }
          return <div className="font-medium text-sm">{dateTimeString}</div>;

        case 'Date':
          try {
            const date = new Date(value);
            return <div className="font-medium text-sm">{date.toLocaleDateString()}</div>;
          } catch {
            return <div className="font-medium text-sm">{String(value)}</div>;
          }

        case 'Time':
          return <div className="font-medium text-sm">{String(value)}</div>;

        case 'Integer':
          return <div className="font-medium text-sm">{Number(value).toLocaleString()}</div>;

        case 'Select':
        case 'Dropdown':
        case 'LazySelect':
          return <div className="font-medium text-sm">{String(value)}</div>;

        case 'String':
        case 'Text':
        case 'EditableText':
        default:
          return <div className="font-medium text-sm break-words">{String(value)}</div>;
      }
    })();

    if (isEditable) {
      return (
        <div className="group relative">
          {displayContent}
          <button
            onClick={() => handleEdit(column.key)}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <Edit2 className="h-3 w-3 text-gray-500" />
          </button>
        </div>
      );
    }

    return displayContent;
  }, [editingCell, rowIndex, tempValue, handleSave, handleKeyDown, handleEdit]);

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
        {orderedSubRowColumns.map((column) => {
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
    </div>
  );
};
