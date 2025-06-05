
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Upload, Filter, Search } from 'lucide-react';
import { SmartGridProps, GridColumnConfig, SortConfig, FilterConfig } from '@/types/smartgrid';
import { exportToCSV, exportToExcel } from '@/utils/gridExport';
import { useToast } from '@/hooks/use-toast';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Determine if a column is editable
  const isColumnEditable = useCallback((column: GridColumnConfig, columnIndex: number) => {
    // First column is not editable by default
    if (columnIndex === 0) return false;
    
    if (Array.isArray(editableColumns)) {
      return editableColumns.includes(column.key);
    }
    
    return editableColumns && column.editable;
  }, [editableColumns]);

  // Process data with sorting and filtering
  const processedData = useMemo(() => {
    let result = [...gridData];

    // Apply global filter
    if (globalFilter) {
      result = result.filter(row =>
        columns.some(col => {
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
  }, [gridData, globalFilter, sort, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (paginationMode !== 'pagination') return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, paginationMode, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleSort = useCallback((columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    const newSort: SortConfig = {
      column: columnKey,
      direction: sort?.column === columnKey && sort.direction === 'asc' ? 'desc' : 'asc'
    };
    
    setSort(newSort);
  }, [columns, sort]);

  const handleCellEdit = useCallback((rowIndex: number, columnKey: string, value: any) => {
    const actualRowIndex = (currentPage - 1) * pageSize + rowIndex;
    const updatedData = [...gridData];
    updatedData[actualRowIndex] = { ...updatedData[actualRowIndex], [columnKey]: value };
    
    setGridData(updatedData);
    setEditingCell(null);
    
    if (onInlineEdit) {
      onInlineEdit(actualRowIndex, updatedData[actualRowIndex]);
    }
  }, [gridData, currentPage, pageSize, onInlineEdit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, rowIndex: number, columnKey: string) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      const value = target.textContent || '';
      handleCellEdit(rowIndex, columnKey, value);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  }, [handleCellEdit]);

  const parseCSV = useCallback((csvText: string): any[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1);
    
    return rows.map(row => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  }, []);

  const validateCSVHeaders = useCallback((csvHeaders: string[]): boolean => {
    const requiredKeys = columns.map(col => col.key);
    return requiredKeys.every(key => csvHeaders.includes(key));
  }, [columns]);

  const handleBulkUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
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
        setGridData(csvData);
        toast({
          title: "Success",
          description: `Successfully uploaded ${csvData.length} rows`
        });
      }
    } catch (error) {
      console.error('Failed to process CSV upload:', error);
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
  }, [parseCSV, validateCSVHeaders, onBulkUpdate, toast]);

  const handleExport = useCallback((format: 'csv' | 'excel') => {
    const filename = `export-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'csv') {
      exportToCSV(processedData, columns, filename);
    } else {
      exportToExcel(processedData, columns, filename);
    }
  }, [processedData, columns]);

  const renderCell = useCallback((row: any, column: GridColumnConfig, rowIndex: number, columnIndex: number) => {
    const value = row[column.key];
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
    const isEditable = isColumnEditable(column, columnIndex);

    if (column.type === 'select' && column.options) {
      if (isEditable) {
        return (
          <select
            value={value || ''}
            onChange={(e) => handleCellEdit(rowIndex, column.key, e.target.value)}
            className="w-full px-2 py-1 border rounded"
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
          />
        );
      } else {
        return (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleCellEdit(rowIndex, column.key, e.target.textContent)}
            onKeyDown={(e) => handleKeyDown(e, rowIndex, column.key)}
            className="min-h-[20px] p-1 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
          >
            {value}
          </div>
        );
      }
    }

    return <span>{value}</span>;
  }, [editingCell, isColumnEditable, handleCellEdit, handleKeyDown]);

  // Update grid data when prop data changes
  React.useEffect(() => {
    setGridData(data);
  }, [data]);

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
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onBulkUpdate && (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm" disabled={loading}>
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
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
                {columns.filter(col => !col.hidden).map((column) => (
                  <TableHead key={column.key} className="relative group">
                    <div className="flex items-center space-x-2">
                      <span className="select-none">{column.label}</span>
                      {column.sortable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.key)}
                          className="h-auto p-0 hover:bg-transparent"
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
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50">
                    {columns.filter(col => !col.hidden).map((column, columnIndex) => (
                      <TableCell key={column.key} className="relative">
                        {renderCell(row, column, rowIndex, columnIndex)}
                        {nestedRowRenderer && columnIndex === 0 && (
                          <div className="mt-2">{nestedRowRenderer(row)}</div>
                        )}
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
