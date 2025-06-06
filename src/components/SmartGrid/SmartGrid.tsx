import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Filter, 
  Search, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  Edit2, 
  GripVertical,
  CheckSquare,
  Grid2x2,
  List,
} from 'lucide-react';
import { SmartGridProps, GridColumnConfig, SortConfig, FilterConfig, GridAPI } from '@/types/smartgrid';
import { exportToCSV } from '@/utils/gridExport';
import { useToast } from '@/hooks/use-toast';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import { CellRenderer } from './CellRenderer';
import { cn } from '@/lib/utils';
import { ColumnVisibilityManager } from './ColumnVisibilityManager';
import { CommonFilter } from './CommonFilter';

export function SmartGrid({
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
  paginationMode = 'pagination',
  nestedRowRenderer,
  plugins = []
}: SmartGridProps) {
  const [gridData, setGridData] = useState(data);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig | undefined>();
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeHoverColumn, setResizeHoverColumn] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);
  
  const { toast } = useToast();

  // Convert GridColumnConfig to Column format for useGridPreferences
  const preferencesColumns = useMemo(() => columns.map(col => ({
    id: col.key,
    header: col.label,
    accessor: col.key,
    mandatory: col.mandatory
  })), [columns]);

  // Initialize preferences hook with proper async handling
  const {
    preferences,
    updateColumnOrder,
    toggleColumnVisibility,
    updateColumnHeader,
    savePreferences
  } = useGridPreferences(
    preferencesColumns,
    true, // persistPreferences
    'smartgrid-preferences',
    onPreferenceSave ? async (preferences) => {
      try {
        await Promise.resolve(onPreferenceSave(preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
        setError('Failed to save preferences');
      }
    } : undefined
  );

  // Calculate responsive column widths based on content type and available space
  const calculateColumnWidths = useCallback((visibleColumns: GridColumnConfig[]) => {
    const containerWidth = window.innerWidth - 64; // Account for padding
    const checkboxWidth = showCheckboxes ? 50 : 0;
    const actionsWidth = plugins.some(plugin => plugin.rowActions) ? 100 : 0;
    const availableWidth = containerWidth - checkboxWidth - actionsWidth;
    
    const totalColumns = visibleColumns.length;
    let remainingWidth = availableWidth;
    const calculatedWidths: Record<string, number> = {};
    
    // First pass: assign minimum widths based on content type with extra space for headers
    visibleColumns.forEach(col => {
      let minWidth = 120; // Increased minimum width for header content
      
      switch (col.type) {
        case 'Badge':
          minWidth = 100;
          break;
        case 'Date':
          minWidth = 140;
          break;
        case 'DateTimeRange':
          minWidth = 200;
          break;
        case 'Link':
          minWidth = 150;
          break;
        case 'ExpandableCount':
          minWidth = 90;
          break;
        case 'Text':
        case 'EditableText':
        default:
          minWidth = 120;
          break;
      }
      
      // Use stored preference, custom width, or calculated minimum
      const customWidth = columnWidths[col.key];
      const preferredWidth = preferences.columnWidths[col.key];
      calculatedWidths[col.key] = customWidth || (preferredWidth ? Math.max(minWidth, preferredWidth) : minWidth);
      remainingWidth -= calculatedWidths[col.key];
    });
    
    // Second pass: distribute remaining width proportionally
    if (remainingWidth > 0) {
      const totalCurrentWidth = Object.values(calculatedWidths).reduce((sum, width) => sum + width, 0);
      visibleColumns.forEach(col => {
        const proportion = calculatedWidths[col.key] / totalCurrentWidth;
        calculatedWidths[col.key] += remainingWidth * proportion;
      });
    }
    
    return calculatedWidths;
  }, [preferences.columnWidths, showCheckboxes, plugins, columnWidths]);

  // Apply preferences to get ordered and visible columns with responsive widths
  const orderedColumns = useMemo(() => {
    const columnMap = new Map(columns.map(col => [col.key, col]));
    
    const visibleColumns = preferences.columnOrder
      .map(id => columnMap.get(id))
      .filter((col): col is GridColumnConfig => col !== undefined)
      .filter(col => !preferences.hiddenColumns.includes(col.key));
    
    const calculatedWidths = calculateColumnWidths(visibleColumns);
    
    return visibleColumns.map(col => ({
      ...col,
      label: preferences.columnHeaders[col.key] || col.label,
      hidden: preferences.hiddenColumns.includes(col.key),
      width: calculatedWidths[col.key] || 100
    }));
  }, [columns, preferences, calculateColumnWidths]);

  // Process data with sorting and filtering (only if not using lazy loading)
  const processedData = useMemo(() => {
    if (onDataFetch) {
      // For lazy loading, return data as-is (sorting/filtering handled server-side)
      return gridData;
    }

    let result = [...gridData];

    // Apply global filter
    if (globalFilter) {
      result = result.filter(row =>
        orderedColumns.some(col => {
          const value = row[col.key];
          return String(value || '').toLowerCase().includes(globalFilter.toLowerCase());
        })
      );
    }

    // Apply column filters
    if (filters.length > 0) {
      result = result.filter(row => {
        return filters.every(filter => {
          const value = row[filter.column];
          const filterValue = filter.value;
          const operator = filter.operator || 'contains';

          if (value == null) return false;

          const stringValue = String(value).toLowerCase();
          const stringFilter = String(filterValue).toLowerCase();

          switch (operator) {
            case 'equals':
              return stringValue === stringFilter;
            case 'contains':
              return stringValue.includes(stringFilter);
            case 'startsWith':
              return stringValue.startsWith(stringFilter);
            case 'endsWith':
              return stringValue.endsWith(stringFilter);
            case 'gt':
              return Number(value) > Number(filterValue);
            case 'lt':
              return Number(value) < Number(filterValue);
            case 'gte':
              return Number(value) >= Number(filterValue);
            case 'lte':
              return Number(value) <= Number(filterValue);
            default:
              return true;
          }
        });
      });
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
  }, [gridData, globalFilter, filters, sort, orderedColumns, onDataFetch]);

  // Define handleExport and handleResetPreferences after processedData and orderedColumns
  const handleExport = useCallback((format: 'csv') => {
    const filename = `export-${new Date().toISOString().split('T')[0]}.${format}`;
    exportToCSV(processedData, orderedColumns, filename);
  }, [processedData, orderedColumns]);

  const handleResetPreferences = useCallback(async () => {
    const defaultPreferences = {
      columnOrder: columns.map(col => col.key),
      hiddenColumns: [],
      columnWidths: {},
      columnHeaders: {},
      filters: []
    };
    
    try {
      await savePreferences(defaultPreferences);
      setSort(undefined);
      setFilters([]);
      setGlobalFilter('');
      setColumnWidths({});
      
      toast({
        title: "Success",
        description: "Column preferences have been reset to defaults"
      });
    } catch (error) {
      setError('Failed to reset preferences');
      toast({
        title: "Error",
        description: "Failed to reset preferences",
        variant: "destructive"
      });
    }
  }, [columns, savePreferences, toast]);

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    setSort(prev => {
      if (prev?.column === columnKey) {
        return prev.direction === 'asc' 
          ? { column: columnKey, direction: 'desc' }
          : undefined;
      }
      return { column: columnKey, direction: 'asc' };
    });
  }, []);

  // Handle column resizing
  const handleResizeStart = useCallback((e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const currentColumn = orderedColumns.find(col => col.key === columnKey);
    const startWidth = currentColumn?.width || 100;
    
    setResizingColumn(columnKey);
    resizeStartRef.current = { x: startX, width: startWidth };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;
      
      const deltaX = e.clientX - resizeStartRef.current.x;
      const newWidth = Math.max(80, resizeStartRef.current.width + deltaX);
      
      setColumnWidths(prev => ({
        ...prev,
        [columnKey]: newWidth
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      setResizeHoverColumn(null);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [orderedColumns]);

  // Create Grid API for plugins
  const gridAPI: GridAPI = useMemo(() => ({
    data: gridData,
    filteredData: processedData,
    selectedRows: Array.from(selectedRows).map(index => processedData[index]).filter(Boolean),
    columns: orderedColumns,
    preferences,
    actions: {
      exportData: handleExport,
      resetPreferences: handleResetPreferences,
      toggleRowSelection: (rowIndex: number) => {
        setSelectedRows(prev => {
          const newSet = new Set(prev);
          if (newSet.has(rowIndex)) {
            newSet.delete(rowIndex);
          } else {
            newSet.add(rowIndex);
          }
          return newSet;
        });
      },
      selectAllRows: () => {
        setSelectedRows(new Set(Array.from({ length: processedData.length }, (_, i) => i)));
      },
      clearSelection: () => {
        setSelectedRows(new Set());
      }
    }
  }), [gridData, processedData, selectedRows, orderedColumns, preferences, handleExport, handleResetPreferences]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (paginationMode !== 'pagination' || onDataFetch) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, paginationMode, currentPage, pageSize, onDataFetch]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Handle header editing
  const handleHeaderEdit = useCallback((columnKey: string, newHeader: string) => {
    if (resizingColumn) return;
    
    if (newHeader.trim() && newHeader !== preferences.columnHeaders[columnKey]) {
      updateColumnHeader(columnKey, newHeader.trim());
      toast({
        title: "Success",
        description: "Column header updated"
      });
    }
    setEditingHeader(null);
  }, [updateColumnHeader, preferences.columnHeaders, toast, resizingColumn]);

  const handleHeaderClick = useCallback((columnKey: string) => {
    if (resizingColumn) return;
    setEditingHeader(columnKey);
  }, [resizingColumn]);

  // Handle drag and drop for column reordering
  const handleColumnDragStart = useCallback((e: React.DragEvent, columnKey: string) => {
    if (editingHeader || resizingColumn) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnKey);
  }, [editingHeader, resizingColumn]);

  const handleColumnDragOver = useCallback((e: React.DragEvent, targetColumnKey: string) => {
    if (resizingColumn) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    if (draggedColumn && draggedColumn !== targetColumnKey) {
      setDragOverColumn(targetColumnKey);
      e.dataTransfer.dropEffect = 'move';
    }
  }, [draggedColumn, resizingColumn]);

  const handleColumnDragLeave = useCallback((e: React.DragEvent) => {
    if (resizingColumn) return;
    
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  }, [resizingColumn]);

  const handleColumnDrop = useCallback((e: React.DragEvent, targetColumnKey: string) => {
    if (resizingColumn) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const newOrder = [...preferences.columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnKey);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    updateColumnOrder(newOrder);
    setDraggedColumn(null);
    setDragOverColumn(null);
    
    toast({
      title: "Success",
      description: "Column order updated"
    });
  }, [draggedColumn, preferences.columnOrder, updateColumnOrder, toast, resizingColumn]);

  const handleColumnDragEnd = useCallback(() => {
    if (resizingColumn) return;
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, [resizingColumn]);

  // Toggle row expansion
  const toggleRowExpansion = useCallback((rowIndex: number) => {
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

  // Determine if a column is editable
  const isColumnEditable = useCallback((column: GridColumnConfig, columnIndex: number) => {
    if (columnIndex === 0) return false;
    
    if (Array.isArray(editableColumns)) {
      return editableColumns.includes(column.key);
    }
    
    return editableColumns && column.editable;
  }, [editableColumns]);

  // Cell editing functions
  const handleCellEdit = useCallback(async (rowIndex: number, columnKey: string, value: any) => {
    const actualRowIndex = onDataFetch ? rowIndex : (currentPage - 1) * pageSize + rowIndex;
    const updatedData = [...gridData];
    const originalRow = updatedData[actualRowIndex];
    const updatedRow = { ...originalRow, [columnKey]: value };
    
    updatedData[actualRowIndex] = updatedRow;
    setGridData(updatedData);
    setEditingCell(null);
    
    if (onUpdate) {
      setLoading(true);
      setError(null);
      try {
        await onUpdate(updatedRow);
        toast({
          title: "Success",
          description: "Row updated successfully"
        });
      } catch (err) {
        updatedData[actualRowIndex] = originalRow;
        setGridData(updatedData);
        setError('Failed to update row');
        toast({
          title: "Error",
          description: "Failed to update row",
          variant: "destructive"
        });
        console.error('Update error:', err);
      } finally {
        setLoading(false);
      }
    } else if (onInlineEdit) {
      onInlineEdit(actualRowIndex, updatedRow);
    }
  }, [gridData, currentPage, pageSize, onInlineEdit, onUpdate, onDataFetch, toast]);

  const handleEditStart = useCallback((rowIndex: number, columnKey: string) => {
    setEditingCell({ rowIndex, columnKey });
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  const renderCell = useCallback((row: any, column: GridColumnConfig, rowIndex: number, columnIndex: number) => {
    const value = row[column.key];
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
    const isEditable = isColumnEditable(column, columnIndex);

    if (columnIndex === 0 && nestedRowRenderer) {
      const isExpanded = expandedRows.has(rowIndex);
      return (
        <div className="flex items-center space-x-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleRowExpansion(rowIndex)}
            className="h-5 w-5 p-0 hover:bg-gray-100 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
          <div className="flex-1 min-w-0 truncate">
            <CellRenderer
              value={value}
              row={row}
              column={column}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              isEditing={isEditing}
              isEditable={isEditable}
              onEdit={handleCellEdit}
              onEditStart={handleEditStart}
              onEditCancel={handleEditCancel}
              onLinkClick={onLinkClick}
              loading={loading}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-w-0 truncate">
        <CellRenderer
          value={value}
          row={row}
          column={column}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          isEditing={isEditing}
          isEditable={isEditable}
          onEdit={handleCellEdit}
          onEditStart={handleEditStart}
          onEditCancel={handleEditCancel}
          onLinkClick={onLinkClick}
          loading={loading}
        />
      </div>
    );
  }, [editingCell, isColumnEditable, nestedRowRenderer, expandedRows, toggleRowExpansion, handleCellEdit, handleEditStart, handleEditCancel, onLinkClick, loading]);

  // Update grid data when prop data changes (only if not using lazy loading)
  useEffect(() => {
    if (!onDataFetch) {
      setGridData(data);
    }
  }, [data, onDataFetch]);

  // Fixed renderPluginToolbarItems function to prevent React Fragment errors
  const renderPluginToolbarItems = useCallback(() => {
    return plugins
      .filter(plugin => plugin.toolbar)
      .map(plugin => (
        <React.Fragment key={`toolbar-${plugin.id}`}>
          {plugin.toolbar!(gridAPI)}
        </React.Fragment>
      ));
  }, [plugins, gridAPI]);

  // Fixed renderPluginRowActions function to prevent React Fragment errors
  const renderPluginRowActions = useCallback((row: any, rowIndex: number) => {
    return plugins
      .filter(plugin => plugin.rowActions)
      .map(plugin => (
        <React.Fragment key={`row-action-${plugin.id}-${rowIndex}`}>
          {plugin.rowActions!(row, rowIndex, gridAPI)}
        </React.Fragment>
      ));
  }, [plugins, gridAPI]);

  // Fixed renderPluginFooterItems function to prevent React Fragment errors
  const renderPluginFooterItems = useCallback(() => {
    return plugins
      .filter(plugin => plugin.footer)
      .map(plugin => (
        <React.Fragment key={`footer-${plugin.id}`}>
          {plugin.footer!(gridAPI)}
        </React.Fragment>
      ));
  }, [plugins, gridAPI]);

  // Initialize plugins
  useEffect(() => {
    plugins.forEach(plugin => {
      if (plugin.init) {
        plugin.init(gridAPI);
      }
    });

    return () => {
      plugins.forEach(plugin => {
        if (plugin.destroy) {
          plugin.destroy();
        }
      });
    };
  }, [plugins, gridAPI]);

  // Error boundary component
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => setError(null)}
          className="text-red-700 border-red-300 hover:bg-red-100"
        >
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center space-x-2">
          {/* Show active filters count */}
          {filters.length > 0 && (
            <div className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {filters.length} filter{filters.length > 1 ? 's' : ''} active
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Search box - first */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 w-full"
              disabled={loading}
            />
          </div>

          {/* Common Filter Button */}
          <CommonFilter
            columns={orderedColumns}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Toggle Checkboxes Button - Updated with blue selection state */}
          <Button 
            variant={showCheckboxes ? "default" : "outline"}
            size="sm" 
            onClick={() => setShowCheckboxes(!showCheckboxes)}
            disabled={loading}
            title="Toggle Checkboxes"
            className={cn(
              "transition-colors",
              showCheckboxes && "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            )}
          >
            <CheckSquare className="h-4 w-4" />
          </Button>

          {/* Toggle View Mode Button - Updated with better visual states */}
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            disabled={loading}
            title={`Switch to ${viewMode === 'table' ? 'Card' : 'Table'} View`}
            className={cn(
              "transition-colors",
              viewMode === 'card' && "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            )}
          >
            {viewMode === 'table' ? (
              <Grid2x2 className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>

          {/* Column Visibility Manager */}
          <ColumnVisibilityManager
            columns={columns}
            preferences={preferences}
            onColumnVisibilityToggle={toggleColumnVisibility}
            onResetToDefaults={handleResetPreferences}
          />

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetPreferences} 
            disabled={loading}
            title="Reset All"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExport('csv')} 
            disabled={loading}
            title="Download CSV"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table Container with no horizontal scroll */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="w-full">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-20 bg-white shadow-sm border-b-2 border-gray-100">
              <TableRow className="hover:bg-transparent">
                {/* Checkbox header */}
                {showCheckboxes && (
                  <TableHead className="bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-900 px-3 py-3 border-r border-gray-100 w-[50px] flex-shrink-0">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(new Set(Array.from({ length: paginatedData.length }, (_, i) => i)));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    />
                  </TableHead>
                )}
                {orderedColumns.map((column, index) => {
                  const shouldHideIcons = resizeHoverColumn === column.key || resizingColumn === column.key;
                  return (
                    <TableHead 
                      key={column.key}
                      className={cn(
                        "relative group bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-900 px-2 py-3 border-r border-gray-100 last:border-r-0",
                        draggedColumn === column.key && "opacity-50",
                        dragOverColumn === column.key && "bg-blue-100 border-blue-300",
                        resizingColumn === column.key && "bg-blue-50",
                        !resizingColumn && "cursor-move"
                      )}
                      style={{ width: `${column.width}px`, minWidth: `${Math.max(120, column.width)}px` }}
                      draggable={!editingHeader && !resizingColumn}
                      onDragStart={(e) => handleColumnDragStart(e, column.key)}
                      onDragOver={(e) => handleColumnDragOver(e, column.key)}
                      onDragLeave={handleColumnDragLeave}
                      onDrop={(e) => handleColumnDrop(e, column.key)}
                      onDragEnd={handleColumnDragEnd}
                    >
                      <div className="flex items-center justify-between gap-1 min-w-0">
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          {!shouldHideIcons && (
                            <GripVertical className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          )}
                          {editingHeader === column.key ? (
                            <Input
                              defaultValue={column.label}
                              onBlur={(e) => handleHeaderEdit(column.key, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleHeaderEdit(column.key, e.currentTarget.value);
                                } else if (e.key === 'Escape') {
                                  setEditingHeader(null);
                                }
                              }}
                              className="h-5 px-1 text-sm font-semibold bg-white border-blue-300 focus:border-blue-500 min-w-0"
                              autoFocus
                              onFocus={(e) => e.target.select()}
                              onClick={(e) => e.stopPropagation()}
                              onDragStart={(e) => e.preventDefault()}
                            />
                          ) : (
                            <div 
                              className={cn(
                                "flex items-center gap-1 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors group/header flex-1 min-w-0",
                                !resizingColumn && "cursor-pointer hover:bg-gray-100/50"
                              )}
                              onClick={(e) => {
                                if (resizingColumn) return;
                                e.stopPropagation();
                                handleHeaderClick(column.key);
                              }}
                              onDragStart={(e) => e.preventDefault()}
                            >
                              <span 
                                className="select-none text-sm font-semibold flex-1 min-w-0" 
                                style={{ 
                                  whiteSpace: 'nowrap',
                                  overflow: 'visible',
                                  textOverflow: 'clip'
                                }}
                                title={column.label}
                              >
                                {column.label}
                              </span>
                              {column.editable && !shouldHideIcons && (
                                <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover/header:opacity-100 transition-opacity flex-shrink-0" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        {column.sortable && !shouldHideIcons && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              if (resizingColumn) return;
                              e.stopPropagation();
                              handleSort(column.key);
                            }}
                            className="h-5 w-5 p-0 hover:bg-transparent transition-opacity flex-shrink-0 ml-1"
                            disabled={loading || !!resizingColumn}
                            onDragStart={(e) => e.preventDefault()}
                          >
                            {sort?.column === column.key ? (
                              sort.direction === 'asc' ? (
                                <ArrowUp className="h-3 w-3 text-blue-600" />
                              ) : (
                                <ArrowDown className="h-3 w-3 text-blue-600" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </Button>
                        )}
                      </div>
                      
                      {/* Resize Handle - Modified to only show on hover */}
                      <div
                        className="absolute top-0 right-0 w-2 h-full cursor-col-resize bg-transparent hover:bg-blue-300/50 transition-colors flex items-center justify-center group/resize z-30"
                        onMouseDown={(e) => handleResizeStart(e, column.key)}
                        onMouseEnter={() => setResizeHoverColumn(column.key)}
                        onMouseLeave={() => setResizeHoverColumn(null)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDragStart={(e) => e.preventDefault()}
                      >
                        <div className="w-0.5 h-4 bg-gray-300 opacity-0 group-hover/resize:opacity-100 transition-opacity" />
                      </div>
                    </TableHead>
                  );
                })}
                {/* Plugin row actions header */}
                {plugins.some(plugin => plugin.rowActions) && (
                  <TableHead className="bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-900 px-3 py-3 text-center w-[100px] flex-shrink-0">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell 
                    colSpan={orderedColumns.length + (showCheckboxes ? 1 : 0) + (plugins.some(plugin => plugin.rowActions) ? 1 : 0)} 
                    className="text-center py-12"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={orderedColumns.length + (showCheckboxes ? 1 : 0) + (plugins.some(plugin => plugin.rowActions) ? 1 : 0)} 
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="space-y-2">
                      <div className="text-lg font-medium">No data available</div>
                      <div className="text-sm">Try adjusting your search or filters</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <TableRow className="hover:bg-gray-50/50 transition-colors duration-150 border-b border-gray-100">
                      {/* Checkbox cell */}
                      {showCheckboxes && (
                        <TableCell className="px-3 py-3 border-r border-gray-50 w-[50px]">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={selectedRows.has(rowIndex)}
                            onChange={() => {
                              setSelectedRows(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(rowIndex)) {
                                  newSet.delete(rowIndex);
                                } else {
                                  newSet.add(rowIndex);
                                }
                                return newSet;
                              });
                            }}
                          />
                        </TableCell>
                      )}
                      {orderedColumns.map((column, columnIndex) => (
                        <TableCell 
                          key={column.key} 
                          className="relative px-3 py-3 border-r border-gray-50 last:border-r-0 align-top overflow-hidden"
                          style={{ width: `${column.width}px` }}
                        >
                          {renderCell(row, column, rowIndex, columnIndex)}
                        </TableCell>
                      ))}
                      {/* Plugin row actions */}
                      {plugins.some(plugin => plugin.rowActions) && (
                        <TableCell className="px-3 py-3 text-center align-top w-[100px]">
                          <div className="flex items-center justify-center space-x-1">
                            {renderPluginRowActions(row, rowIndex)}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                    {/* Nested row content */}
                    {nestedRowRenderer && expandedRows.has(rowIndex) && (
                      <TableRow className="bg-gray-50/30">
                        <TableCell 
                          colSpan={orderedColumns.length + (showCheckboxes ? 1 : 0) + (plugins.some(plugin => plugin.rowActions) ? 1 : 0)} 
                          className="p-0 border-b border-gray-200"
                        >
                          <div className="bg-gradient-to-r from-gray-50/50 to-white border-l-4 border-blue-500">
                            <div className="p-6 pl-12">
                              {nestedRowRenderer(row)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {paginationMode === 'pagination' && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of{' '}
            {processedData.length} entries
          </div>
          
          <Pagination className="order-1 sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={cn(
                    currentPage === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'
                  )}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className={cn(
                        "cursor-pointer transition-colors duration-150",
                        loading && "pointer-events-none opacity-50",
                        currentPage === pageNum && "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={cn(
                    currentPage === totalPages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Plugin footer items */}
      {plugins.some(plugin => plugin.footer) && (
        <div className="flex items-center justify-center space-x-4 pt-4 border-t bg-white p-4 rounded-lg border shadow-sm">
          {renderPluginFooterItems()}
        </div>
      )}
    </div>
  );
}
