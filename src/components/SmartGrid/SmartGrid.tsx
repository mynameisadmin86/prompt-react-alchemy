import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Upload, Filter, Search } from 'lucide-react';
import { SmartGridProps, SortConfig, FilterConfig } from '@/types/smartgrid';
import { useSmartGridData } from '@/hooks/useSmartGridData';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import { exportToCSV, exportToExcel, parseCSV } from '@/utils/gridExport';
import { CellEditor } from './CellEditor';
import { ColumnManager } from './ColumnManager';
import { cn } from '@/lib/utils';

export function SmartGrid<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  editable = false,
  sortable = true,
  filterable = true,
  reorderable = true,
  resizable = true,
  exportable = true,
  bulkUpload = false,
  pagination = true,
  infiniteScroll = false,
  pageSize = 10,
  totalCount,
  persistPreferences = true,
  preferencesKey = 'smartgrid-preferences',
  onDataFetch,
  onUpdate,
  onBulkUpdate,
  onPreferenceSave,
  onPreferenceLoad,
  onRowClick,
  onSelectionChange,
  className,
  rowClassName,
  loading = false,
  emptyMessage = 'No data available'
}: SmartGridProps<T>) {
  const [editingCell, setEditingCell] = useState<{ rowId: any; columnId: string } | null>(null);
  const [sort, setSort] = useState<SortConfig | undefined>();
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const {
    data: gridData,
    setData: setGridData,
    loading: dataLoading,
    totalCount: dataTotalCount,
    currentPage,
    setCurrentPage,
    fetchData,
    sortData,
    filterData
  } = useSmartGridData(data, columns, onDataFetch);

  const {
    preferences,
    updateColumnOrder,
    toggleColumnVisibility,
    updateColumnWidth,
    updateColumnHeader,
    savePreferences
  } = useGridPreferences(
    columns,
    persistPreferences,
    preferencesKey,
    onPreferenceSave,
    onPreferenceLoad
  );

  // Get visible columns in the right order
  const visibleColumns = useMemo(() => {
    return preferences.columnOrder
      .map(id => columns.find(col => col.id === id))
      .filter(col => col && !preferences.hiddenColumns.includes(col.id)) as typeof columns;
  }, [columns, preferences.columnOrder, preferences.hiddenColumns]);

  // Process data with sorting and filtering
  const processedData = useMemo(() => {
    let result = [...gridData];

    // Apply global filter
    if (globalFilter) {
      result = result.filter(row =>
        visibleColumns.some(col => {
          let value;
          if (typeof col.accessor === 'function') {
            value = col.accessor(row);
          } else {
            value = row[col.accessor];
          }
          return String(value).toLowerCase().includes(globalFilter.toLowerCase());
        })
      );
    }

    // Apply column filters
    result = filterData(result, filters);

    // Apply sorting
    result = sortData(result, sort);

    return result;
  }, [gridData, globalFilter, filters, sort, visibleColumns, filterData, sortData]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = (currentPage - 1) * currentPageSize;
    return processedData.slice(start, start + currentPageSize);
  }, [processedData, pagination, currentPage, currentPageSize]);

  const totalPages = Math.ceil(processedData.length / currentPageSize);

  const handleSort = useCallback((columnId: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    const newSort: SortConfig = {
      column: columnId,
      direction: sort?.column === columnId && sort.direction === 'asc' ? 'desc' : 'asc'
    };
    
    setSort(newSort);
    
    if (onDataFetch) {
      fetchData({
        page: currentPage,
        limit: currentPageSize,
        sort: newSort,
        filters
      });
    }
  }, [sortable, columns, sort, onDataFetch, fetchData, currentPage, currentPageSize, filters]);

  const handleCellEdit = useCallback(async (rowId: any, columnId: string, value: any) => {
    if (!editable || !onUpdate) return;

    try {
      const success = await onUpdate(rowId, columnId, value);
      if (success) {
        setGridData(prev => prev.map(row => 
          row[keyField] === rowId ? { ...row, [columnId]: value } : row
        ));
      }
    } catch (error) {
      console.error('Failed to update cell:', error);
    }
    
    setEditingCell(null);
  }, [editable, onUpdate, setGridData, keyField]);

  const handleExport = useCallback((format: 'csv' | 'excel') => {
    if (!exportable) return;
    
    const filename = `export-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      exportToCSV(processedData, visibleColumns, filename);
    } else {
      exportToExcel(processedData, visibleColumns, filename);
    }
  }, [exportable, processedData, visibleColumns]);

  const handleBulkUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!bulkUpload || !onBulkUpdate) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      
      const updates = csvData.map(row => ({
        id: row[String(keyField)],
        data: row as Partial<T>
      })).filter(update => update.id);

      const success = await onBulkUpdate(updates);
      if (success) {
        // Refresh data
        if (onDataFetch) {
          fetchData({
            page: currentPage,
            limit: currentPageSize,
            sort,
            filters
          });
        }
      }
    } catch (error) {
      console.error('Failed to process bulk upload:', error);
    }
    
    // Reset file input
    event.target.value = '';
  }, [bulkUpload, onBulkUpdate, keyField, onDataFetch, fetchData, currentPage, currentPageSize, sort, filters]);

  const getCellValue = useCallback((row: T, column: typeof columns[0]) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  }, []);

  const renderCell = useCallback((row: T, column: typeof columns[0]) => {
    const value = getCellValue(row, column);
    const rowId = row[keyField];
    const isEditing = editingCell?.rowId === rowId && editingCell?.columnId === column.id;

    if (isEditing) {
      return (
        <CellEditor
          value={value}
          column={column}
          onSave={(newValue) => handleCellEdit(rowId, column.id, newValue)}
          onCancel={() => setEditingCell(null)}
        />
      );
    }

    const content = column.render ? column.render(value, row) : String(value ?? '');
    
    if (editable && column.editable) {
      return (
        <div
          className="cursor-pointer hover:bg-gray-50 p-1 rounded"
          onClick={() => setEditingCell({ rowId, columnId: column.id })}
        >
          {content}
        </div>
      );
    }

    return content;
  }, [getCellValue, keyField, editingCell, editable, handleCellEdit]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          {filterable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {bulkUpload && onBulkUpdate && (
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
            </div>
          )}
          
          {exportable && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </>
          )}

          <div className="relative">
            <ColumnManager
              columns={columns}
              preferences={preferences}
              onColumnOrderChange={updateColumnOrder}
              onColumnVisibilityToggle={toggleColumnVisibility}
              onColumnHeaderChange={updateColumnHeader}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => {
                  const customHeader = preferences.columnHeaders[column.id];
                  const displayHeader = customHeader || column.header;
                  const customWidth = preferences.columnWidths[column.id];
                  
                  return (
                    <TableHead
                      key={column.id}
                      className="relative group"
                      style={{ width: customWidth || column.width }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="select-none">{displayHeader}</span>
                        {sortable && column.sortable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort(column.id)}
                            className="h-auto p-0 hover:bg-transparent"
                          >
                            {sort?.column === column.id ? (
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
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || dataLoading ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-gray-500">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow
                    key={row[keyField]}
                    className={cn(
                      'cursor-pointer hover:bg-gray-50',
                      typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName,
                      selectedRows.has(row[keyField]) && 'bg-blue-50'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className="relative">
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * currentPageSize + 1} to{' '}
            {Math.min(currentPage * currentPageSize, processedData.length)} of{' '}
            {processedData.length} entries
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
