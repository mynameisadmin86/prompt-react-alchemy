
import { useState, useCallback } from 'react';
import { SortConfig, FilterConfig } from '@/types/smartgrid';

export function useGridState() {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig | undefined>();
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [internalSelectedRows, setInternalSelectedRows] = useState<Set<number>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeHoverColumn, setResizeHoverColumn] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

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

  const handleColumnFilterChange = useCallback((filter: FilterConfig | null) => {
    if (!filter) {
      return;
    }

    setFilters(prev => {
      const existing = prev.find(f => f.column === filter.column);
      if (filter.value === '' || filter.value == null) {
        return prev.filter(f => f.column !== filter.column);
      } else if (existing) {
        return prev.map(f => f.column === filter.column ? filter : f);
      } else {
        return [...prev, filter];
      }
    });
  }, []);

  const handleClearColumnFilter = useCallback((columnKey: string) => {
    setFilters(prev => prev.filter(f => f.column !== columnKey));
  }, []);

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

  return {
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
    handleSort,
    handleColumnFilterChange,
    handleClearColumnFilter,
    toggleRowExpansion
  };
}
