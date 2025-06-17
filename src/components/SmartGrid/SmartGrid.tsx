
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useRowSelect,
  useColumnOrder,
  TableInstance,
  UsePaginationInstanceProps,
  UseRowSelectInstanceProps,
  UseSortByInstanceProps,
  UseFiltersInstanceProps,
  UseGlobalFiltersInstanceProps,
  Column
} from 'react-table';
import {
  ColumnVisibilityManager,
  ColumnFilter,
  CommonFilter,
} from '@/components/SmartGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GridColumnConfig,
  GridPreferences,
  SmartGridProps,
  SortConfig,
  FilterConfig,
} from '@/types/smartgrid';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import {
  ArrowDown,
  ArrowUp,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { downloadCSV, downloadExcel, downloadJSON } from '@/utils/gridExport';
import { useToast } from '@/hooks/use-toast';
import { CellEditor } from './CellEditor';
import { ColumnManager } from './ColumnManager';
import { cn } from '@/lib/utils';

// Define the table instance type with all the plugins
type TableInstanceWithPlugins<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T> &
  UseRowSelectInstanceProps<T> &
  UseSortByInstanceProps<T> &
  UseFiltersInstanceProps<T> &
  UseGlobalFiltersInstanceProps<T>;

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
  selectedRows,
  onSelectionChange,
  rowClassName,
  enableCollapsibleRows = false
}: SmartGridProps & { enableCollapsibleRows?: boolean }) {
  const [columns, setColumns] = useState<GridColumnConfig[]>(initialColumns);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([]);
  const [preferences, setPreferences] = useState<GridPreferences>({
    columnOrder: columns.map(col => col.key),
    hiddenColumns: [],
    columnWidths: {},
    columnHeaders: {},
    filters: [],
  });
  const { toast } = useToast();

  // Preferences hook
  const {
    preferences: hookPreferences,
    loadPreferences,
    savePreferences,
    resetPreferences,
  } = useGridPreferences(
    columns.map(col => ({ id: col.key, header: col.label, accessor: col.key })),
    true,
    'smartgrid-preferences'
  );

  useEffect(() => {
    // Load preferences on component mount
    const loadStoredPreferences = async () => {
      const storedPreferences = await loadPreferences();
      if (storedPreferences) {
        setPreferences(storedPreferences);
      }
    };
    loadStoredPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    // Apply loaded preferences
    applyPreferences(preferences);
  }, [preferences]);

  const applyPreferences = (prefs: GridPreferences) => {
    // Apply column order
    if (prefs.columnOrder) {
      setColumns(prevColumns => {
        const orderedColumns = [...prevColumns];
        orderedColumns.sort((a, b) => {
          const indexA = prefs.columnOrder.indexOf(a.key);
          const indexB = prefs.columnOrder.indexOf(b.key);
          
          // Handle cases where column keys are not found in the columnOrder array
          if (indexA === -1 && indexB === -1) return 0; // Keep original order if both are not found
          if (indexA === -1) return 1; // Move 'b' to an earlier position if 'a' is not found
          if (indexB === -1) return -1; // Move 'a' to an earlier position if 'b' is not found
          
          return indexA - indexB;
        });
        return orderedColumns;
      });
    }
  
    // Apply hidden columns
    if (prefs.hiddenColumns) {
      setColumns(prevColumns =>
        prevColumns.map(col => ({
          ...col,
          hidden: prefs.hiddenColumns.includes(col.key),
        }))
      );
    }
  
     // Apply column headers
     if (prefs.columnHeaders) {
      setColumns(prevColumns =>
        prevColumns.map(col => ({
          ...col,
          label: prefs.columnHeaders[col.key] || col.label,
        }))
      );
    }
  
    // Apply sort configuration
    if (prefs.sort) {
      setSortConfig(prefs.sort);
    }
  
    // Apply filter configurations
    if (prefs.filters) {
      setFilterConfigs(prefs.filters);
    }
  };

  const saveGridPreferences = async (newPreferences: GridPreferences) => {
    setPreferences(newPreferences);
    await savePreferences(newPreferences);
    if (onPreferenceSave) {
      await onPreferenceSave(newPreferences);
    }
  };

  const resetGridPreferences = async () => {
    await resetPreferences();
    setPreferences({
      columnOrder: initialColumns.map(col => col.key),
      hiddenColumns: [],
      columnWidths: {},
      columnHeaders: {},
      filters: [],
    });
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.key === columnId ? { ...col, hidden: !col.hidden } : col
      )
    );
  };

  const handleColumnConfigChange = (columnId: string, config: Partial<GridColumnConfig>) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.key === columnId ? { ...col, ...config } : col
      )
    );
  };

  const memoizedColumns = useMemo(
    (): Column<any>[] =>
      columns.map(column => ({
        Header: column.label,
        accessor: column.key,
        sortable: column.sortable,
        filterable: column.filterable,
        Cell: ({ value, row }: any) => {
          switch (column.type) {
            case 'Link':
              return (
                <Button
                  variant="link"
                  onClick={() => onLinkClick?.(row.original, column.key)}
                >
                  {value}
                </Button>
              );
            case 'Badge':
              return (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${value.variant}`}>
                  {value.value}
                </span>
              );
            case 'DateTimeRange':
              const [start, end] = value?.split('\n') || ['', ''];
              return (
                <div className="flex flex-col">
                  <span className="text-xs">{start}</span>
                  <span className="text-xs">{end}</span>
                </div>
              );
            case 'TextWithTooltip':
              return (
                <div className="relative">
                  <span>{value}</span>
                  {column.infoTextField && row.original[column.infoTextField] && (
                    <div className="absolute left-full top-0 ml-2 bg-gray-100 border border-gray-300 rounded p-2 text-xs shadow-md z-10">
                      {row.original[column.infoTextField]}
                    </div>
                  )}
                </div>
              );
            case 'ExpandableCount':
              const count = value?.split('+')?.[1];
              return (
                <Button variant="link">
                  {value}
                </Button>
              );
            case 'EditableText':
              const isEditable =
                typeof editableColumns === 'boolean'
                  ? editableColumns
                  : editableColumns.includes(column.key);
              return isEditable ? (
                <CellEditor
                  value={value}
                  column={{
                    id: column.key,
                    header: column.label,
                    accessor: column.key,
                    type: 'text'
                  }}
                  onSave={newValue => {
                    if (onInlineEdit) {
                      onInlineEdit(row.index, { [column.key]: newValue });
                    }
                    if (onUpdate) {
                      onUpdate({ ...row.original, [column.key]: newValue });
                    }
                  }}
                  onCancel={() => {}}
                />
              ) : (
                <span>{value}</span>
              );
            default:
              return <span>{value}</span>;
          }
        },
        Filter: ColumnFilter,
        disableFilters: !column.filterable,
        show: !column.hidden,
      })),
    [columns, editableColumns, onLinkClick, onInlineEdit, onUpdate]
  );

  const tableInstance = useTable(
    {
      columns: memoizedColumns,
      data: data,
      initialState: {
        sortBy: sortConfig ? [{
          id: sortConfig.column,
          desc: sortConfig.direction === 'desc',
        }] : [],
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useSortBy,
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    useColumnOrder,
  ) as TableInstanceWithPlugins<any>;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter: setReactTableGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedRowIds,
    toggleRowSelected,
    toggleAllRowsSelected,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  const handleGlobalFilterChange = useAsyncDebounce(value => {
    setReactTableGlobalFilter(value);
  }, 200);

  useEffect(() => {
    handleGlobalFilterChange(globalFilter);
  }, [globalFilter, handleGlobalFilterChange]);

  const toggleRowSelection = (rowIndex: number) => {
    toggleRowSelected(rowIndex);
    const newSelectedRows = new Set(selectedRowIds ? Object.keys(selectedRowIds).map(Number) : []);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    onSelectionChange?.(newSelectedRows);
  };

  const selectAllRows = () => {
    toggleAllRowsSelected(true);
    const allRowIndices = Array.from({ length: data.length }, (_, i) => i);
    onSelectionChange?.(new Set(allRowIndices));
  };

  const clearSelection = () => {
    toggleAllRowsSelected(false);
    onSelectionChange?.(new Set());
  };

  const gridAPI = useMemo(() => ({
    data,
    filteredData: data, // TODO: Implement filtering
    selectedRows: Object.keys(selectedRowIds).map(Number),
    columns,
    preferences,
    actions: {
      exportData: (format: 'csv' | 'excel' | 'json') => {
        switch (format) {
          case 'csv':
            downloadCSV(data, columns);
            break;
          case 'excel':
            downloadExcel(data, columns);
            break;
          case 'json':
            downloadJSON(data);
            break;
          default:
            console.warn(`Unsupported export format: ${format}`);
        }
      },
      resetPreferences: resetGridPreferences,
      toggleRowSelection: toggleRowSelection,
      selectAllRows: selectAllRows,
      clearSelection: clearSelection,
    },
  }), [data, selectedRowIds, columns, preferences, resetGridPreferences, toggleRowSelection, selectAllRows, clearSelection]);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
        <div className="flex items-center space-x-2">
          <CommonFilter
            onChange={setGlobalFilter}
            placeholder="Search all columns..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <ColumnVisibilityManager
            columns={columns}
            preferences={preferences}
            onColumnVisibilityToggle={toggleColumnVisibility}
            onResetToDefaults={resetGridPreferences}
            onColumnConfigChange={handleColumnConfigChange}
          />
          
          {/* Plugin toolbar items */}
          {plugins.map(plugin => plugin.toolbar?.(gridAPI)).filter(Boolean)}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="w-full border-collapse">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps((column as any).getSortByToggleProps ? (column as any).getSortByToggleProps() : {})}
                    className="px-4 py-2 border-b font-medium text-left text-sm text-gray-500 uppercase tracking-wider"
                  >
                    {column.render('Header')}
                    {(column as any).sortable ? (
                      <span>
                        {(column as any).isSorted ? (
                          (column as any).isSortedDesc ? (
                            <ArrowDown className="inline-block w-4 h-4 ml-1" />
                          ) : (
                            <ArrowUp className="inline-block w-4 h-4 ml-1" />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowClassNameResult = rowClassName ? rowClassName(row.original, row.index) : '';
              return (
                <React.Fragment key={row.getRowProps().key}>
                  <tr {...row.getRowProps()} className={rowClassNameResult}>
                    {row.cells.map(cell => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="px-4 py-2 border-b text-sm"
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                  {enableCollapsibleRows && columns.some(col => col.collapsibleChild) && (
                    <tr className="bg-gray-50">
                      <td colSpan={visibleColumns.length} className="p-4">
                        {columns.filter(col => col.collapsibleChild).map(col => (
                          <div key={col.key}>
                            <strong>{col.label}:</strong> {row.original[col.key]}
                          </div>
                        ))}
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
        <div className="py-3 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page{' '}
              <span className="font-medium">{pageIndex + 1}</span> of{' '}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <Input
              type="number"
              min={1}
              max={pageOptions.length}
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              className="w-16 h-8 text-sm font-normal"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              variant="outline"
              size="sm"
              className="h-8 px-2"
            >
              <ChevronsLeft className="h-4 w-4 mr-2" />
              First
            </Button>
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              variant="outline"
              size="sm"
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              variant="outline"
              size="sm"
              className="h-8 px-2"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              onClick={() => gotoPage(pageOptions.length - 1)}
              disabled={!canNextPage}
              variant="outline"
              size="sm"
              className="h-8 px-2"
            >
              Last
              <ChevronsRight className="h-4 w-4 ml-2" />
            </Button>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              className="h-8 rounded-md border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
