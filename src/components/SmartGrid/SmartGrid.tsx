import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { 
  ArrowDown, 
  ArrowUp,
  ChevronsUpDown,
  Download,
  RotateCcw
} from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  GridColumnConfig,
  GridPreferences,
  SmartGridProps,
  SortConfig,
} from '@/types/smartgrid';
import { GridToolbar } from './GridToolbar';

export function SmartGrid({
  columns: initialColumns,
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
  const [sorting, setSorting] = useState<{ column: string; direction: 'asc' | 'desc' }[]>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [filters, setFilters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Preference Management
  const [preferences, setPreferences] = useLocalStorage<GridPreferences>(
    `grid-preferences-${gridId}-${userId}`,
    {
      columnOrder: initialColumns.map(col => col.key),
      hiddenColumns: [],
      columnWidths: {},
      columnHeaders: {},
      subRowColumns: [],
      subRowColumnOrder: [],
      enableSubRowConfig: true,
      sort: null,
      filters: [],
      pageSize: 10,
    }
  );

  // State for tracking sub-row column order and visibility
  const [subRowColumnOrder, setSubRowColumnOrder] = useState<string[]>(preferences.subRowColumnOrder || []);
  const [showSubRowColumns, setShowSubRowColumns] = useState(preferences.subRowColumns || []);

  // State for inline editing
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);

  // ForceUpdate trigger
  const [forceUpdate, setForceUpdate] = useState(0);

  // Process columns with preferences
  const processedColumns = useMemo(() => {
    return initialColumns.map(col => {
      const hidden = preferences.hiddenColumns?.includes(col.key);
      const header = preferences.columnHeaders?.[col.key] || col.label;
      return {
        ...col,
        header: header,
        hidden: hidden,
      };
    });
  }, [initialColumns, preferences.hiddenColumns, preferences.columnHeaders, forceUpdate]);

  // Filter data based on global filter
  const filteredData = useMemo(() => {
    if (!debouncedGlobalFilter) return data;
    
    return data.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(debouncedGlobalFilter.toLowerCase())
      )
    );
  }, [data, debouncedGlobalFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      for (const sort of sorting) {
        const aValue = a[sort.column];
        const bValue = b[sort.column];
        
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sorting]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handlers
  const handleColumnVisibilityToggle = (columnId: string) => {
    const newHiddenColumns = preferences.hiddenColumns?.includes(columnId)
      ? preferences.hiddenColumns.filter(id => id !== columnId)
      : [...(preferences.hiddenColumns || []), columnId];

    setPreferences(prev => ({
      ...prev,
      hiddenColumns: newHiddenColumns,
    }));
  };

  const handleColumnHeaderChange = (columnId: string, header: string) => {
    setPreferences(prev => ({
      ...prev,
      columnHeaders: {
        ...(prev.columnHeaders || {}),
        [columnId]: header,
      },
    }));
  };

  const handleResetToDefaults = () => {
    setPreferences({
      columnOrder: initialColumns.map(col => col.key),
      hiddenColumns: [],
      columnWidths: {},
      columnHeaders: {},
      subRowColumns: [],
      subRowColumnOrder: [],
      enableSubRowConfig: true,
      sort: null,
      filters: [],
      pageSize: 10,
    });
    setForceUpdate(prev => prev + 1);
  };

  const handleExport = (format: 'csv' | 'excel' | 'json') => {
    // Implement export logic here
    toast({
      title: "Exporting data",
      description: `Exporting data in ${format} format.`,
    });
  };

  const handleSort = (columnKey: string) => {
    setSorting(prev => {
      const existing = prev.find(s => s.column === columnKey);
      if (existing) {
        if (existing.direction === 'asc') {
          return prev.map(s => s.column === columnKey ? { ...s, direction: 'desc' as const } : s);
        } else {
          return prev.filter(s => s.column !== columnKey);
        }
      } else {
        return [...prev, { column: columnKey, direction: 'asc' as const }];
      }
    });
  };

  const getSortDirection = (columnKey: string) => {
    const sort = sorting.find(s => s.column === columnKey);
    return sort?.direction;
  };

  const handleInlineEdit = (rowIndex: number, columnId: string, value: any) => {
    if (onInlineEdit) {
      const updatedRow = { ...data[rowIndex], [columnId]: value, index: rowIndex };
      onInlineEdit(rowIndex, updatedRow);
    }
  };

  const handleBulkUpdate = async (rows: any[]) => {
    if (onBulkUpdate) {
      await onBulkUpdate(rows);
    }
  };

  const handlePreferenceSave = async (preferences: GridPreferences) => {
    if (onPreferenceSave) {
      await onPreferenceSave(preferences);
    }
  };

  const handleDataFetch = async (page: number, pageSize: number) => {
    if (onDataFetch) {
      await onDataFetch(page, pageSize);
    }
  };

  const handleUpdate = async (row: any) => {
    if (onUpdate) {
      await onUpdate(row);
    }
  };

  const handleLinkClick = (rowData: any, columnKey: string) => {
    if (onLinkClick) {
      onLinkClick(rowData, columnKey);
    }
  };

  const handleSubRowToggle = (columnKey: string) => {
    if (onSubRowToggle) {
      onSubRowToggle(columnKey);
    }
  };

  const toggleRowSelection = (rowIndex: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    onSelectionChange?.(newSelectedRows);
  };

  const selectAllRows = () => {
    const allRows = Array.from({ length: data.length }, (_, i) => i);
    const newSelectedRows = new Set(allRows);
    onSelectionChange?.(newSelectedRows);
  };

  const clearSelection = () => {
    onSelectionChange?.(new Set());
  };

  const api = useMemo(() => ({
    data,
    filteredData: sortedData,
    selectedRows: Array.from(selectedRows).map(rowIndex => data[rowIndex]),
    columns: processedColumns,
    preferences,
    actions: {
      exportData: handleExport,
      resetPreferences: handleResetToDefaults,
      toggleRowSelection: toggleRowSelection,
      selectAllRows: selectAllRows,
      clearSelection: clearSelection,
    }
  }), [data, sortedData, selectedRows, processedColumns, preferences]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  return (
    <div className="smart-grid bg-white">
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
        columns={processedColumns}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {showCheckboxes && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={(value) => {
                      if (value) {
                        selectAllRows();
                      } else {
                        clearSelection();
                      }
                    }}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {processedColumns.filter(col => !col.hidden).map((column) => (
                <TableHead key={column.key} className="text-left">
                  <div
                    className={column.sortable ? "cursor-pointer select-none flex items-center" : ""}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.header}
                    {column.sortable && (
                      <>
                        {getSortDirection(column.key) === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
                        {getSortDirection(column.key) === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
                        {!getSortDirection(column.key) && <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />}
                      </>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  data-index={index}
                  className={rowClassName ? rowClassName(row, index) : ''}
                  onClick={() => {
                    if (showCheckboxes) {
                      toggleRowSelection(index);
                    }
                  }}
                >
                  {showCheckboxes && (
                    <TableCell className="w-[50px]">
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onCheckedChange={() => toggleRowSelection(index)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {processedColumns.filter(col => !col.hidden).map((column) => (
                    <TableCell key={column.key}>
                      {/* Simple cell rendering - you can enhance this with CellRenderer */}
                      {typeof row[column.key] === 'object' && row[column.key]?.value 
                        ? row[column.key].value 
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={100} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationMode === 'pagination' && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
