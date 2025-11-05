import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SmartGrid } from './SmartGrid';
import { SmartGridProps, GridColumnConfig } from '@/types/smartgrid';

export interface NestedSmartGridProps extends Omit<SmartGridProps, 'columns' | 'data'> {
  // Parent row data
  rowData: any;
  
  // Nested data configuration
  nestedDataKey: string;
  nestedColumns: GridColumnConfig[];
  nestedTitle?: string;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
}

export const NestedSmartGrid: React.FC<NestedSmartGridProps> = ({
  rowData,
  nestedDataKey,
  nestedColumns,
  nestedTitle,
  collapsible = true,
  initiallyExpanded = false,
  ...smartGridProps
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const nestedData = rowData?.[nestedDataKey] || [];
  const hasData = Array.isArray(nestedData) && nestedData.length > 0;

  const toggleExpand = () => {
    if (collapsible) {
      setIsExpanded(prev => !prev);
    }
  };

  // If no data and collapsed, don't render anything
  if (!hasData && !isExpanded) {
    return null;
  }

  return (
    <div className="border border-border rounded-md overflow-hidden bg-background shadow-sm">
      {/* Header */}
      {(nestedTitle || collapsible) && (
        <div
          className={`flex justify-between items-center bg-muted/50 px-3 py-2 text-sm font-semibold ${
            collapsible ? 'cursor-pointer hover:bg-muted transition-colors' : ''
          }`}
          onClick={toggleExpand}
        >
          <div className="flex items-center gap-2">
            {collapsible && (
              <span className="transition-transform duration-200">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
            {nestedTitle && <span>{nestedTitle}</span>}
            {hasData && (
              <span className="text-xs text-muted-foreground ml-1">
                ({nestedData.length} {nestedData.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Nested Grid Content */}
      {(!collapsible || isExpanded) && (
        <div className="p-2">
          {hasData ? (
            <SmartGrid
              columns={nestedColumns}
              data={nestedData}
              hideToolbar={true}
              {...smartGridProps}
            />
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No nested records available
            </div>
          )}
        </div>
      )}
    </div>
  );
};
