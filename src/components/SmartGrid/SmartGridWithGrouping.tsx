import React, { useState, useMemo, useCallback } from 'react';
import { SmartGrid } from './SmartGrid';
import { SmartGridProps, GridColumnConfig, ServerFilter } from '@/types/smartgrid';
import { ServersideFilter } from './ServersideFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface GroupedData {
  groupKey: string;
  groupValue: any;
  items: any[];
  isExpanded: boolean;
}

interface SmartGridWithGroupingProps extends SmartGridProps {
  groupByField?: string;
  onGroupByChange?: (field: string | null) => void;
  groupableColumns?: string[];
  showGroupingDropdown?: boolean;
  // Server-side filter props
  serverFilters?: ServerFilter[];
  showFilterTypeDropdown?: boolean;
  showServersideFilter?: boolean;
  onToggleServersideFilter?: () => void;
  hideAdvancedFilter?: boolean;
  hideCheckboxToggle?: boolean;
  api?: any; // FilterSystemAPI
  gridId?: string;
  userId?: string;
  customPageSize?: number | any;
  // Enhanced selection props (when defaultSelectedRowIndexes is used)
  defaultSelectedRowIndexes?: number[];
  onRowSelectionChange?: (selectedRows: any[]) => void;
  selectable?: boolean;
}

export function SmartGridWithGrouping({
  data,
  columns,
  groupByField,
  onGroupByChange,
  groupableColumns,
  showGroupingDropdown = true,
  serverFilters = [],
  showFilterTypeDropdown = false,
  showServersideFilter = false,
  onToggleServersideFilter,
  hideAdvancedFilter = false,
  hideCheckboxToggle = false,
  api,
  gridId,
  userId,
  customPageSize,
  defaultSelectedRowIndexes = [],
  onRowSelectionChange,
  selectable = true,
  ...props
}: SmartGridWithGroupingProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [internalGroupBy, setInternalGroupBy] = useState<string | null>(groupByField || null);
  const [selectedRowIndexes, setSelectedRowIndexes] = useState<number[]>(defaultSelectedRowIndexes);

  // Determine which columns can be grouped
  const availableGroupColumns = useMemo(() => {
    if (groupableColumns) {
      return columns.filter(col => groupableColumns.includes(col.key));
    }
    // Show all columns by default
    return columns;
  }, [columns, groupableColumns]);

  // Group the data based on selected field
  const groupedData = useMemo<GroupedData[]>(() => {
    const currentGroupBy = internalGroupBy || groupByField;
    if (!currentGroupBy || !data.length) {
      return [];
    }

    const groups: { [key: string]: any[] } = {};
    
    data.forEach(item => {
      let groupValue = item[currentGroupBy];
      
      // Handle object values (like status objects)
      let displayValue = groupValue;
      if (typeof groupValue === 'object' && groupValue !== null) {
        displayValue = groupValue.value || groupValue.label || groupValue.name || JSON.stringify(groupValue);
      }
      
      const groupKey = String(displayValue || 'Uncategorized');
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([groupKey, items]) => ({
        groupKey,
        groupValue: groupKey,
        items,
        isExpanded: expandedGroups.has(groupKey)
      }));
  }, [data, internalGroupBy, groupByField, expandedGroups]);

  // Create modified data with group headers
  const displayData = useMemo(() => {
    const currentGroupBy = internalGroupBy || groupByField;
    if (!currentGroupBy) {
      return data;
    }

    const flattened: any[] = [];
    
    groupedData.forEach(group => {
      // Create a group header row that will be specially styled
      const icon = group.isExpanded ? '▼' : '▶';
      const fieldLabel = columns.find(c => c.key === currentGroupBy)?.label || currentGroupBy;
      const groupHeaderText = `${icon} ${fieldLabel}: ${group.groupValue} (${group.items.length} ${group.items.length === 1 ? 'item' : 'items'})`;
      
      const groupHeaderRow = {
        __isGroupHeader: true,
        __groupKey: group.groupKey,
        __groupValue: group.groupValue,
        __groupCount: group.items.length,
        __isExpanded: group.isExpanded,
        __groupHeaderText: groupHeaderText,
        __columnSpan: columns.length,
        // Set all columns to empty - the rendering will be handled specially
        ...columns.reduce((acc, col) => {
          acc[col.key] = '';
          return acc;
        }, {} as any)
      };

      flattened.push(groupHeaderRow);

      // Add group items if expanded
      if (group.isExpanded) {
        flattened.push(...group.items);
      }
    });

    return flattened;
  }, [data, groupedData, internalGroupBy, groupByField, columns]);

  const handleGroupByChange = useCallback((value: string) => {
    const newGroupBy = value === 'none' ? null : value;
    setInternalGroupBy(newGroupBy);
    onGroupByChange?.(newGroupBy);
    // Expand all groups by default when grouping changes
    if (newGroupBy && groupedData.length > 0) {
      setExpandedGroups(new Set(groupedData.map(g => g.groupKey)));
    }
  }, [onGroupByChange, groupedData]);

  const toggleGroupExpansion = useCallback((groupKey: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  }, []);

  // Initialize default selection
  React.useEffect(() => {
    if (defaultSelectedRowIndexes?.length) {
      setSelectedRowIndexes(defaultSelectedRowIndexes);
      onRowSelectionChange?.(defaultSelectedRowIndexes.map(i => data[i]));
    }
  }, [defaultSelectedRowIndexes, data, onRowSelectionChange]);

  // Handle row selection toggle
  const handleRowSelection = useCallback((rowIndex: number, rowData: any) => {
    if (!selectable || rowData.__isGroupHeader) return;

    setSelectedRowIndexes(prev => {
      const isSelected = prev.includes(rowIndex);
      const updated = isSelected 
        ? prev.filter(i => i !== rowIndex)
        : [...prev, rowIndex];
      
      onRowSelectionChange?.(updated.map(i => data[i]));
      return updated;
    });
  }, [selectable, data, onRowSelectionChange]);

  // Clear all selections
  const handleClearSelection = useCallback(() => {
    setSelectedRowIndexes([]);
    onRowSelectionChange?.([]);
  }, [onRowSelectionChange]);

  // Handle link click for group headers (using onLinkClick prop)
  const handleLinkClick = useCallback((row: any, columnKey: string, rowIndex: any) => {
    if (row.__isGroupHeader) {
      toggleGroupExpansion(row.__groupKey);
      return;
    }
    // Call original onLinkClick if provided
    if (props.onLinkClick) {
      props.onLinkClick(row, columnKey, rowIndex);
    }
  }, [toggleGroupExpansion, props]);

  // Handle row click for selection
  const handleEnhancedRowClick = useCallback((row: any, rowIndex: number) => {
    // Handle selection if enabled
    if (selectable && !row.__isGroupHeader) {
      // Find the actual data index (exclude group headers)
      let actualDataIndex = 0;
      let displayIndex = 0;
      for (let i = 0; i < displayData.length; i++) {
        if (displayData[i].__isGroupHeader) {
          displayIndex++;
          continue;
        }
        if (displayIndex === rowIndex) {
          actualDataIndex = data.findIndex(d => d === displayData[i]);
          break;
        }
        displayIndex++;
      }
      handleRowSelection(actualDataIndex, row);
    }
    
    // Call original onRowClick if provided
    if (props.onRowClick) {
      props.onRowClick(row, rowIndex);
    }
  }, [selectable, displayData, data, handleRowSelection, props]);

  // When grouping is active, override the row expansion to always collapse
  const handleRowExpansionOverride = useCallback((rowIndex: number) => {
    const currentGroupBy = internalGroupBy || groupByField;
    if (currentGroupBy) {
      // If grouping is active, force sub-rows to always remain collapsed
      // Don't call any expansion logic - just return to prevent expansion
      return;
    }
    // If no grouping, this won't be used and normal expansion will work
  }, [internalGroupBy, groupByField]);

  // Custom row class name function
  const getRowClassName = useCallback((row: any, index: number) => {
    let baseClassName = '';
    
    if (typeof props.rowClassName === 'function') {
      baseClassName = props.rowClassName(row, index);
    } else if (typeof props.rowClassName === 'string') {
      baseClassName = props.rowClassName;
    }

    if (row.__isGroupHeader) {
      return cn(
        baseClassName, 
        'bg-muted/30 hover:bg-muted/50 border-b-2 border-border cursor-pointer font-semibold'
      );
    }

    // Check if this row is selected
    if (selectable && !row.__isGroupHeader) {
      const actualDataIndex = data.findIndex(d => d === row);
      const isSelected = selectedRowIndexes.includes(actualDataIndex);
      
      if (isSelected) {
        return cn(
          baseClassName,
          'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all duration-200 ease-in-out'
        );
      }
      
      return cn(baseClassName, 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 ease-in-out');
    }

    return baseClassName;
  }, [props.rowClassName, selectable, data, selectedRowIndexes]);

  // Modify the first column to handle group header display
  const modifiedColumns = useMemo(() => {
    const currentGroupBy = internalGroupBy || groupByField;
    if (!currentGroupBy) {
      return columns;
    }

    return columns.map((col, index) => {
      if (index === 0) {
        return {
          ...col,
          // Make it a link to enable clicking
          type: 'Link' as const
        };
      }
      return col;
    });
  }, [columns, internalGroupBy, groupByField]);

  return (
    <div className="space-y-2">
      {/* Selection toolbar */}
      {selectable && selectedRowIndexes.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {selectedRowIndexes.length} row{selectedRowIndexes.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleClearSelection}
            className="px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded hover:bg-blue-50 dark:hover:bg-blue-900/60 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      )}
      
      <SmartGrid
        {...props}
        data={displayData}
        columns={modifiedColumns}
        rowClassName={getRowClassName}
        onLinkClick={handleLinkClick}
        onRowClick={handleEnhancedRowClick}
        // Override nested row renderer when grouping is active to prevent sub-row expansion
        nestedRowRenderer={
          (internalGroupBy || groupByField) ? undefined : props.nestedRowRenderer
        }
        // Override row expansion when grouping is active to force collapse
        onRowExpansionOverride={
          (internalGroupBy || groupByField) ? handleRowExpansionOverride : undefined
        }
        // Pass grouping props to toolbar
        groupByField={internalGroupBy || groupByField}
        onGroupByChange={handleGroupByChange}
        groupableColumns={groupableColumns}
        showGroupingDropdown={showGroupingDropdown}
        // Pass server-side filter props
        showServersideFilter={showServersideFilter}
        onToggleServersideFilter={onToggleServersideFilter}
        hideAdvancedFilter={hideAdvancedFilter}
        hideCheckboxToggle={hideCheckboxToggle}
        customPageSize={customPageSize}
        serverFilters={serverFilters}
        showFilterTypeDropdown={showFilterTypeDropdown}
        gridId={gridId || props.gridTitle || 'default'}
        userId={userId || 'default-user'}
        api={api}
      />
    </div>
  );
}