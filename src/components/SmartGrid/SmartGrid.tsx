import React, { useState, useEffect, useMemo } from 'react';
import { GridToolbar } from './GridToolbar';
import { CellRenderer } from './CellRenderer';
import { CellEditor } from './CellEditor';
import { ColumnFilter } from './ColumnFilter';
import { PluginRenderer, PluginRowActions } from './PluginRenderer';
import { SmartGridProps, GridColumnConfig, SortConfig, FilterConfig, GridAPI } from '@/types/smartgrid';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  rowClassName,
  configurableButtons,
  showDefaultConfigurableButton,
  defaultConfigurableButtonLabel,
  gridTitle,
  recordCount,
  showCreateButton,
  searchPlaceholder,
  onFiltersChange,
  gridId,
  userId,
  filterSystemAPI
}: SmartGridProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);

  const [preferences, setPreferences] = useState({
    columnOrder: columns.map(col => col.key),
    hiddenColumns: [],
    columnWidths: {},
    columnHeaders: {},
    subRowColumns: columns.filter(col => col.subRow).map(col => col.key),
    subRowColumnOrder: columns.filter(col => col.subRow).map(col => col.key),
    enableSubRowConfig: true,
    filters: [],
    pageSize: 10
  });

  const filteredData = useMemo(() => {
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
    filters.forEach(filter => {
      result = result.filter(row => {
        const value = row[filter.column];
        if (value == null) return false;
        
        switch (filter.operator) {
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'equals':
            return value === filter.value;
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
          default:
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
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
  }, [data, globalFilter, filters, sortConfig]);

  const paginatedData = useMemo(() => {
    if (paginationMode === 'infinite') return filteredData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, paginationMode]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleColumnVisibilityToggle = (columnId: string) => {
    setPreferences(prev => ({
      ...prev,
      hiddenColumns: prev.hiddenColumns.includes(columnId)
        ? prev.hiddenColumns.filter(id => id !== columnId)
        : [...prev.hiddenColumns, columnId]
    }));
  };

  const handleColumnHeaderChange = (columnId: string, header: string) => {
    setPreferences(prev => ({
      ...prev,
      columnHeaders: {
        ...prev.columnHeaders,
        [columnId]: header
      }
    }));
  };

  const handleResetToDefaults = () => {
    setPreferences({
      columnOrder: columns.map(col => col.key),
      hiddenColumns: [],
      columnWidths: {},
      columnHeaders: {},
      subRowColumns: columns.filter(col => col.subRow).map(col => col.key),
      subRowColumnOrder: columns.filter(col => col.subRow).map(col => col.key),
      enableSubRowConfig: true,
      filters: [],
      pageSize: 10
    });
    setFilters([]);
    setSortConfig(null);
    setGlobalFilter('');
  };

  const handleExport = (format: 'csv' | 'excel' | 'json') => {
    // Export logic here
    console.log('Exporting to', format);
  };

  const gridAPI: GridAPI = useMemo(() => ({
    data,
    filteredData,
    selectedRows: Array.from(selectedRows).map(index => paginatedData[index]).filter(Boolean),
    columns,
    preferences,
    actions: {
      exportData: (format: 'csv' | 'excel' | 'json') => handleExport(format),
      resetPreferences: handleResetToDefaults,
      toggleRowSelection: (rowIndex: number) => {
        const newSelection = new Set(selectedRows);
        if (newSelection.has(rowIndex)) {
          newSelection.delete(rowIndex);
        } else {
          newSelection.add(rowIndex);
        }
        onSelectionChange?.(newSelection);
      },
      selectAllRows: () => {
        const newSelection = new Set(Array.from({ length: paginatedData.length }, (_, i) => i));
        onSelectionChange?.(newSelection);
      },
      clearSelection: () => {
        onSelectionChange?.(new Set());
      }
    }
  }), [data, filteredData, selectedRows, columns, preferences, paginatedData, onSelectionChange]);

  return (
    <div className="w-full bg-white">
      <GridToolbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        showColumnFilters={showColumnFilters}
        setShowColumnFilters={setShowColumnFilters}
        showCheckboxes={showCheckboxes}
        setShowCheckboxes={setShowCheckboxes}
        viewMode={viewMode}
        setViewMode={setViewMode}
        loading={loading}
        filters={filters}
        columns={columns}
        preferences={preferences}
        onColumnVisibilityToggle={handleColumnVisibilityToggle}
        onColumnHeaderChange={handleColumnHeaderChange}
        onResetToDefaults={handleResetToDefaults}
        onExport={handleExport}
        onSubRowToggle={onSubRowToggle}
        configurableButtons={configurableButtons}
        showDefaultConfigurableButton={showDefaultConfigurableButton}
        defaultConfigurableButtonLabel={defaultConfigurableButtonLabel}
        gridTitle={gridTitle}
        recordCount={recordCount}
        showCreateButton={showCreateButton}
        searchPlaceholder={searchPlaceholder}
        onFiltersChange={onFiltersChange}
        gridId={gridId}
        userId={userId}
        filterSystemAPI={filterSystemAPI}
      />

      {showColumnFilters && (
        <div className="bg-gray-50 border-b">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${columns.filter(col => !preferences.hiddenColumns.includes(col.key)).length}, minmax(0, 1fr))` }}>
            {columns
              .filter(col => !preferences.hiddenColumns.includes(col.key))
              .map(column => (
                <div key={column.key} className="p-2 border-r border-gray-200 last:border-r-0">
                  <ColumnFilter
                    column={column}
                    currentFilter={filters.find(f => f.column === column.key)}
                    onFilterChange={(filter) => {
                      setFilters(prev => {
                        const newFilters = prev.filter(f => f.column !== column.key);
                        if (filter) {
                          newFilters.push(filter);
                        }
                        return newFilters;
                      });
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {showCheckboxes && (
                <th className="w-12 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSelection = new Set(Array.from({ length: paginatedData.length }, (_, i) => i));
                        onSelectionChange?.(newSelection);
                      } else {
                        onSelectionChange?.(new Set());
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns
                .filter(col => !preferences.hiddenColumns.includes(col.key))
                .map(column => (
                  <th
                    key={column.key}
                    className="px-3 py-2 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (column.sortable) {
                        setSortConfig(prev => ({
                          column: column.key,
                          direction: prev?.column === column.key && prev.direction === 'asc' ? 'desc' : 'asc'
                        }));
                      }
                    }}
                  >
                    {preferences.columnHeaders[column.key] || column.label}
                    {sortConfig?.column === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr
                  className={cn(
                    "border-b hover:bg-gray-50",
                    rowClassName?.(row, rowIndex)
                  )}
                >
                  {showCheckboxes && (
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => {
                          const newSelection = new Set(selectedRows);
                          if (newSelection.has(rowIndex)) {
                            newSelection.delete(rowIndex);
                          } else {
                            newSelection.add(rowIndex);
                          }
                          onSelectionChange?.(newSelection);
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  {columns
                    .filter(col => !preferences.hiddenColumns.includes(col.key))
                    .map((column, columnIndex) => (
                      <td key={column.key} className="px-3 py-2">
                        {editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key ? (
                          <CellEditor
                            value={row[column.key]}
                            column={{
                              id: column.key,
                              header: column.label,
                              accessor: column.key,
                              type: column.type === 'EditableText' ? 'text' : 'text',
                              validator: column.type === 'Dropdown' && column.options ? 
                                () => true : undefined,
                              options: column.options?.map(opt => ({ label: opt, value: opt }))
                            }}
                            onSave={(value) => {
                              const updatedRow = { ...row, [column.key]: value };
                              onUpdate?.(updatedRow);
                              setEditingCell(null);
                            }}
                            onCancel={() => setEditingCell(null)}
                          />
                        ) : (
                          <CellRenderer
                            value={row[column.key]}
                            column={column}
                            row={row}
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                            isEditing={false}
                            isEditable={column.editable || false}
                            onEdit={(rowIdx, columnKey, value) => {
                              const updatedRow = { ...row, [columnKey]: value };
                              onUpdate?.(updatedRow);
                            }}
                            onEditStart={(rowIdx, columnKey) => {
                              setEditingCell({ rowIndex, columnKey });
                            }}
                            onEditCancel={() => setEditingCell(null)}
                            onLinkClick={onLinkClick}
                            loading={loading}
                          />
                        )}
                      </td>
                    ))}
                </tr>
                {nestedRowRenderer?.(row, rowIndex)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationMode === 'pagination' && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
            </span>
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
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
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

      {/* Plugin renderers */}
      <PluginRenderer plugins={plugins} gridAPI={gridAPI} type="footer" />
    </div>
  );
}
