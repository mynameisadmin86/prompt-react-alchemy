import React, { useState } from 'react';
import { SmartGrid } from './SmartGrid';
import { SmartGridProps, GridColumnConfig } from '@/types/smartgrid';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NestedSectionConfig {
  nestedDataKey: string;
  columns: GridColumnConfig[];
  title?: string;
  initiallyExpanded?: boolean;
  showNestedRowCount?: boolean;
}

export interface SmartGridWithNestedRowsProps extends SmartGridProps {
  nestedSectionConfig?: NestedSectionConfig;
}

export function SmartGridWithNestedRows({
  nestedSectionConfig,
  ...smartGridProps
}: SmartGridWithNestedRowsProps) {
  const [expandedNestedSections, setExpandedNestedSections] = useState<Set<number>>(
    new Set(nestedSectionConfig?.initiallyExpanded ? [] : [])
  );

  const toggleNestedSection = (rowIndex: number) => {
    setExpandedNestedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  // Create a nested row renderer that includes both the original nested content
  // and the new nested section
  const enhancedNestedRowRenderer = (row: any, rowIndex: number) => {
    const originalNestedContent = smartGridProps.nestedRowRenderer?.(row, rowIndex);
    
    if (!nestedSectionConfig) {
      return originalNestedContent;
    }

    const nestedData = row[nestedSectionConfig.nestedDataKey] || [];
    const isExpanded = expandedNestedSections.has(rowIndex);
    const rowCount = Array.isArray(nestedData) ? nestedData.length : 0;

    return (
      <div className="space-y-0">
        {/* Original nested content from parent SmartGrid */}
        {originalNestedContent && (
          <div className="border-b border-gray-200">
            {originalNestedContent}
          </div>
        )}

        {/* New nested section */}
        <div className="bg-background">
          {/* Nested section header */}
          <div
            className={cn(
              "flex items-center justify-between px-4 py-2.5 cursor-pointer",
              "bg-muted/30 hover:bg-muted/50 transition-colors",
              "border-b border-border/50"
            )}
            onClick={() => toggleNestedSection(rowIndex)}
          >
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-semibold text-foreground">
                {nestedSectionConfig.title || 'Nested Data'}
              </span>
              {nestedSectionConfig.showNestedRowCount !== false && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({rowCount} {rowCount === 1 ? 'record' : 'records'})
                </span>
              )}
            </div>
          </div>

          {/* Nested grid content */}
          {isExpanded && (
            <div className="bg-background border-b border-border/30">
              {rowCount === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No nested records available
                </div>
              ) : (
                <div className="p-3">
                  <SmartGrid
                    columns={nestedSectionConfig.columns}
                    data={nestedData}
                    paginationMode="infinite"
                    hideToolbar={true}
                    customPageSize={rowCount}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Override the nestedRowRenderer if we have a nestedSectionConfig
  const finalNestedRowRenderer = nestedSectionConfig
    ? enhancedNestedRowRenderer
    : smartGridProps.nestedRowRenderer;

  // Override onRowExpansionOverride to ensure rows can expand
  const handleRowExpansion = (rowIndex: number) => {
    if (smartGridProps.onRowExpansionOverride) {
      smartGridProps.onRowExpansionOverride(rowIndex);
    }
  };

  return (
    <SmartGrid
      {...smartGridProps}
      nestedRowRenderer={finalNestedRowRenderer}
      onRowExpansionOverride={handleRowExpansion}
    />
  );
}
