import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter, Settings, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { CellRenderer } from './CellRenderer';
import { GridHeader } from './GridHeader';
import { ColumnVisibilityManager } from './ColumnVisibilityManager';
import { ColumnFilter } from './ColumnFilter';
import { CommonFilter } from './CommonFilter';
import { GridColumnConfig, GridPreferences, SmartGridProps } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

export const SmartGrid: React.FC<SmartGridProps> = ({
  columns,
  data,
  editableColumns = [],
  onUpdate,
  onLinkClick,
  onSubRowToggle,
  onColumnHeaderChange,
  paginationMode = 'pagination',
  selectedRows = new Set(),
  onSelectionChange,
  rowClassName
}) => {
  const [preferences, setPreferences] = useState<GridPreferences>({
    columnOrder: columns.map(col => col.key),
    hiddenColumns: columns.filter(col => col.hidden).map(col => col.key),
    columnWidths: {},
    columnHeaders: {},
    filters: []
  });

  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingCell, setEditingCell] = useState<{ row: number; column: string } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const visibleColumns = useMemo(() => {
    return columns.filter(col => !preferences.hiddenColumns.includes(col.key));
  }, [columns, preferences.hiddenColumns]);

  const collapsibleColumns = useMemo(() => {
    return columns.filter(col => col.collapsibleChild && !preferences.hiddenColumns.includes(col.key));
  }, [columns, preferences.hiddenColumns]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply global filter
    if (globalFilter) {
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }

    // Apply column filters
    preferences.filters.forEach(filter => {
      result = result.filter(row => {
        const value = row[filter.column];
        const filterValue = filter.value;
        
        if (!filterValue) return true;
        
        switch (filter.operator) {
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'equals':
            return value === filterValue;
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          default:
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        }
      });
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.column];
        const bValue = b[sortConfig.column];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, globalFilter, preferences.filters, sortConfig]);

  const paginatedData = useMemo(() => {
    if (paginationMode === 'pagination') {
      const startIndex = (currentPage - 1) * pageSize;
      return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
    }
    return filteredAndSortedData;
  }, [filteredAndSortedData, currentPage, pageSize, paginationMode]);

  const handleSort = useCallback((columnKey: string) => {
    setSortConfig(prev => {
      if (prev?.column === columnKey) {
        return prev.direction === 'asc' ? { column: columnKey, direction: 'desc' } : null;
      }
      return { column: columnKey, direction: 'asc' };
    });
  }, []);

  const handleColumnVisibilityToggle = useCallback((columnId: string) => {
    setPreferences(prev => ({
      ...prev,
      hiddenColumns: prev.hiddenColumns.includes(columnId)
        ? prev.hiddenColumns.filter(id => id !== columnId)
        : [...prev.hiddenColumns, columnId]
    }));
  }, []);

  const handleResetPreferences = useCallback(() => {
    setPreferences({
      columnOrder: columns.map(col => col.key),
      hiddenColumns: columns.filter(col => col.hidden).map(col => col.key),
      columnWidths: {},
      columnHeaders: {},
      filters: []
    });
    setSortConfig(null);
    setGlobalFilter('');
  }, [columns]);

  const handleEdit = useCallback(async (rowIndex: number, columnKey: string, value: any) => {
    if (!onUpdate) return;

    const actualRowIndex = (currentPage - 1) * pageSize + rowIndex;
    const row = { ...filteredAndSortedData[actualRowIndex], [columnKey]: value };
    
    try {
      setLoading(true);
      await onUpdate(row);
      setEditingCell(null);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  }, [onUpdate, currentPage, pageSize, filteredAndSortedData]);

  const handleEditStart = useCallback((rowIndex: number, columnKey: string) => {
    setEditingCell({ row: rowIndex, column: columnKey });
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  const handleRowToggle = useCallback((rowIndex: number) => {
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

  const handleRowSelection = useCallback((rowIndex: number) => {
    if (!onSelectionChange) return;
    
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowIndex)) {
      newSelection.delete(rowIndex);
    } else {
      newSelection.add(rowIndex);
    }
    onSelectionChange(newSelection);
  }, [selectedRows, onSelectionChange]);

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    
    if (selectedRows.size === paginatedData.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(Array.from({ length: paginatedData.length }, (_, i) => i)));
    }
  }, [selectedRows, paginatedData.length, onSelectionChange]);

  const isEditable = useCallback((columnKey: string) => {
    if (Array.isArray(editableColumns)) {
      return editableColumns.includes(columnKey);
    }
    return editableColumns === true;
  }, [editableColumns]);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <CommonFilter
            columns={visibleColumns}
            filters={preferences.filters}
            onFiltersChange={(filters) => setPreferences(prev => ({ ...prev, filters }))}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <ColumnVisibilityManager
            columns={columns}
            preferences={preferences}
            onColumnVisibilityToggle={handleColumnVisibilityToggle}
            onSubRowToggle={onSubRowToggle}
            onColumnHeaderChange={onColumnHeaderChange}
            onResetToDefaults={handleResetPreferences}
          />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectionChange && (
                <th className="px-6 py-3 w-12">
                  <Checkbox
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              {collapsibleColumns.length > 0 && (
                <th className="px-6 py-3 w-12"></th>
              )}
              {visibleColumns.map((column) => (
                <GridHeader
                  key={column.key}
                  column={column}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onColumnHeaderChange={onColumnHeaderChange}
                />
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => {
              const isExpanded = expandedRows.has(rowIndex);
              const isSelected = selectedRows.has(rowIndex);
              
              return (
                <React.Fragment key={rowIndex}>
                  <tr 
                    className={cn(
                      "hover:bg-gray-50 transition-colors",
                      isSelected && "bg-blue-50",
                      rowClassName?.(row, rowIndex)
                    )}
                  >
                    {onSelectionChange && (
                      <td className="px-6 py-4 w-12">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleRowSelection(rowIndex)}
                        />
                      </td>
                    )}
                    {collapsibleColumns.length > 0 && (
                      <td className="px-6 py-4 w-12">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRowToggle(rowIndex)}
                          className="h-6 w-6 p-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    )}
                    {visibleColumns.map((column, columnIndex) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        <CellRenderer
                          value={row[column.key]}
                          row={row}
                          column={column}
                          rowIndex={rowIndex}
                          columnIndex={columnIndex}
                          isEditing={editingCell?.row === rowIndex && editingCell?.column === column.key}
                          isEditable={isEditable(column.key)}
                          onEdit={handleEdit}
                          onEditStart={handleEditStart}
                          onEditCancel={handleEditCancel}
                          onLinkClick={onLinkClick}
                          loading={loading}
                        />
                      </td>
                    ))}
                  </tr>
                  {isExpanded && collapsibleColumns.length > 0 && (
                    <tr className="bg-gray-50">
                      <td colSpan={visibleColumns.length + (onSelectionChange ? 1 : 0) + 1} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {collapsibleColumns.map((column) => (
                            <div key={column.key} className="flex flex-col space-y-1">
                              <label className="text-xs font-medium text-gray-500 uppercase">
                                {column.label}
                              </label>
                              <div className="text-sm text-gray-900">
                                <CellRenderer
                                  value={row[column.key]}
                                  row={row}
                                  column={column}
                                  rowIndex={rowIndex}
                                  columnIndex={0}
                                  isEditing={false}
                                  isEditable={false}
                                  onEdit={handleEdit}
                                  onEditStart={handleEditStart}
                                  onEditCancel={handleEditCancel}
                                  onLinkClick={onLinkClick}
                                  loading={loading}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
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
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {Math.ceil(filteredAndSortedData.length / pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredAndSortedData.length / pageSize), prev + 1))}
              disabled={currentPage >= Math.ceil(filteredAndSortedData.length / pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
