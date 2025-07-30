import React, { useState, useMemo, useCallback } from 'react';
import { SmartGrid } from './SmartGrid';
import { SmartGridProps, GridColumnConfig } from '@/types/smartgrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GroupHeaderCellRenderer } from './GroupHeaderCellRenderer';
import { cn } from '@/lib/utils';

export interface GroupingConfig {
  enableGrouping?: boolean;
  defaultGroupByField?: string;
  userCanChangeGroupBy?: boolean;
  groupToggleEnabled?: boolean;
  preserveExpandedStateOnUpdate?: boolean;
  groupRowStyle?: {
    backgroundColor?: string;
    fontWeight?: string;
    fontSize?: string;
    padding?: string;
  };
  groupIcons?: {
    expand?: string;
    collapse?: string;
  };
  clientSideFallback?: boolean;
}

export interface SmartGridWithGroupingProps extends SmartGridProps {
  grouping?: GroupingConfig;
  groupByFields?: Array<{ value: string; label: string }>;
}

interface GroupedData {
  [key: string]: {
    items: any[];
    count: number;
    isExpanded: boolean;
  };
}

export function SmartGridWithGrouping({
  data = [],
  columns = [],
  grouping = {},
  groupByFields = [],
  ...smartGridProps
}: SmartGridWithGroupingProps) {
  const {
    enableGrouping = true,
    defaultGroupByField,
    userCanChangeGroupBy = true,
    groupToggleEnabled = true,
    preserveExpandedStateOnUpdate = true,
    groupRowStyle = {
      backgroundColor: '#f9fafb',
      fontWeight: 'semibold',
      fontSize: 'sm',
      padding: 'px-3 py-1'
    },
    groupIcons = {
      expand: 'chevron-down',
      collapse: 'chevron-right'
    },
    clientSideFallback = true
  } = grouping;

  // Auto-detect group by fields from columns if not provided
  const availableGroupByFields = useMemo(() => {
    if (groupByFields.length > 0) {
      return groupByFields;
    }
    
    // Auto-detect from columns
    return columns
      .filter(col => col.type === 'Text' || col.type === 'Badge' || col.type === 'Dropdown')
      .map(col => ({ value: col.key, label: col.label }));
  }, [groupByFields, columns]);

  const [selectedGroupBy, setSelectedGroupBy] = useState<string>(
    defaultGroupByField || availableGroupByFields[0]?.value || ''
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group data by selected field
  const groupedData = useMemo((): GroupedData => {
    if (!enableGrouping || !selectedGroupBy || !data.length) {
      return {};
    }

    const groups: GroupedData = {};
    
    data.forEach(item => {
      const groupValue = item[selectedGroupBy];
      const groupKey = String(groupValue || 'Ungrouped');
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          items: [],
          count: 0,
          isExpanded: preserveExpandedStateOnUpdate ? expandedGroups.has(groupKey) : true
        };
      }
      
      groups[groupKey].items.push(item);
      groups[groupKey].count++;
    });

    return groups;
  }, [data, selectedGroupBy, enableGrouping, expandedGroups, preserveExpandedStateOnUpdate]);

  // Flatten grouped data for rendering
  const flattenedData = useMemo(() => {
    if (!enableGrouping || !selectedGroupBy || Object.keys(groupedData).length === 0) {
      return data;
    }

    const flattened: any[] = [];
    
    Object.entries(groupedData).forEach(([groupKey, group]) => {
      // Add group header row
      flattened.push({
        __isGroupHeader: true,
        __groupKey: groupKey,
        __groupCount: group.count,
        __isExpanded: group.isExpanded,
        [selectedGroupBy]: groupKey
      });

      // Add group items if expanded
      if (group.isExpanded) {
        flattened.push(...group.items);
      }
    });

    return flattened;
  }, [groupedData, selectedGroupBy, enableGrouping, data]);

  // Toggle group expansion
  const toggleGroupExpansion = useCallback((groupKey: string) => {
    if (!groupToggleEnabled) return;
    
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  }, [groupToggleEnabled]);

  // Custom row renderer to handle group headers
  const customRowClassName = useCallback((row: any, index: number) => {
    if (row.__isGroupHeader) {
      return cn(
        'bg-gray-50 hover:bg-gray-100 border-b-2 border-gray-200',
        groupRowStyle.padding || 'px-3 py-1'
      );
    }
    
    // Apply original row className if provided
    if (smartGridProps.rowClassName) {
      return typeof smartGridProps.rowClassName === 'function' 
        ? smartGridProps.rowClassName(row, index)
        : smartGridProps.rowClassName;
    }
    
    return '';
  }, [smartGridProps.rowClassName, groupRowStyle.padding]);


  // Transform data to handle group headers through special data structure
  const transformedData = useMemo(() => {
    if (!enableGrouping || !selectedGroupBy || Object.keys(groupedData).length === 0) {
      return data;
    }

    const transformed: any[] = [];
    
    Object.entries(groupedData).forEach(([groupKey, group]) => {
      // Add group header as a special data row
      const groupHeaderRow = {
        __isGroupHeader: true,
        __groupKey: groupKey,
        __groupCount: group.count,
        __isExpanded: group.isExpanded,
        // Set the first column to display group info, others to special markers
        [columns[0]?.key || 'id']: `__GROUP_HEADER__${groupKey}__${group.count}__${group.isExpanded}`,
        ...columns.slice(1).reduce((acc, col) => ({ ...acc, [col.key]: '__GROUP_HEADER_EMPTY__' }), {})
      };
      
      transformed.push(groupHeaderRow);

      // Add group items if expanded
      if (group.isExpanded) {
        transformed.push(...group.items);
      }
    });

    return transformed;
  }, [groupedData, selectedGroupBy, enableGrouping, data, columns]);

  // Group by selector component
  const GroupBySelector = useMemo(() => {
    if (!enableGrouping || !userCanChangeGroupBy || availableGroupByFields.length === 0) {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Group by:</span>
        <Select value={selectedGroupBy} onValueChange={setSelectedGroupBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {availableGroupByFields.map(field => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }, [enableGrouping, userCanChangeGroupBy, availableGroupByFields, selectedGroupBy]);

  // If grouping is disabled, render regular SmartGrid
  if (!enableGrouping) {
    return <SmartGrid {...smartGridProps} data={data} columns={columns} />;
  }

  return (
    <div className="space-y-4">
      {/* Group by selector */}
      {GroupBySelector && (
        <div className="flex justify-end">
          {GroupBySelector}
        </div>
      )}
      
      {/* Enhanced SmartGrid with grouping */}
      <SmartGrid
        {...smartGridProps}
        data={transformedData}
        columns={columns}
        rowClassName={customRowClassName}
        nestedRowRenderer={(row, rowIndex) => {
          // Skip nested row rendering for group headers
          if (row.__isGroupHeader) {
            return null;
          }
          
          // Use original nested row renderer if provided
          return smartGridProps.nestedRowRenderer?.(row, rowIndex);
        }}
      />
    </div>
  );
}