import React, { useState, useEffect, useMemo } from 'react';
import { GridToolbar } from './GridToolbar';
import { GridTable } from './GridTable';
import { GridPagination } from './GridPagination';
import { GridColumnConfig, GridPreferences, SmartGridProps } from '@/types/smartgrid';
import { useGridPreferences } from '@/hooks/useGridPreferences';

export const SmartGrid: React.FC<SmartGridProps> = ({
  columns: initialColumns,
  data: initialData,
  editableColumns = [],
  onUpdate,
  onLinkClick,
  onSubRowToggle,
  paginationMode = 'pagination',
  nestedRowRenderer,
  selectedRows = new Set(),
  onSelectionChange,
  rowClassName,
  configurableButtons,
  showDefaultConfigurableButton,
  defaultConfigurableButtonLabel,
  title,
  totalRows
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<any[]>([]);

  const {
    preferences,
    updatePreferences,
    resetPreferences
  } = useGridPreferences(initialColumns);

  // Process columns with preferences
  const processedColumns = useMemo(() => {
    return initialColumns.map(col => ({
      ...col,
      hidden: preferences.hiddenColumns.includes(col.key),
      label: preferences.columnHeaders[col.key] || col.label,
      order: preferences.columnOrder.indexOf(col.key)
    })).sort((a, b) => {
      const aOrder = a.order === -1 ? 999 : a.order;
      const bOrder = b.order === -1 ? 999 : b.order;
      return aOrder - bOrder;
    });
  }, [initialColumns, preferences]);

  // Filter and paginate data
  const filteredData = useMemo(() => {
    let result = [...initialData];

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
        return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
      });
    });

    return result;
  }, [initialData, globalFilter, filters]);

  const paginatedData = useMemo(() => {
    if (paginationMode === 'pagination') {
      const startIndex = (currentPage - 1) * pageSize;
      return filteredData.slice(startIndex, startIndex + pageSize);
    }
    return filteredData;
  }, [filteredData, currentPage, pageSize, paginationMode]);

  const handleColumnVisibilityToggle = (columnId: string) => {
    const newHiddenColumns = preferences.hiddenColumns.includes(columnId)
      ? preferences.hiddenColumns.filter(id => id !== columnId)
      : [...preferences.hiddenColumns, columnId];
    
    updatePreferences({ hiddenColumns: newHiddenColumns });
  };

  const handleColumnHeaderChange = (columnId: string, header: string) => {
    updatePreferences({
      columnHeaders: { ...preferences.columnHeaders, [columnId]: header }
    });
  };

  const handleResetToDefaults = () => {
    resetPreferences();
    setGlobalFilter('');
    setFilters([]);
    setCurrentPage(1);
  };

  const handleExport = (format: 'csv') => {
    // Export functionality would be implemented here
    console.log('Exporting data as', format);
  };

  return (
    <div className="w-full">
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
        title={title}
        totalRows={totalRows}
      />

      <GridTable
        columns={processedColumns}
        data={paginatedData}
        showColumnFilters={showColumnFilters}
        showCheckboxes={showCheckboxes}
        viewMode={viewMode}
        editableColumns={editableColumns}
        onUpdate={onUpdate}
        onLinkClick={onLinkClick}
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
        rowClassName={rowClassName}
        nestedRowRenderer={nestedRowRenderer}
        filters={filters}
        setFilters={setFilters}
      />

      {paginationMode === 'pagination' && (
        <GridPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / pageSize)}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
};
