
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  FilterFn,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  Table,
} from '@tanstack/react-table';
import {
  ColumnVisibilityManager,
  ColumnFilter,
  CommonFilter
} from '.';
import {
  GridColumnConfig,
  GridPreferences,
  SmartGridProps,
  SortConfig,
  FilterConfig
} from '@/types/smartgrid';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import { CellEditor } from './CellEditor';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

// Define a custom filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId);
  if (rowValue === undefined || rowValue === null) return false;

  const searchTerm = String(value).toLowerCase();
  const normalizedRowValue = String(rowValue).toLowerCase();

  return normalizedRowValue.includes(searchTerm);
};

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
  paginationMode = 'pagination',
  nestedRowRenderer,
  plugins = [],
  selectedRows = new Set(),
  onSelectionChange,
  rowClassName
}: SmartGridProps) {
  const [rowSelection, setRowSelection] = useState(selectedRows);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isInlineEdit, setIsInlineEdit] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [tempRowData, setTempRowData] = useState<any>(null);
  const [tableData, setTableData] = useState(() => data);
  const [columns, setColumns] = useState<GridColumnConfig[]>(initialColumns);

  const {
    preferences,
    setPreferences,
    resetPreferences,
    toggleColumnVisibility,
    setColumnOrder,
    setColumnHeader,
    applySort,
    applyFilter,
    setPageSize
  } = useGridPreferences({
    columns: initialColumns,
    onPreferenceSave
  });

  // Filter out collapsible child columns from main table display
  const mainColumns = useMemo(() => {
    return columns.filter(col => !col.collapsibleChild);
  }, [columns]);

  const reactTableColumns = useMemo<ColumnDef<any>[]>(() => {
    return mainColumns.map(column => {
      const isEditable = editableColumns === true || (Array.isArray(editableColumns) && editableColumns.includes(column.key));

      return {
        id: column.key,
        header: column.label,
        accessorKey: column.key,
        sortingFn: fuzzyFilter,
        filterFn: fuzzyFilter,
        cell: info => {
          const value = info.getValue();
          const row = info.row.original;

          if (column.type === 'Link') {
            return (
              <a
                href="#"
                className="text-blue-500 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  if (column.onClick) {
                    column.onClick(row);
                  } else if (onLinkClick) {
                    onLinkClick(value, row);
                  }
                }}
              >
                {value}
              </a>
            );
          }

          if (column.type === 'Badge') {
            const statusMap = column.statusMap || {};
            const badgeClass = statusMap[value] || 'bg-gray-100 text-gray-800';
            return <span className={`px-2 py-1 rounded ${badgeClass}`}>{value}</span>;
          }

          if (column.type === 'DateTimeRange') {
            const [start, end] = String(value).split('\n');
            return (
              <div>
                <div>{start}</div>
                <div>{end}</div>
              </div>
            );
          }

          if (column.type === 'TextWithTooltip') {
            const infoText = row[column.infoTextField || ''] || '';
            return (
              <div className="relative group">
                {value}
                {infoText && (
                  <div className="absolute z-10 hidden group-hover:block bg-gray-100 border border-gray-300 rounded p-2 text-sm w-64">
                    {infoText}
                  </div>
                )}
              </div>
            );
          }

          if (column.type === 'ExpandableCount') {
            const count = Array.isArray(row[column.key]) ? row[column.key].length : 0;
            return `+${count}`;
          }

          if (column.type === 'EditableText' && isEditable && editingRow === info.row.index) {
            return (
              <CellEditor
                value={value}
                column={column}
                onSave={(newValue: any) => handleInlineEditSave(info.row.index, column.key, newValue)}
                onCancel={handleInlineEditCancel}
              />
            );
          }

          return value;
        },
        enableSorting: column.sortable,
        enableHiding: !column.mandatory,
        enableColumnFilter: column.filterable,
        
      };
    });
  }, [mainColumns, editableColumns, onLinkClick, editingRow]);

  const table = useReactTable({
    data: tableData,
    columns: reactTableColumns,
    state: {
      sorting: sorting,
      columnVisibility: columnVisibility,
      columnFilters: columnFilters,
      rowSelection: rowSelection,
      globalFilter: globalFilter,
    },
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    initialState: {
      pagination: {
        pageSize: preferences.pageSize || 10,
      },
    },
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (selectedRows) {
      setRowSelection(selectedRows);
    }
  }, [selectedRows]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(rowSelection);
    }
  }, [rowSelection, onSelectionChange]);

  const handleColumnConfigChange = (columnId: string, config: Partial<GridColumnConfig>) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.key === columnId ? { ...col, ...config } : col
      )
    );
  };

  const handleSortApply = (sortConfig: SortConfig) => {
    applySort(sortConfig);
    setSorting([{ id: sortConfig.column, desc: sortConfig.direction === 'desc' }]);
  };

  const handleFilterApply = (filterConfig: FilterConfig) => {
    applyFilter(filterConfig);
    setColumnFilters([{ id: filterConfig.column, value: filterConfig.value }]);
  };

  const handleFilterClear = (columnId: string) => {
    applyFilter({ column: columnId, value: '' });
    setColumnFilters(columnFilters.filter(filter => filter.id !== columnId));
  };

  const handleInlineEdit = (rowIndex: number) => {
    setEditingRow(rowIndex);
    setTempRowData(tableData[rowIndex]);
  };

  const handleInlineEditSave = async (rowIndex: number, columnId: string, newValue: any) => {
    const updatedRow = { ...tableData[rowIndex], [columnId]: newValue };
    setTableData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = updatedRow;
      return newData;
    });
    setEditingRow(null);
    setTempRowData(null);

    if (onUpdate) {
      await onUpdate(updatedRow);
    }
  };

  const handleInlineEditCancel = () => {
    if (tempRowData) {
      setTableData(prevData => {
        const newData = [...prevData];
        newData[editingRow || 0] = tempRowData;
        return newData;
      });
    }
    setEditingRow(null);
    setTempRowData(null);
  };

  const visibleColumns = useMemo(() => {
    return columns.filter(column => !preferences.hiddenColumns.includes(column.key));
  }, [columns, preferences.hiddenColumns]);

  const collapsibleColumns = useMemo(() => {
    return columns.filter(column => column.collapsibleChild);
  }, [columns]);

  const hasCollapsibleRows = collapsibleColumns.length > 0;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
        <div className="flex items-center space-x-2">
          <CommonFilter
            columns={visibleColumns}
            onFilterChange={(filter) => {
              if (filter) {
                setGlobalFilter(filter.value);
              } else {
                setGlobalFilter('');
              }
            }}
          />
          <ColumnVisibilityManager
            columns={columns}
            preferences={preferences}
            onColumnVisibilityToggle={toggleColumnVisibility}
            onResetToDefaults={resetPreferences}
            onColumnConfigChange={handleColumnConfigChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          {plugins.map(plugin => (
            plugin.toolbar && <React.Fragment key={plugin.id}>{plugin.toolbar({
              data: tableData,
              filteredData: tableData, // TODO: Implement filteredData
              selectedRows: [], // TODO: Implement selectedRows
              columns: columns,
              preferences: preferences,
              actions: {
                exportData: () => { }, // TODO: Implement exportData
                resetPreferences: resetPreferences,
                toggleRowSelection: () => { }, // TODO: Implement toggleRowSelection
                selectAllRows: () => { }, // TODO: Implement selectAllRows
                clearSelection: () => { } // TODO: Implement clearSelection
              }
            })}</React.Fragment>
          ))}
          {paginationMode === 'pagination' && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    table.setPageIndex(page)
                  }}
                  className="w-16 border p-1 rounded"
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value))
                }}
                className="border p-1 rounded"
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} className="px-4 py-2 border-b text-left">
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ArrowUp className="inline-block w-4 h-4 ml-1 align-middle" />,
                            desc: <ArrowDown className="inline-block w-4 h-4 ml-1 align-middle" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                      {header.column.getCanFilter() ? (
                        <div>
                          <ColumnFilter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => {
              const isRowSelected = rowSelection[row.id];
              const rowClass = rowClassName ? rowClassName(row.original, index) : '';
              return (
                <React.Fragment key={row.id}>
                  <tr
                    onClick={() => handleInlineEdit(index)}
                    className={`${rowClass} ${isRowSelected ? 'bg-blue-50' : ''} hover:bg-gray-100 cursor-pointer`}
                  >
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td key={cell.id} className="px-4 py-2 border-b">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                  {hasCollapsibleRows && nestedRowRenderer && (
                    <tr key={`${row.id}-details`} className="bg-gray-50">
                      <td colSpan={reactTableColumns.length}>
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {collapsibleColumns.map(column => (
                              <div key={column.key} className="flex flex-col">
                                <span className="text-sm font-medium text-gray-600">{column.label}</span>
                                <span className="text-sm">{row.original[column.key]}</span>
                              </div>
                            ))}
                          </div>
                          {nestedRowRenderer(row.original)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationMode === 'infinite' && (
        <div className="flex items-center justify-center p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
