import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Upload, Filter, Search, RotateCcw, ChevronRight, ChevronDown, Edit2, GripVertical } from 'lucide-react';
import { SmartGridProps, GridColumnConfig, SortConfig, FilterConfig, GridAPI, GridPlugin } from '@/types/smartgrid';
import { exportToCSV, exportToExcel, parseCSV } from '@/utils/gridExport';
import { useToast } from '@/hooks/use-toast';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import { CellRenderer } from './CellRenderer';
import { cn } from '@/lib/utils';
import { ColumnVisibilityManager } from './ColumnVisibilityManager';

export function SmartGrid({
  columns,
  data,
  editableColumns = true,
  mandatoryColumns = [],
  onInlineEdit,
  onBulkUpdate,
  onPreferenceSave,
  onDataFetch,
  onUpdate,
  onLinkClick,
  paginationMode = 'pagination',
  nestedRowRenderer,
  plugins = []
}: SmartGridProps) {
  const [gridData, setGridData] = useState(data);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig | undefined>();
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Convert GridColumnConfig to Column format for useGridPreferences
  const preferencesColumns = useMemo(() => columns.map(col => ({
    id: col.key,
    header: col.label,
    accessor: col.key,
    mandatory: col.mandatory
  })), [columns]);

  // Initialize preferences hook with proper async handling
  const {
    preferences,
    updateColumnOrder,
    toggleColumnVisibility,
    updateColumnHeader,
    savePreferences
  } = useGridPreferences(
    preferencesColumns,
    true, // persistPreferences
    'smartgrid-preferences',
    onPreferenceSave ? async (preferences) => {
      try {
        await Promise.resolve(onPreferenceSave(preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
        setError('Failed to save preferences');
      }
    } : undefined
  );

  // Apply preferences to get ordered and visible columns
  const orderedColumns = useMemo(() => {
    const columnMap = new Map(columns.map(col => [col.key, col]));
    
    return preferences.columnOrder
      .map(id => columnMap.get(id))
      .filter((col): col is GridColumnConfig => col !== undefined)
      .filter(col => !preferences.hiddenColumns.includes(col.key))
      .map(col => ({
        ...col,
        label: preferences.columnHeaders[col.key] || col.label,
        hidden: preferences.hiddenColumns.includes(col.key)
      }));
  }, [columns, preferences]);

  // Handle header editing
  const handleHeaderEdit = useCallback((columnKey: string, newHeader: string) => {
    if (newHeader.trim() && newHeader !== preferences.columnHeaders[columnKey]) {
      updateColumnHeader(columnKey, newHeader.trim());
      toast({
        title: "Success",
        description: "Column header updated"
      });
    }
    setEditingHeader(null);
  }, [updateColumnHeader, preferences.columnHeaders, toast]);

  const handleHeaderClick = useCallback((columnKey: string) => {
    setEditingHeader(columnKey);
  }, []);

  // Handle drag and drop for column reordering
  const handleColumnDragStart = useCallback((e: React.DragEvent, columnKey: string) => {
    e.stopPropagation();
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnKey);
  }, []);

  const handleColumnDragOver = useCallback((e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedColumn && draggedColumn !== targetColumnKey) {
      setDragOverColumn(targetColumnKey);
      e.dataTransfer.dropEffect = 'move';
    }
  }, [draggedColumn]);

  const handleColumnDragLeave = useCallback((e: React.DragEvent) => {
    e.stopPropagation();
    // Only clear drag over if we're actually leaving the header area
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  }, []);

  const handleColumnDrop = useCallback((e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const newOrder = [...preferences.columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnKey);

    // Remove dragged column and insert at target position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    updateColumnOrder(newOrder);
    setDraggedColumn(null);
    setDragOverColumn(null);
    
    toast({
      title: "Success",
      description: "Column order updated"
    });
  }, [draggedColumn, preferences.columnOrder, updateColumnOrder, toast]);

  const handleColumnDragEnd = useCallback(() => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, []);

  // Toggle row expansion
  const toggleRowExpansion = useCallback((rowIndex: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  }, []);

  // Lazy loading effect
  useEffect(() => {
    if (onDataFetch) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const newData = await onDataFetch(currentPage, pageSize);
          setGridData(newData);
        } catch (err) {
          setError('Failed to fetch data');
          console.error('Data fetch error:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [onDataFetch, currentPage, pageSize]);

  // Determine if a column is editable
  const isColumnEditable = useCallback((column: GridColumnConfig, columnIndex: number) => {
    // First column is not editable by default
    if (columnIndex === 0) return false;
    
    if (Array.isArray(editableColumns)) {
      return editableColumns.includes(column.key);
    }
    
    return editableColumns && column.editable;
  }, [editableColumns]);

  // Process data with sorting and filtering (only if not using lazy loading)
  const processedData = useMemo(() => {
    if (onDataFetch) {
      // For lazy loading, return data as-is (sorting/filtering handled server-side)
      return gridData;
    }

    let result = [...gridData];

    // Apply global filter
    if (globalFilter) {
      result = result.filter(row =>
        orderedColumns.some(col => {
          const value = row[col.key];
          return String(value || '').toLowerCase().includes(globalFilter.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sort) {
      result.sort((a, b) => {
        const aValue = a[sort.column];
        const bValue = b[sort.column];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return sort.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [gridData, globalFilter, sort, orderedColumns, onDataFetch]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (paginationMode !== 'pagination' || onDataFetch) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, paginationMode, currentPage, pageSize, onDataFetch]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleSort = useCallback(async (columnKey: string) => {
    const column = orderedColumns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    const newSort: SortConfig = {
      column: columnKey,
      direction: sort?.column === columnKey && sort.direction === 'asc' ? 'desc' : 'asc'
    };
    
    setSort(newSort);

    // If using lazy loading, fetch new data with sort
    if (onDataFetch) {
      setLoading(true);
      setError(null);
      try {
        const newData = await onDataFetch(currentPage, pageSize);
        setGridData(newData);
      } catch (err) {
        setError('Failed to sort data');
        console.error('Sort error:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [orderedColumns, sort, onDataFetch, currentPage, pageSize]);

  const handleCellEdit = useCallback(async (rowIndex: number, columnKey: string, value: any) => {
    const actualRowIndex = onDataFetch ? rowIndex : (currentPage - 1) * pageSize + rowIndex;
    const updatedData = [...gridData];
    const originalRow = updatedData[actualRowIndex];
    const updatedRow = { ...originalRow, [columnKey]: value };
    
    updatedData[actualRowIndex] = updatedRow;
    setGridData(updatedData);
    setEditingCell(null);
    
    // Handle single row update
    if (onUpdate) {
      setLoading(true);
      setError(null);
      try {
        await onUpdate(updatedRow);
        toast({
          title: "Success",
          description: "Row updated successfully"
        });
      } catch (err) {
        // Revert the change on error
        updatedData[actualRowIndex] = originalRow;
        setGridData(updatedData);
        setError('Failed to update row');
        toast({
          title: "Error",
          description: "Failed to update row",
          variant: "destructive"
        });
        console.error('Update error:', err);
      } finally {
        setLoading(false);
      }
    } else if (onInlineEdit) {
      onInlineEdit(actualRowIndex, updatedRow);
    }
  }, [gridData, currentPage, pageSize, onInlineEdit, onUpdate, onDataFetch, toast]);

  const handleEditStart = useCallback((rowIndex: number, columnKey: string) => {
    setEditingCell({ rowIndex, columnKey });
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  // Validate CSV headers
  const validateCSVHeaders = useCallback((csvHeaders: string[]): boolean => {
    const requiredKeys = columns.map(col => col.key);
    return requiredKeys.every(key => csvHeaders.includes(key));
  }, [columns]);

  // Handle bulk upload
  const handleBulkUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const text = await file.text();
      const csvData = parseCSV(text);
      
      if (csvData.length === 0) {
        toast({
          title: "Error",
          description: "No valid data found in CSV file",
          variant: "destructive"
        });
        return;
      }

      const headers = Object.keys(csvData[0]);
      if (!validateCSVHeaders(headers)) {
        toast({
          title: "Error", 
          description: "CSV headers don't match column configuration",
          variant: "destructive"
        });
        return;
      }

      if (onBulkUpdate) {
        await onBulkUpdate(csvData);
        if (!onDataFetch) {
          setGridData(csvData);
        }
        toast({
          title: "Success",
          description: `Successfully uploaded ${csvData.length} rows`
        });
      }
    } catch (error) {
      console.error('Failed to process CSV upload:', error);
      setError('Failed to process CSV file');
      toast({
        title: "Error",
        description: "Failed to process CSV file",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [validateCSVHeaders, onBulkUpdate, onDataFetch, toast]);

  // Handle export
  const handleExport = useCallback((format: 'csv' | 'excel') => {
    const filename = `export-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      exportToCSV(processedData, orderedColumns, filename);
    } else {
      exportToExcel(processedData, orderedColumns, filename);
    }
  }, [processedData, orderedColumns]);

  // Handle reset preferences with column visibility reset
  const handleResetPreferences = useCallback(async () => {
    const defaultPreferences = {
      columnOrder: columns.map(col => col.key),
      hiddenColumns: [],
      columnWidths: {},
      columnHeaders: {},
      filters: []
    };
    
    try {
      await savePreferences(defaultPreferences);
      setSort(undefined);
      setFilters([]);
      setGlobalFilter('');
      
      toast({
        title: "Success",
        description: "Column preferences have been reset to defaults"
      });
    } catch (error) {
      setError('Failed to reset preferences');
      toast({
        title: "Error",
        description: "Failed to reset preferences",
        variant: "destructive"
      });
    }
  }, [columns, savePreferences, toast]);

  // Create Grid API for plugins
  const gridAPI: GridAPI = useMemo(() => ({
    data: gridData,
    filteredData: processedData,
    selectedRows: Array.from(selectedRows).map(index => processedData[index]).filter(Boolean),
    columns: orderedColumns,
    preferences,
    actions: {
      exportData: handleExport,
      resetPreferences: handleResetPreferences,
      toggleRowSelection: (rowIndex: number) => {
        setSelectedRows(prev => {
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
        setSelectedRows(new Set(Array.from({ length: processedData.length }, (_, i) => i)));
      },
      clearSelection: () => {
        setSelectedRows(new Set());
      }
    }
  }), [gridData, processedData, selectedRows, orderedColumns, preferences, handleExport, handleResetPreferences]);

  // Initialize plugins
  useEffect(() => {
    plugins.forEach(plugin => {
      if (plugin.init) {
        plugin.init(gridAPI);
      }
    });

    return () => {
      plugins.forEach(plugin => {
        if (plugin.destroy) {
          plugin.destroy();
        }
      });
    };
  }, [plugins, gridAPI]);

  const renderCell = useCallback((row: any, column: GridColumnConfig, rowIndex: number, columnIndex: number) => {
    const value = row[column.key];
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
    const isEditable = isColumnEditable(column, columnIndex);

    // Add expand/collapse toggle for first column if nestedRowRenderer exists
    if (columnIndex === 0 && nestedRowRenderer) {
      const isExpanded = expandedRows.has(rowIndex);
      return (
        <div className="flex items-center space-x-2 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleRowExpansion(rowIndex)}
            className="h-6 w-6 p-0 hover:bg-gray-100 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1 min-w-0 truncate">
            <CellRenderer
              value={value}
              row={row}
              column={column}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              isEditing={isEditing}
              isEditable={isEditable}
              onEdit={handleCellEdit}
              onEditStart={handleEditStart}
              onEditCancel={handleEditCancel}
              onLinkClick={onLinkClick}
              loading={loading}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-w-0 truncate">
        <CellRenderer
          value={value}
          row={row}
          column={column}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          isEditing={isEditing}
          isEditable={isEditable}
          onEdit={handleCellEdit}
          onEditStart={handleEditStart}
          onEditCancel={handleEditCancel}
          onLinkClick={onLinkClick}
          loading={loading}
        />
      </div>
    );
  }, [editingCell, isColumnEditable, nestedRowRenderer, expandedRows, toggleRowExpansion, handleCellEdit, handleEditStart, handleEditCancel, onLinkClick, loading]);

  // Update grid data when prop data changes (only if not using lazy loading)
  useEffect(() => {
    if (!onDataFetch) {
      setGridData(data);
    }
  }, [data, onDataFetch]);

  // Render plugin toolbar items
  const renderPluginToolbarItems = useCallback(() => {
    return plugins
      .filter(plugin => plugin.toolbar)
      .map(plugin => (
        <React.Fragment key={plugin.id}>
          {plugin.toolbar!(gridAPI)}
        </React.Fragment>
      ));
  }, [plugins, gridAPI]);

  // Render plugin row actions
  const renderPluginRowActions = useCallback((row: any, rowIndex: number) => {
    return plugins
      .filter(plugin => plugin.rowActions)
      .map(plugin => (
        <React.Fragment key={plugin.id}>
          {plugin.rowActions!(row, rowIndex, gridAPI)}
        </React.Fragment>
      ));
  }, [plugins, gridAPI]);

  // Render plugin footer items
  const renderPluginFooterItems = useCallback(() => {
    return plugins
      .filter(plugin => plugin.footer)
      .map(plugin => (
        <React.Fragment key={plugin.id}>
          {plugin.footer!(gridAPI)}
        </React.Fragment>
      ));
  }, [plugins, gridAPI]);

  // Error boundary component
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => setError(null)}
          className="text-red-700 border-red-300 hover:bg-red-100"
        >
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 w-full"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Column Visibility Manager */}
          <ColumnVisibilityManager
            columns={columns}
            preferences={preferences}
            onColumnVisibilityToggle={toggleColumnVisibility}
            onResetToDefaults={handleResetPreferences}
          />

          <Button variant="outline" size="sm" onClick={handleResetPreferences} disabled={loading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Reset All</span>
          </Button>
          
          {onBulkUpdate && (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <Button variant="outline" size="sm" disabled={loading}>
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Upload CSV</span>
              </Button>
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>

          {/* Plugin toolbar items */}
          {renderPluginToolbarItems()}
        </div>
      </div>

      {/* Table Container with responsive scrolling */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-white shadow-sm border-b-2 border-gray-100">
              <TableRow className="hover:bg-transparent">
                {orderedColumns.map((column) => (
                  <TableHead 
                    key={column.key} 
                    className={cn(
                      "relative group bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-900 px-6 py-4 border-r border-gray-100 last:border-r-0 cursor-move",
                      draggedColumn === column.key && "opacity-50",
                      dragOverColumn === column.key && "bg-blue-100 border-blue-300"
                    )}
                    draggable
                    onDragStart={(e) => handleColumnDragStart(e, column.key)}
                    onDragOver={(e) => handleColumnDragOver(e, column.key)}
                    onDragLeave={handleColumnDragLeave}
                    onDrop={(e) => handleColumnDrop(e, column.key)}
                    onDragEnd={handleColumnDragEnd}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {editingHeader === column.key ? (
                        <Input
                          defaultValue={column.label}
                          onBlur={(e) => handleHeaderEdit(column.key, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleHeaderEdit(column.key, e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingHeader(null);
                            }
                          }}
                          className="h-6 px-2 text-sm font-semibold bg-white border-blue-300 focus:border-blue-500"
                          autoFocus
                          onFocus={(e) => e.target.select()}
                          onClick={(e) => e.stopPropagation()}
                          onDragStart={(e) => e.preventDefault()}
                        />
                      ) : (
                        <div 
                          className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100/50 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors group/header flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHeaderClick(column.key);
                          }}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          <span className="select-none truncate">{column.label}</span>
                          <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover/header:opacity-100 transition-opacity" />
                        </div>
                      )}
                      {column.sortable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSort(column.key);
                          }}
                          className="h-auto p-0 hover:bg-transparent opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                          disabled={loading}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          {sort?.column === column.key ? (
                            sort.direction === 'asc' ? (
                              <ArrowUp className="h-4 w-4 text-blue-600" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-blue-600" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
                {/* Plugin row actions header */}
                {plugins.some(plugin => plugin.rowActions) && (
                  <TableHead className="bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-900 px-6 py-4 text-center">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell 
                    colSpan={orderedColumns.length + (plugins.some(plugin => plugin.rowActions) ? 1 : 0)} 
                    className="text-center py-12"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={orderedColumns.length + (plugins.some(plugin => plugin.rowActions) ? 1 : 0)} 
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="space-y-2">
                      <div className="text-lg font-medium">No data available</div>
                      <div className="text-sm">Try adjusting your search or filters</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <TableRow className="hover:bg-gray-50/50 transition-colors duration-150 border-b border-gray-100">
                      {orderedColumns.map((column, columnIndex) => (
                        <TableCell 
                          key={column.key} 
                          className="relative px-6 py-4 border-r border-gray-50 last:border-r-0 align-top"
                        >
                          {renderCell(row, column, rowIndex, columnIndex)}
                        </TableCell>
                      ))}
                      {/* Plugin row actions */}
                      {plugins.some(plugin => plugin.rowActions) && (
                        <TableCell className="px-6 py-4 text-center align-top">
                          <div className="flex items-center justify-center space-x-2">
                            {renderPluginRowActions(row, rowIndex)}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                    {/* Nested row content */}
                    {nestedRowRenderer && expandedRows.has(rowIndex) && (
                      <TableRow className="bg-gray-50/30">
                        <TableCell 
                          colSpan={orderedColumns.length + (plugins.some(plugin => plugin.rowActions) ? 1 : 0)} 
                          className="p-0 border-b border-gray-200"
                        >
                          <div className="bg-gradient-to-r from-gray-50/50 to-white border-l-4 border-blue-500">
                            <div className="p-6 pl-12">
                              {nestedRowRenderer(row)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {paginationMode === 'pagination' && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of{' '}
            {processedData.length} entries
          </div>
          
          <Pagination className="order-1 sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={cn(
                    currentPage === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'
                  )}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className={cn(
                        "cursor-pointer transition-colors duration-150",
                        loading && "pointer-events-none opacity-50",
                        currentPage === pageNum && "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={cn(
                    currentPage === totalPages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Plugin footer items */}
      {plugins.some(plugin => plugin.footer) && (
        <div className="flex items-center justify-center space-x-4 pt-4 border-t bg-white p-4 rounded-lg border shadow-sm">
          {renderPluginFooterItems()}
        </div>
      )}
    </div>
  );
}
