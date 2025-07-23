import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  GripVertical,
  ChevronRight, 
  ChevronDown,
  Plus,
  Trash2,
  Check,
  X,
  Download,
  Filter
} from 'lucide-react';
import { SmartGridPlusProps, GridColumnConfig, SortConfig, FilterConfig, GridAPI } from '@/types/smartgrid';
import { exportToCSV } from '@/utils/gridExport';
import { useToast } from '@/hooks/use-toast';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import { useSmartGridState } from '@/hooks/useSmartGridState';
import { processGridData } from '@/utils/gridDataProcessing';
import { calculateColumnWidths } from '@/utils/columnWidthCalculations';
import { CellRenderer } from './CellRenderer';
import { GridToolbar } from './GridToolbar';
import { PluginRenderer, PluginRowActions } from './PluginRenderer';
import { ColumnFilter } from './ColumnFilter';
import { DraggableSubRow } from './DraggableSubRow';
import { FilterSystem } from './FilterSystem';
import { mockFilterAPI } from '@/utils/mockFilterAPI';
import { cn } from '@/lib/utils';

export function SmartGridPlus({
  columns,
  data,
  editableColumns = true,
  mandatoryColumns = [],
  onInlineEdit,
  onBulkUpdate,
  onPreferenceSave,
  onDataFetch,
  onUpdate,
  onLinkClick,
  onSubRowToggle,
  onServerFilter,
  paginationMode = 'pagination',
  nestedRowRenderer,
  plugins = [],
  selectedRows,
  onSelectionChange,
  rowClassName,
  configurableButtons,
  showDefaultConfigurableButton,
  defaultConfigurableButtonLabel,
  gridTitle,
  recordCount,
  // SmartGridPlus specific props
  inlineRowAddition = true,
  inlineRowEditing = true,
  onAddRow,
  onEditRow,
  onDeleteRow,
  defaultRowValues = {},
  validationRules = {},
  addRowButtonLabel = "Add Row",
  addRowButtonPosition = "top-left"
}: SmartGridPlusProps) {
  const {
    gridData,
    setGridData,
    columns: stateColumns,
    setColumns,
    editingCell,
    setEditingCell,
    editingHeader,
    setEditingHeader,
    draggedColumn,
    setDraggedColumn,
    dragOverColumn,
    setDragOverColumn,
    sort,
    setSort,
    filters,
    setFilters,
    globalFilter,
    setGlobalFilter,
    currentPage,
    setCurrentPage,
    loading,
    setLoading,
    error,
    setError,
    expandedRows,
    setExpandedRows,
    internalSelectedRows,
    setInternalSelectedRows,
    showCheckboxes,
    setShowCheckboxes,
    viewMode,
    setViewMode,
    showColumnFilters,
    setShowColumnFilters,
    resizingColumn,
    setResizingColumn,
    resizeHoverColumn,
    setResizeHoverColumn,
    columnWidths,
    setColumnWidths,
    resizeStartRef,
    handleColumnFilterChange,
    handleClearColumnFilter,
    handleSort,
    toggleRowExpansion,
    handleSubRowToggle,
    handleSubRowEdit,
    handleSubRowEditStart,
    handleSubRowEditCancel,
    handleReorderSubRowColumns
  } = useSmartGridState();

  const { toast } = useToast();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRowValues, setNewRowValues] = useState<Record<string, any>>(defaultRowValues);

  const {
    preferences,
    updateColumnOrder,
    toggleColumnVisibility,
    updateColumnWidth,
    updateColumnHeader
  } = useGridPreferences([], true, 'smartgridplus-preferences');

  // Initialize grid data and columns
  useEffect(() => {
    setGridData(data);
    setColumns(columns);
  }, [data, columns, setGridData, setColumns]);

  // Process data
  const processedData = useMemo(() => {
    return processGridData(gridData, globalFilter, filters, sort, stateColumns, onDataFetch);
  }, [gridData, globalFilter, filters, sort, stateColumns, onDataFetch]);

  // Pagination
  const pageSize = paginationMode === 'pagination' ? 10 : processedData.length;
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = processedData.slice(startIndex, endIndex);

  // Add Row functionality
  const handleAddRowClick = useCallback(() => {
    setIsAddingRow(true);
    setNewRowValues(defaultRowValues);
    // Scroll to top if needed
    if (addRowButtonPosition === "top") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [defaultRowValues, addRowButtonPosition]);

  const validateRow = useCallback((values: Record<string, any>) => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    if (validationRules.requiredFields) {
      validationRules.requiredFields.forEach(field => {
        if (!values[field] || values[field].toString().trim() === '') {
          errors[field] = 'This field is required';
        }
      });
    }

    // Max length validation
    if (validationRules.maxLength) {
      Object.entries(validationRules.maxLength).forEach(([field, maxLen]) => {
        if (values[field] && values[field].toString().length > maxLen) {
          errors[field] = `Maximum ${maxLen} characters allowed`;
        }
      });
    }

    // Custom validation
    if (validationRules.customValidationFn) {
      const customErrors = validationRules.customValidationFn(values);
      Object.assign(errors, customErrors);
    }

    return errors;
  }, [validationRules]);

  const handleSaveNewRow = useCallback(async () => {
    const errors = validateRow(newRowValues);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const newRow = {
        id: Date.now().toString(),
        ...newRowValues
      };

      const updatedData = [newRow, ...gridData];
      setGridData(updatedData);
      
      if (onAddRow) {
        await onAddRow(newRow);
      }

      setIsAddingRow(false);
      setNewRowValues(defaultRowValues);
      setValidationErrors({});
      
      toast({
        title: "Row Added",
        description: "New row has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new row.",
        variant: "destructive",
      });
    }
  }, [newRowValues, validateRow, gridData, setGridData, onAddRow, defaultRowValues, toast]);

  const handleCancelNewRow = useCallback(() => {
    setIsAddingRow(false);
    setNewRowValues(defaultRowValues);
    setValidationErrors({});
  }, [defaultRowValues]);

  // Edit Row functionality
  const handleStartEdit = useCallback((rowIndex: number, row: any) => {
    setEditingRow(rowIndex);
    setEditingValues({ ...row });
    setValidationErrors({});
  }, []);

  const handleSaveEdit = useCallback(async (rowIndex: number) => {
    const errors = validateRow(editingValues);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const updatedData = [...gridData];
      updatedData[rowIndex] = { ...editingValues };
      setGridData(updatedData);
      
      if (onEditRow) {
        await onEditRow(editingValues, rowIndex);
      }

      setEditingRow(null);
      setEditingValues({});
      setValidationErrors({});
      
      toast({
        title: "Row Updated",
        description: "Row has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update row.",
        variant: "destructive",
      });
    }
  }, [editingValues, validateRow, gridData, setGridData, onEditRow, toast]);

  const handleCancelEdit = useCallback(() => {
    setEditingRow(null);
    setEditingValues({});
    setValidationErrors({});
  }, []);

  const handleDeleteRow = useCallback(async (rowIndex: number, row: any) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      try {
        const updatedData = gridData.filter((_, index) => index !== rowIndex);
        setGridData(updatedData);
        
        if (onDeleteRow) {
          await onDeleteRow(row, rowIndex);
        }

        toast({
          title: "Row Deleted",
          description: "Row has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete row.",
          variant: "destructive",
        });
      }
    }
  }, [gridData, setGridData, onDeleteRow, toast]);

  // Cell editing for inline editing
  const handleCellEdit = useCallback((rowIndex: number, columnKey: string, value: any) => {
    if (editingRow === rowIndex) {
      setEditingValues(prev => ({
        ...prev,
        [columnKey]: value
      }));
      
      // Clear validation error for this field
      if (validationErrors[columnKey]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[columnKey];
          return newErrors;
        });
      }
    }
  }, [editingRow, validationErrors]);

  const handleCellDoubleClick = useCallback((rowIndex: number, row: any) => {
    if (inlineRowEditing && editingRow !== rowIndex) {
      handleStartEdit(rowIndex, row);
    }
  }, [inlineRowEditing, editingRow, handleStartEdit]);

  // Render add row form
  const renderAddRowForm = () => {
    if (!isAddingRow) return null;

    return (
      <TableRow className="bg-blue-50 border-2 border-blue-200">
        {stateColumns.map((column) => (
          <TableCell key={column.key} className="p-2">
            {column.key === 'actions' ? (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  onClick={handleSaveNewRow}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelNewRow}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                <Input
                  type="text"
                  value={newRowValues[column.key] || ''}
                  onChange={(e) => setNewRowValues(prev => ({
                    ...prev,
                    [column.key]: e.target.value
                  }))}
                  className={cn(
                    "h-8 text-sm",
                    validationErrors[column.key] && "border-red-500"
                  )}
                  placeholder={column.label}
                />
                {validationErrors[column.key] && (
                  <div className="text-xs text-red-600">
                    {validationErrors[column.key]}
                  </div>
                )}
              </div>
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // Render cell content with editing capability
  const renderEditableCell = (row: any, column: GridColumnConfig, rowIndex: number) => {
    const isEditing = editingRow === rowIndex;
    const value = isEditing ? editingValues[column.key] : row[column.key];

    if (column.key === 'actions') {
      return (
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={() => handleSaveEdit(rowIndex)}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStartEdit(rowIndex, row)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteRow(rowIndex, row)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      );
    }

    if (isEditing && inlineRowEditing) {
      return (
        <div className="space-y-1">
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleCellEdit(rowIndex, column.key, e.target.value)}
            className={cn(
              "h-8 text-sm",
              validationErrors[column.key] && "border-red-500"
            )}
          />
          {validationErrors[column.key] && (
            <div className="text-xs text-red-600">
              {validationErrors[column.key]}
            </div>
          )}
        </div>
      );
    }

    return (
      <CellRenderer
        value={value}
        row={row}
        column={column}
        rowIndex={rowIndex}
        columnIndex={stateColumns.indexOf(column)}
        isEditing={false}
        isEditable={false}
        onEdit={() => {}}
        onEditStart={() => {}}
        onEditCancel={() => {}}
        onLinkClick={onLinkClick}
        loading={false}
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* Add Row Button */}
      {inlineRowAddition && addRowButtonPosition === "top-left" && (
        <div className="flex justify-start">
          <Button
            onClick={handleAddRowClick}
            disabled={isAddingRow}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {addRowButtonLabel}
          </Button>
        </div>
      )}

      {/* Simple Toolbar */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {recordCount || processedData.length} records
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(processedData, stateColumns)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnFilters(!showColumnFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Simple Filter Row */}
      {showColumnFilters && (
        <div className="border rounded p-4 bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateColumns.filter(col => col.filterable).map(column => (
              <ColumnFilter
                key={column.key}
                column={column}
                onFilterChange={(filter) => handleColumnFilterChange(filter, column)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Plugin Toolbar */}
      <PluginRenderer plugins={plugins} gridAPI={{} as GridAPI} type="toolbar" />

      {/* Table */}
      <div className="border rounded-lg">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                {stateColumns.map((column) => (
                  <TableHead 
                    key={column.key}
                    className="relative select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.key)}
                          className="h-8 w-8 p-0"
                        >
                          {sort?.column === column.key ? (
                            sort.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
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
              {/* Add Row Form */}
              {renderAddRowForm()}
              
              {/* Data Rows */}
              {paginatedData.map((row, rowIndex) => (
                <TableRow 
                  key={row.id || rowIndex}
                  className={cn(
                    "transition-colors",
                    editingRow === rowIndex && "bg-yellow-50 border-yellow-200",
                    rowClassName?.(row, rowIndex)
                  )}
                  onDoubleClick={() => handleCellDoubleClick(rowIndex, row)}
                >
                  {stateColumns.map((column) => (
                    <TableCell key={column.key} className="p-2">
                      {renderEditableCell(row, column, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Pagination */}
      {paginationMode === 'pagination' && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}\\n            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Plugin Footer */}
      <PluginRenderer plugins={plugins} gridAPI={{} as GridAPI} type="footer" />
    </div>
  );
}
