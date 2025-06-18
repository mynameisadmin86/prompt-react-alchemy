
import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CellRenderer } from './CellRenderer';
import { CellEditor } from './CellEditor';
import { ColumnManager } from './ColumnManager';
import { CommonFilter } from './CommonFilter';
import { GridColumnConfig, SmartGridProps, FilterConfig } from '@/types/smartgrid';
import { useGridPreferences } from '@/hooks/useGridPreferences';

export function SmartGrid({
  columns,
  data,
  editableColumns = [],
  mandatoryColumns = [],
  onInlineEdit,
  onBulkUpdate,
  onPreferenceSave,
  onDataFetch,
  onUpdate,
  onLinkClick,
  onSubRowToggle,
  paginationMode = 'pagination',
  nestedRowRenderer,
  plugins = [],
  selectedRows = new Set(),
  onSelectionChange,
  rowClassName
}: SmartGridProps) {
  const [editingCell, setEditingCell] = useState<{row: number, column: string} | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  const legacyColumnConversion = useMemo(() => {
    return columns.map(col => ({
      id: col.key,
      header: col.label,
      accessor: col.key as any,
      sortable: col.sortable,
      filterable: col.filterable,
      editable: col.editable,
      mandatory: col.mandatory,
      type: 'text' as const,
      render: undefined
    }));
  }, [columns]);

  const {
    preferences,
    updateColumnOrder,
    toggleColumnVisibility,
    updateColumnWidth,
    updateColumnHeader,
    toggleSubRow,
    savePreferences
  } = useGridPreferences(
    legacyColumnConversion,
    true,
    'smart-grid-preferences',
    onPreferenceSave
  );

  // Calculate column widths based on content and available space
  const calculateColumnWidths = useCallback((visibleColumns: GridColumnConfig[]) => {
    const containerWidth = 1200; // Default container width
    const checkboxWidth = 40;
    const actionsWidth = 100;
    const baseWidth = 150;
    
    const availableWidth = containerWidth - 
      (onSelectionChange ? checkboxWidth : 0) - 
      (plugins.some(p => p.rowActions) ? actionsWidth : 0);
    
    const calculatedWidths: Record<string, number> = {};
    const numColumns = visibleColumns.length;
    const widthPerColumn = Math.max(baseWidth, availableWidth / numColumns);
    
    visibleColumns.forEach(col => {
      calculatedWidths[col.key] = preferences.columnWidths[col.key] || widthPerColumn;
    });
    
    return calculatedWidths;
  }, [preferences.columnWidths, onSelectionChange, plugins]);

  // Apply preferences to get ordered and visible columns with responsive widths - FILTER OUT SUB-ROW COLUMNS
  const orderedColumns = useMemo(() => {
    const columnMap = new Map(columns.map(col => [col.key, col]));
    
    const visibleColumns = preferences.columnOrder
      .map(id => columnMap.get(id))
      .filter((col): col is GridColumnConfig => col !== undefined)
      .filter(col => !preferences.hiddenColumns.includes(col.key))
      .filter(col => !col.subRow); // Filter out sub-row columns from main table
    
    const calculatedWidths = calculateColumnWidths(visibleColumns);
    
    return visibleColumns.map(col => ({
      ...col,
      width: calculatedWidths[col.key]
    }));
  }, [columns, preferences.columnOrder, preferences.hiddenColumns, calculateColumnWidths]);

  // Get sub-row columns using subRow flag from column config
  const subRowColumns = useMemo(() => {
    return columns.filter(col => col.subRow && !preferences.hiddenColumns.includes(col.key));
  }, [columns, preferences.hiddenColumns]);

  const paginatedData = useMemo(() => {
    if (paginationMode === 'infinite') return data;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize, paginationMode]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleCellEdit = (rowIndex: number, columnKey: string, value: any) => {
    if (onInlineEdit) {
      const updatedRow = { ...paginatedData[rowIndex], [columnKey]: value };
      onInlineEdit(rowIndex, updatedRow);
    }
    setEditingCell(null);
  };

  const handleRowToggle = (rowIndex: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowIndex)) {
      newExpanded.delete(rowIndex);
    } else {
      newExpanded.add(rowIndex);
    }
    setExpandedRows(newExpanded);
  };

  const handleColumnSubRowToggle = (columnKey: string) => {
    // Update the column's subRow flag directly
    if (onSubRowToggle) {
      onSubRowToggle(columnKey);
    }
  };

  const handleSelectionChange = (rowIndex: number) => {
    if (!onSelectionChange) return;
    
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowIndex)) {
      newSelection.delete(rowIndex);
    } else {
      newSelection.add(rowIndex);
    }
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    
    if (selectedRows.size === paginatedData.length) {
      onSelectionChange(new Set());
    } else {
      const allIndices = new Set(paginatedData.map((_, index) => index));
      onSelectionChange(allIndices);
    }
  };

  const handleFiltersChange = (newFilters: FilterConfig[]) => {
    setFilters(newFilters);
  };

  const showCheckboxes = !!onSelectionChange;
  const hasSubRowData = subRowColumns.length > 0;

  return (
    <div className="w-full">
      {/* Header with filters and column manager */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
        <div className="flex items-center space-x-4">
          <CommonFilter 
            columns={columns} 
            filters={filters} 
            onFiltersChange={handleFiltersChange} 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {plugins.map((plugin) => 
            plugin.toolbar && (
              <div key={plugin.id}>
                {plugin.toolbar({
                  data,
                  filteredData: paginatedData,
                  selectedRows: Array.from(selectedRows).map(i => paginatedData[i]),
                  columns,
                  preferences,
                  actions: {
                    exportData: () => {},
                    resetPreferences: () => savePreferences({
                      columnOrder: columns.map(col => col.key),
                      hiddenColumns: [],
                      columnWidths: {},
                      columnHeaders: {},
                      subRowColumns: [],
                      subRowColumnOrder: [],
                      filters: []
                    }),
                    toggleRowSelection: handleSelectionChange,
                    selectAllRows: handleSelectAll,
                    clearSelection: () => onSelectionChange?.(new Set())
                  }
                })}
              </div>
            )
          )}
          <div className="relative">
            <ColumnManager
              columns={legacyColumnConversion}
              preferences={preferences}
              onColumnOrderChange={updateColumnOrder}
              onColumnVisibilityToggle={toggleColumnVisibility}
              onColumnHeaderChange={updateColumnHeader}
              onSubRowToggle={handleColumnSubRowToggle}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {hasSubRowData && (
                <th className="w-8 p-2 text-left font-medium text-gray-900 border-b border-gray-200"></th>
              )}
              {showCheckboxes && (
                <th className="w-12 p-3 text-left font-medium text-gray-900 border-b border-gray-200">
                  <Checkbox 
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              {orderedColumns.map((column) => {
                const displayHeader = preferences.columnHeaders[column.key] || column.label;
                return (
                  <th
                    key={column.key}
                    className="p-3 text-left font-medium text-gray-900 border-b border-gray-200 bg-gray-50"
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="truncate">{displayHeader}</span>
                      {column.sortable && (
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </th>
                );
              })}
              {plugins.some(p => p.rowActions) && (
                <th className="w-24 p-3 text-left font-medium text-gray-900 border-b border-gray-200">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => {
              const isExpanded = expandedRows.has(rowIndex);
              const isSelected = selectedRows.has(rowIndex);
              const customClassName = rowClassName ? rowClassName(row, rowIndex) : '';
              
              return (
                <React.Fragment key={rowIndex}>
                  {/* Main row */}
                  <tr 
                    className={`border-b border-gray-200 hover:bg-gray-50 ${customClassName} ${
                      isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    {hasSubRowData && (
                      <td className="w-8 p-2">
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
                    {showCheckboxes && (
                      <td className="w-12 p-3">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => handleSelectionChange(rowIndex)}
                        />
                      </td>
                    )}
                    {orderedColumns.map((column) => (
                      <td key={column.key} className="p-3 border-r border-gray-100 last:border-r-0">
                        {editingCell?.row === rowIndex && editingCell?.column === column.key ? (
                          <CellEditor
                            value={row[column.key]}
                            column={{ ...column, id: column.key, header: column.label, accessor: column.key, type: 'text' }}
                            onSave={(value) => handleCellEdit(rowIndex, column.key, value)}
                            onCancel={() => setEditingCell(null)}
                          />
                        ) : (
                          <CellRenderer
                            value={row[column.key]}
                            column={column}
                            rowData={row}
                            onEdit={
                              editableColumns === true || 
                              (Array.isArray(editableColumns) && editableColumns.includes(column.key))
                                ? () => setEditingCell({ row: rowIndex, column: column.key })
                                : undefined
                            }
                            onLinkClick={onLinkClick}
                          />
                        )}
                      </td>
                    ))}
                    {plugins.some(p => p.rowActions) && (
                      <td className="w-24 p-3">
                        <div className="flex items-center space-x-1">
                          {plugins.map((plugin) => 
                            plugin.rowActions && (
                              <div key={plugin.id}>
                                {plugin.rowActions(row, rowIndex, {
                                  data,
                                  filteredData: paginatedData,
                                  selectedRows: Array.from(selectedRows).map(i => paginatedData[i]),
                                  columns,
                                  preferences,
                                  actions: {
                                    exportData: () => {},
                                    resetPreferences: () => {},
                                    toggleRowSelection: handleSelectionChange,
                                    selectAllRows: handleSelectAll,
                                    clearSelection: () => onSelectionChange?.(new Set())
                                  }
                                })}
                              </div>
                            )
                          )}
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                  
                  {/* Sub-row */}
                  {isExpanded && hasSubRowData && (
                    <tr className="bg-gray-50/50">
                      <td 
                        colSpan={
                          (hasSubRowData ? 1 : 0) + 
                          (showCheckboxes ? 1 : 0) + 
                          orderedColumns.length + 
                          (plugins.some(p => p.rowActions) ? 1 : 0)
                        }
                        className="p-0"
                      >
                        <div className="p-4 bg-white border-l-4 border-l-gray-300 mx-4 mb-2 rounded-r">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subRowColumns.map((column) => (
                              <div key={column.key} className="space-y-1">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  {preferences.columnHeaders[column.key] || column.label}
                                </div>
                                <div className="text-sm text-gray-900">
                                  <CellRenderer
                                    value={row[column.key]}
                                    column={column}
                                    rowData={row}
                                    onLinkClick={onLinkClick}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
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
        <div className="flex items-center justify-between p-4 border-t bg-gray-50/50">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} results
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
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      {plugins.some(p => p.footer) && (
        <div className="border-t bg-gray-50/50">
          {plugins.map((plugin) => 
            plugin.footer && (
              <div key={plugin.id}>
                {plugin.footer({
                  data,
                  filteredData: paginatedData,
                  selectedRows: Array.from(selectedRows).map(i => paginatedData[i]),
                  columns,
                  preferences,
                  actions: {
                    exportData: () => {},
                    resetPreferences: () => {},
                    toggleRowSelection: handleSelectionChange,
                    selectAllRows: handleSelectAll,
                    clearSelection: () => onSelectionChange?.(new Set())
                  }
                })}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
