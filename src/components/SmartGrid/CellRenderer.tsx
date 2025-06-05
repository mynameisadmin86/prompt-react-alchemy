
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { GridColumnConfig } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface CellRendererProps {
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
  loading?: boolean;
}

export const CellRenderer: React.FC<CellRendererProps> = ({
  value,
  row,
  column,
  rowIndex,
  columnIndex,
  isEditing,
  isEditable,
  onEdit,
  onEditStart,
  onEditCancel,
  loading = false
}) => {
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onEdit(rowIndex, column.key, tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onEditCancel();
      setTempValue(value);
    }
  };

  // Badge renderer with status mapping
  const renderBadge = () => {
    const statusColor = column.statusMap?.[value] || getDefaultStatusColor(value, column.key);
    return (
      <Badge className={statusColor}>
        {value}
      </Badge>
    );
  };

  // Default status color mapping based on common patterns
  const getDefaultStatusColor = (status: string, columnKey: string) => {
    if (columnKey.toLowerCase().includes('status')) {
      switch (status?.toLowerCase()) {
        case 'released':
        case 'confirmed':
        case 'approved':
        case 'active':
          return 'bg-green-50 text-green-600 border border-green-200';
        case 'under execution':
        case 'in progress':
        case 'pending':
          return 'bg-purple-50 text-purple-600 border border-purple-200';
        case 'initiated':
        case 'draft':
          return 'bg-blue-50 text-blue-600 border border-blue-200';
        case 'cancelled':
        case 'deleted':
        case 'rejected':
        case 'not eligible':
        case 'revenue leakage':
          return 'bg-red-50 text-red-600 border border-red-200';
        case 'invoice created':
        case 'bill raised':
          return 'bg-orange-50 text-orange-600 border border-orange-200';
        default:
          return 'bg-gray-50 text-gray-600 border border-gray-200';
      }
    }
    return 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  // Link renderer
  const renderLink = () => {
    return (
      <button
        onClick={() => column.onClick?.(row)}
        className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium hover:underline"
        disabled={loading}
      >
        {value}
      </button>
    );
  };

  // DateTimeRange renderer
  const renderDateTimeRange = () => {
    const [date, time] = String(value).split(' ');
    return (
      <div className="text-sm">
        <div className="text-gray-900 font-medium">{date}</div>
        <div className="text-gray-500 text-xs">{time}</div>
      </div>
    );
  };

  // TextWithTooltip renderer
  const renderTextWithTooltip = () => {
    const tooltipText = column.infoTextField ? row[column.infoTextField] : `More info about ${value}`;
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-900 font-medium">{value}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center cursor-help">
                <Info className="h-3 w-3 text-gray-600" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  // ExpandableCount renderer
  const renderExpandableCount = () => {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // This would typically open a modal or expand inline content
          if (column.renderExpandedContent) {
            console.log('Expanded content:', column.renderExpandedContent(row));
          }
        }}
        className="text-gray-900 font-medium"
        disabled={loading}
      >
        {value}
      </Button>
    );
  };

  // EditableText renderer
  const renderEditableText = () => {
    if (isEditing) {
      return (
        <Input
          value={tempValue || ''}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full"
          autoFocus
          disabled={loading}
        />
      );
    }

    if (isEditable) {
      return (
        <div
          onClick={() => onEditStart(rowIndex, column.key)}
          className={cn(
            "min-h-[20px] p-1 hover:bg-gray-50 cursor-pointer rounded",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {value}
        </div>
      );
    }

    return <span>{value}</span>;
  };

  // Dropdown renderer
  const renderDropdown = () => {
    if (isEditable && column.options) {
      return (
        <select
          value={value || ''}
          onChange={(e) => onEdit(rowIndex, column.key, e.target.value)}
          className="w-full px-2 py-1 border rounded"
          disabled={loading}
        >
          <option value="">Select...</option>
          {column.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }
    return <span>{value}</span>;
  };

  // Date renderer
  const renderDate = () => {
    if (!value) return <span>-</span>;
    
    try {
      const date = new Date(value);
      return <span>{date.toLocaleDateString()}</span>;
    } catch {
      return <span>{value}</span>;
    }
  };

  // Main renderer switch
  const renderCellContent = () => {
    switch (column.type) {
      case 'Link':
        return renderLink();
      case 'Badge':
        return renderBadge();
      case 'DateTimeRange':
        return renderDateTimeRange();
      case 'TextWithTooltip':
        return renderTextWithTooltip();
      case 'ExpandableCount':
        return renderExpandableCount();
      case 'EditableText':
        return renderEditableText();
      case 'Dropdown':
        return renderDropdown();
      case 'Date':
        return renderDate();
      case 'Text':
      default:
        return <span className="text-gray-900">{value}</span>;
    }
  };

  return (
    <div className="flex items-center">
      {renderCellContent()}
    </div>
  );
};
