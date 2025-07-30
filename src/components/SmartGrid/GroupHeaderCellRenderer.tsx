import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CellRenderer } from './CellRenderer';
import { GridColumnConfig } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface GroupHeaderCellRendererProps {
  value: any;
  row: any;
  column: GridColumnConfig;
  rowIndex: number;
  columnIndex: number;
  isEditing: boolean;
  isEditable: boolean;
  onEdit: (rowIndex: number, columnKey: string, value: any) => void;
  onEditStart: (rowIndex: number, columnKey: string) => void;
  onEditCancel: () => void;
  onLinkClick?: (rowData: any, columnKey: string) => void;
  loading?: boolean;
  // Group-specific props
  groupToggleEnabled?: boolean;
  onGroupToggle?: (groupKey: string) => void;
  groupRowStyle?: {
    backgroundColor?: string;
    fontWeight?: string;
    fontSize?: string;
    padding?: string;
  };
}

export const GroupHeaderCellRenderer: React.FC<GroupHeaderCellRendererProps> = ({
  value,
  row,
  column,
  columnIndex,
  groupToggleEnabled = true,
  onGroupToggle,
  groupRowStyle = {},
  ...props
}) => {
  // Handle group header rows
  if (row.__isGroupHeader) {
    // Only render content in the first column
    if (columnIndex === 0) {
      const isExpanded = row.__isExpanded;
      const IconComponent = isExpanded ? ChevronDown : ChevronRight;

      return (
        <div 
          className="flex items-center gap-2 cursor-pointer select-none py-1 w-full"
          onClick={() => groupToggleEnabled && onGroupToggle?.(row.__groupKey)}
        >
          {groupToggleEnabled && (
            <IconComponent className="h-4 w-4 text-gray-500" />
          )}
          <span className={cn(
            'text-gray-900',
            groupRowStyle.fontWeight === 'semibold' && 'font-semibold',
            groupRowStyle.fontSize === 'sm' && 'text-sm'
          )}>
            {row.__groupKey}
          </span>
          <Badge variant="secondary" className="ml-2">
            {row.__groupCount}
          </Badge>
        </div>
      );
    }
    // Return empty for other columns in group header
    return <span className="text-transparent">-</span>;
  }
  
  // Use default cell renderer for regular rows
  return (
    <CellRenderer
      value={value}
      row={row}
      column={column}
      columnIndex={columnIndex}
      {...props}
    />
  );
};