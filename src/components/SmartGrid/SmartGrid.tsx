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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [filters, setFilters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

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

  const table = useReactTable({
    data,
    columns: processedColumns as ColumnDef<any, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    columnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
    },
    // Pass preferences to the table
    initialState: {
      columnVisibility: Object.fromEntries(
        processedColumns.filter(col => col.hidden).map(col => [col.key, false])
      ),
    },
  });

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
    filteredData: table.getFilteredRowModel().rows.map(row => row.original),
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
  }), [data, table.getFilteredRowModel().rows, selectedRows, processedColumns, preferences]);

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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {showCheckboxes && (
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={table.getIsAllPageRowsSelected()}
                      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-left">
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {
                            {
                              asc: <ArrowUp className="ml-2 h-4 w-4" />,
                              desc: <ArrowDown className="ml-2 h-4 w-4" />,
                            }[header.column.getIsSorted() as string]
                          }
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-index={index}
                  className={rowClassName ? rowClassName(row.original, index) : ''}
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
