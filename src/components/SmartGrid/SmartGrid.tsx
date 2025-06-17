
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ChevronUp, 
  ChevronDown, 
  Settings, 
  Download, 
  Filter,
  X,
  MoreHorizontal,
  Eye,
  EyeOff,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  GridColumnConfig, 
  SmartGridProps, 
  SortConfig, 
  FilterConfig,
  GridAPI,
  GridPlugin
} from '@/types/smartgrid';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import { CellRenderer } from './CellRenderer';
import { CellEditor } from './CellEditor';
import { ColumnManager } from './ColumnManager';
import { downloadJsonPlugin } from '@/plugins/downloadJsonPlugin';

export function SmartGrid({
  columns,
  data,
  editableColumns = false,
  mandatoryColumns = [],
  onInlineEdit,
  onBulkUpdate,
  onPreferenceSave,
  onDataFetch,
  onUpdate,
  onLinkClick,
  paginationMode = 'pagination',
  nestedRowRenderer,
  plugins = [downloadJsonPlugin],
  selectedRows,
  onSelectionChange,
  rowClassName
}: SmartGridProps) {
  // Convert GridColumnConfig to legacy Column format for useGridPreferences
  const legacyColumns = useMemo(() => 
    columns.map(col => ({
      id: col.key,
      header: col.label,
      accessor: col.key as any,
      sortable: col.sortable,
      filterable: col.filterable,
      editable: col.editable,
      mandatory: col.mandatory,
      type: 'text' as const
    })), [columns]);

  const preferencesData = useGridPreferences(legacyColumns);
  const [preferences, setPreferences] = useState(preferencesData.preferences);
  const [columnOrder, setColumnOrder] = useState(preferences?.columnOrder || columns.map(col => col.key));
  const tableRef = useRef<HTMLTableElement>(null);
  
  // State for managing column visibility
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(preferences?.hiddenColumns || []);

  // Update preferences when column order changes
  useEffect(() => {
    if (preferences && columnOrder) {
      updatePreferences({ ...preferences, columnOrder });
    }
  }, [columnOrder]);

  // Update preferences when hidden columns change
  useEffect(() => {
    if (preferences) {
      updatePreferences({ ...preferences, hiddenColumns });
    }
  }, [hiddenColumns]);

  const updatePreferences = useCallback(
    async (newPreferences: any) => {
      setPreferences(newPreferences);
      if (onPreferenceSave) {
        try {
          await onPreferenceSave(newPreferences);
        } catch (error) {
          console.error('Failed to save preferences:', error);
        }
      }
    },
    [onPreferenceSave]
  );

  const orderedColumns = useMemo(() => {
    return columnOrder
      .map(key => columns.find(col => col.key === key))
      .filter(Boolean)
      .filter(col => !hiddenColumns.includes(col.key))
      .sort((a, b) => {
        const orderA = columnOrder.indexOf(a.key);
        const orderB = columnOrder.indexOf(b.key);
        return orderA - orderB;
      });
  }, [columns, columnOrder, hiddenColumns]);

  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; column: string } | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dropTargetColumn, setDropTargetColumn] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [internalSelectedRows, setInternalSelectedRows] = useState<Set<number>>(new Set());
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Use external selectedRows if provided, otherwise use internal state
  const currentSelectedRows = selectedRows || internalSelectedRows;

  // Create a unified selection change handler that works with both external and internal state
  const handleSelectionChangeUnified = useCallback((newSelection: Set<number> | ((prev: Set<number>) => Set<number>)) => {
    if (onSelectionChange) {
      // External selection control - resolve the new selection and pass it directly
      const resolvedSelection = typeof newSelection === 'function' 
        ? newSelection(currentSelectedRows) 
        : newSelection;
      onSelectionChange(resolvedSelection);
    } else {
      // Internal selection control - pass through to React state setter
      setInternalSelectedRows(newSelection);
    }
  }, [onSelectionChange, currentSelectedRows]);

  const handleColumnOrderChange = useCallback((newOrder: string[]) => {
    setColumnOrder(newOrder);
  }, []);

  const handleColumnVisibilityChange = useCallback((columnKey: string, visible: boolean) => {
    setHiddenColumns(prev => {
      if (visible) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  }, []);

  // Process data with sorting and filtering
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply column filters
    if (Object.keys(columnFilters).length > 0) {
      result = result.filter(row => {
        return Object.entries(columnFilters).every(([columnKey, filterValue]) => {
          if (!filterValue.trim()) return true;
          
          const value = row[columnKey];
          if (value == null) return false;
          
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        });
      });
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.column];
        const bVal = b[sortConfig.column];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    
    return result;
  }, [data, sortConfig, columnFilters]);

  const handleSort = useCallback((column: string) => {
    const columnConfig = columns.find(col => col.key === column);
    if (!columnConfig?.sortable) return;
    
    setSortConfig(current => {
      if (current?.column === column) {
        return current.direction === 'asc' 
          ? { column, direction: 'desc' }
          : null;
      }
      return { column, direction: 'asc' };
    });
  }, [columns]);

  const handleInlineEdit = useCallback(async (rowIndex: number, columnKey: string, newValue: any) => {
    const updatedRow = { ...processedData[rowIndex], [columnKey]: newValue };
    
    if (onInlineEdit) {
      onInlineEdit(rowIndex, updatedRow);
    }
    
    if (onUpdate) {
      try {
        await onUpdate(updatedRow);
      } catch (error) {
        console.error('Failed to update row:', error);
      }
    }
    
    setEditingCell(null);
  }, [processedData, onInlineEdit, onUpdate]);

  const handleExport = useCallback((format: 'csv' | 'excel' | 'json') => {
    setIsExporting(true);
    try {
      const headers = orderedColumns.map(col => col.label);
      const csvData = processedData.map(row => 
        orderedColumns.map(col => row[col.key] || '')
      );
      
      if (format === 'csv') {
        const csvContent = [headers, ...csvData]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grid-data.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'json') {
        const jsonContent = JSON.stringify(processedData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grid-data.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [orderedColumns, processedData]);

  const handleResetPreferences = useCallback(() => {
    setSortConfig(null);
    setColumnFilters({});
    setCurrentPage(1);
    setShowColumnFilters(false);
  }, []);

  const handleColumnFilterChange = useCallback((columnKey: string, value: string) => {
    setColumnFilters(prev => {
      if (!value.trim()) {
        const { [columnKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [columnKey]: value };
    });
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const gridData = useMemo(() => ({
    data,
    filteredData: processedData,
    selectedRows: Array.from(currentSelectedRows),
    columns,
    preferences,
    actions: {
      exportData: handleExport,
      resetPreferences: handleResetPreferences,
      toggleRowSelection: (rowIndex: number) => {
        handleSelectionChangeUnified(prev => {
          const newSet = new Set(prev);
          if (newSet.has(rowIndex)) {
            newSet.delete(rowIndex);
          } else {
            newSet.add(rowIndex);
          }
          return newSet;
        });
      },
      selectAllRows: () => {
        handleSelectionChangeUnified(new Set(Array.from({ length: processedData.length }, (_, i) => i)));
      },
      clearSelection: () => {
        handleSelectionChangeUnified(new Set());
      }
    }
  }), [data, processedData, currentSelectedRows, columns, preferences, handleExport, handleResetPreferences, handleSelectionChangeUnified]);

  const gridAPI = useMemo(() => gridData, [gridData]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (paginationMode === 'infinite') return processedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize, paginationMode]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleDragStart = useCallback((columnKey: string) => {
    setDraggedColumn(columnKey);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDropTargetColumn(columnKey);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    if (draggedColumn && dropTargetColumn) {
      const newColumnOrder = [...columnOrder];
      const draggedIndex = newColumnOrder.indexOf(draggedColumn);
      const dropTargetIndex = newColumnOrder.indexOf(dropTargetColumn);

      newColumnOrder.splice(draggedIndex, 1);
      newColumnOrder.splice(dropTargetIndex, 0, draggedColumn);

      handleColumnOrderChange(newColumnOrder);
      setDraggedColumn(null);
      setDropTargetColumn(null);
    }
  }, [columnOrder, draggedColumn, dropTargetColumn, handleColumnOrderChange]);

  const handleColumnWidthChange = useCallback((columnKey: string, width: number) => {
    updatePreferences({
      ...preferences,
      columnWidths: {
        ...preferences.columnWidths,
        [columnKey]: width,
      },
    });
  }, [preferences, updatePreferences]);

  const handleColumnHeaderClick = useCallback((e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    handleSort(columnKey);
  }, [handleSort]);

  const totalFilterCount = Object.values(columnFilters).filter(value => value.trim()).length;

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnFilters(!showColumnFilters)}
            className={cn(
              "flex items-center space-x-1",
              (showColumnFilters || totalFilterCount > 0) && "bg-blue-50 border-blue-300"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {totalFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800">
                {totalFilterCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsColumnManagerOpen(true)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Columns
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetPreferences}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Plugin toolbar items */}
          {plugins.map(plugin => plugin.toolbar?.(gridAPI)).filter(Boolean)}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleExport('csv')}
                >
                  Export CSV
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleExport('json')}
                >
                  Export JSON
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Grid Container */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              {/* Column Headers */}
              <tr>
                {/* Selection column */}
                <th className="w-12 px-4 py-3 text-left">
                  <Checkbox 
                    className="rounded" 
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleSelectionChangeUnified(new Set(Array.from({ length: paginatedData.length }, (_, i) => i)));
                      } else {
                        handleSelectionChangeUnified(new Set());
                      }
                    }}
                    checked={currentSelectedRows.size === paginatedData.length && paginatedData.length > 0}
                  />
                </th>
                
                {orderedColumns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-left font-medium text-gray-900 select-none relative group",
                      column.sortable && "cursor-pointer hover:bg-gray-100"
                    )}
                    onClick={column.sortable ? (e) => handleColumnHeaderClick(e, column.key) : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{column.label}</span>
                      <div className="flex items-center space-x-1">
                        {column.sortable && sortConfig?.column === column.key && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>

              {/* Column Filters Row */}
              {showColumnFilters && (
                <tr className="bg-gray-25 border-b">
                  <th className="w-12 px-4 py-2"></th>
                  {orderedColumns.map((column) => (
                    <th key={`filter-${column.key}`} className="px-4 py-2">
                      {column.filterable ? (
                        <Input
                          placeholder={`Filter ${column.label}...`}
                          value={columnFilters[column.key] || ''}
                          onChange={(e) => handleColumnFilterChange(column.key, e.target.value)}
                          className="h-8 text-sm"
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((row, rowIndex) => {
                const isSelected = currentSelectedRows.has(rowIndex);
                const rowClass = typeof rowClassName === 'function' 
                  ? rowClassName(row, rowIndex) 
                  : rowClassName || '';
                
                return (
                  <React.Fragment key={rowIndex}>
                    <tr 
                      className={cn(
                        "hover:bg-gray-50 transition-colors",
                        isSelected && "bg-blue-50",
                        rowClass
                      )}
                    >
                      {/* Selection checkbox */}
                      <td className="w-12 px-4 py-3">
                        <Checkbox 
                          className="rounded" 
                          checked={currentSelectedRows.has(rowIndex)}
                          onCheckedChange={() => {
                            handleSelectionChangeUnified(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(rowIndex)) {
                                newSet.delete(rowIndex);
                              } else {
                                newSet.add(rowIndex);
                              }
                              return newSet;
                            });
                          }}
                        />
                      </td>
                      
                      {orderedColumns.map((column) => {
                        const isEditing = editingCell?.row === rowIndex && editingCell?.column === column.key;
                        const isEditable = Array.isArray(editableColumns) 
                          ? editableColumns.includes(column.key)
                          : editableColumns && column.editable;
                        
                        return (
                          <td
                            key={column.key}
                            className="px-4 py-3 text-sm text-gray-900"
                          >
                            {isEditing ? (
                              <CellEditor
                                value={row[column.key]}
                                column={column}
                                onSave={(value) => handleInlineEdit(rowIndex, column.key, value)}
                                onCancel={() => setEditingCell(null)}
                              />
                            ) : (
                              <div
                                className={cn(
                                  isEditable && "cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5"
                                )}
                                onClick={isEditable ? () => setEditingCell({ row: rowIndex, column: column.key }) : undefined}
                              >
                                <CellRenderer
                                  value={row[column.key]}
                                  row={row}
                                  column={column}
                                  rowIndex={rowIndex}
                                  columnIndex={orderedColumns.indexOf(column)}
                                  isEditing={isEditing}
                                  isEditable={isEditable}
                                  onEdit={handleInlineEdit}
                                  onEditStart={(rowIdx, colKey) => setEditingCell({ row: rowIdx, column: colKey })}
                                  onEditCancel={() => setEditingCell(null)}
                                  onLinkClick={onLinkClick}
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* Nested row content */}
                    {nestedRowRenderer && (
                      <tr>
                        <td colSpan={orderedColumns.length + 1} className="p-0">
                          {nestedRowRenderer(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginationMode === 'pagination' && (
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Showing {Math.min((currentPage - 1) * pageSize + 1, processedData.length)} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">Page</span>
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                  className="w-16 h-8 text-center"
                />
                <span className="text-sm text-gray-600">of {totalPages}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Column Manager Dialog */}
      <ColumnManager
        isOpen={isColumnManagerOpen}
        onClose={() => setIsColumnManagerOpen(false)}
        columns={legacyColumns}
        preferences={preferences}
        onPreferencesChange={updatePreferences}
      />

      {/* Plugin footer items */}
      {plugins.map(plugin => plugin.footer?.(gridAPI)).filter(Boolean)}
    </div>
  );
}
