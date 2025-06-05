import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Upload, Filter, Search, RotateCcw, ChevronRight, ChevronDown } from 'lucide-react';
import { SmartGridProps, GridColumnConfig, SortConfig, FilterConfig } from '@/types/smartgrid';
import { exportToCSV, exportToExcel, parseCSV } from '@/utils/gridExport';
import { useToast } from '@/hooks/use-toast';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import { cn } from '@/lib/utils';

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
  paginationMode = 'pagination',
  nestedRowRenderer
}: SmartGridProps) {
  const [gridData, setGridData] = useState(data);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);
  const [sort, setSort] = useState<SortConfig | undefined>();
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent, rowIndex: number, columnKey: string) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      const value = target.textContent || '';
      handleCellEdit(rowIndex, columnKey, value);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  }, [handleCellEdit]);

  const validateCSVHeaders = useCallback((csvHeaders: string[]): boolean => {
    const requiredKeys = columns.map(col => col.key);
    return requiredKeys.every(key => csvHeaders.includes(key));
  }, [columns]);

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

  const handleExport = useCallback((format: 'csv' | 'excel') => {
    const filename = `export-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      exportToCSV(processedData, orderedColumns, filename);
    } else {
      exportToExcel(processedData, orderedColumns, filename);
    }
  }, [processedData, orderedColumns]);

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
        description: "Preferences have been reset to defaults"
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

  const renderCell = useCallback((row: any, column: GridColumnConfig, rowIndex: number, columnIndex: number) => {
    const value = row[column.key];
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
    const isEditable = isColumnEditable(column, columnIndex);

    // Add expand/collapse toggle for first column if nestedRowRenderer exists
    if (columnIndex === 0 && nestedRowRenderer) {
      const isExpanded = expandedRows.has(rowIndex);
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleRowExpansion(rowIndex)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1">
            {renderCellContent(value, column, rowIndex, columnIndex, isEditing, isEditable)}
          </div>
        </div>
      );
    }

    return renderCellContent(value, column, rowIndex, columnIndex, isEditing, isEditable);
  }, [editingCell, isColumnEditable, nestedRowRenderer, expandedRows, toggleRowExpansion, handleCellEdit, handleKeyDown, loading]);

  const renderCellContent = useCallback((value: any, column: GridColumnConfig, rowIndex: number, columnIndex: number, isEditing: boolean, isEditable: boolean) => {
    if (column.type === 'select' && column.options) {
      if (isEditable) {
        return (
          <select
            value={value || ''}
            onChange={(e) => handleCellEdit(rowIndex, column.key, e.target.value)}
            className="w-full px-2 py-1 border rounded"
            disabled={loading}
          >
            <option value="">Select...</option>
            {column.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }
      return <span>{value}</span>;
    }

    if (isEditable) {
      if (column.type === 'number' || column.type === 'date') {
        return (
          <Input
            type={column.type}
            value={value || ''}
            onChange={(e) => handleCellEdit(rowIndex, column.key, e.target.value)}
            className="w-full"
            disabled={loading}
          />
        );
      } else {
        return (
          <div
            contentEditable={!loading}
            suppressContentEditableWarning
            onBlur={(e) => handleCellEdit(rowIndex, column.key, e.target.textContent)}
            onKeyDown={(e) => handleKeyDown(e, rowIndex, column.key)}
            className={cn(
              "min-h-[20px] p-1 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {value}
          </div>
        );
      }
    }

    return <span>{value}</span>;
  }, [handleCellEdit, handleKeyDown, loading]);

  // Update grid data when prop data changes (only if not using lazy loading)
  useEffect(() => {
    if (!onDataFetch) {
      setGridData(data);
    }
  }, [data, onDataFetch]);

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
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 w-64"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleResetPreferences} disabled={loading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Preferences
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
                Upload CSV
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
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {orderedColumns.map((column) => (
                  <TableHead key={column.key} className="relative group">
                    <div className="flex items-center space-x-2">
                      <span className="select-none">{column.label}</span>
                      {column.sortable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.key)}
                          className="h-auto p-0 hover:bg-transparent"
                          disabled={loading}
                        >
                          {sort?.column === column.key ? (
                            sort.direction === 'asc' ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={orderedColumns.length} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={orderedColumns.length} className="text-center py-8 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <TableRow className="hover:bg-gray-50">
                      {orderedColumns.map((column, columnIndex) => (
                        <TableCell key={column.key} className="relative">
                          {renderCell(row, column, rowIndex, columnIndex)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* Nested row content */}
                    {nestedRowRenderer && expandedRows.has(rowIndex) && (
                      <TableRow>
                        <TableCell colSpan={orderedColumns.length} className="p-0">
                          <div className="bg-gray-50 border-t border-gray-200">
                            <div className="p-4">
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of{' '}
            {processedData.length} entries
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={cn(
                    currentPage === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
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
                      className={cn("cursor-pointer", loading && "pointer-events-none opacity-50")}
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
                    currentPage === totalPages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
