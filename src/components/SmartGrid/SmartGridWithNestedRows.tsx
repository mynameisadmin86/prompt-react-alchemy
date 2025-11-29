import React, { useState, useMemo } from 'react';
import { SmartGrid } from './SmartGrid';
import { SmartGridProps, GridColumnConfig } from '@/types/smartgrid';
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface NestedSectionConfig {
  nestedDataKey: string;
  columns: GridColumnConfig[];
  title?: string;
  initiallyExpanded?: boolean;
  showNestedRowCount?: boolean;
  editableColumns?: boolean | string[];
  onInlineEdit?: (parentRowIndex: number, nestedRowIndex: number, updatedRow: any) => void;
  onUpdate?: (parentRowIndex: number, nestedRowIndex: number, updatedRow: any) => Promise<void>;
  onServerUpdate?: (parentRow: any, nestedRow: any, updatedData: any) => Promise<void>;
}

export interface SmartGridWithNestedRowsProps extends SmartGridProps {
  nestedSectionConfig?: NestedSectionConfig;
}

export function SmartGridWithNestedRows({
  nestedSectionConfig,
  ...smartGridProps
}: SmartGridWithNestedRowsProps) {
  // Track collapsed sections instead of expanded ones (default to expanded)
  const [collapsedNestedSections, setCollapsedNestedSections] = useState<Set<number>>(
    new Set()
  );
  const [expandAll, setExpandAll] = useState(true);

  // Get all row indices from data
  const allRowIndices = useMemo(() => {
    return Array.from({ length: smartGridProps.data?.length || 0 }, (_, i) => i);
  }, [smartGridProps.data?.length]);

  const toggleNestedSection = (rowIndex: number) => {
    setCollapsedNestedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  const handleExpandAllToggle = (checked: boolean) => {
    setExpandAll(checked);
    if (checked) {
      // Expand all - clear the collapsed set
      setCollapsedNestedSections(new Set());
    } else {
      // Collapse all - add all row indices to collapsed set
      setCollapsedNestedSections(new Set(allRowIndices));
    }
  };

  // Create plugin for expand/collapse toggle
  const expandCollapsePlugin = useMemo(() => {
    if (!nestedSectionConfig) return undefined;
    
    return {
      id: 'expand-collapse-nested-rows',
      name: 'Expand/Collapse Nested Rows',
      toolbar: () => (
        <div className="flex items-center gap-2">
          {expandAll ? (
            <ChevronsDownUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          )}
          <Label htmlFor="expand-toggle" className="text-sm text-muted-foreground">
            {expandAll ? 'Collapse All' : 'Expand All'}
          </Label>
          <Switch
            id="expand-toggle"
            checked={expandAll}
            onCheckedChange={handleExpandAllToggle}
          />
        </div>
      ),
    };
  }, [nestedSectionConfig, expandAll, handleExpandAllToggle]);

  // Combine existing plugins with expand/collapse plugin
  const finalPlugins = useMemo(() => {
    const plugins = smartGridProps.plugins || [];
    return expandCollapsePlugin ? [...plugins, expandCollapsePlugin] : plugins;
  }, [smartGridProps.plugins, expandCollapsePlugin]);

  // Create a nested row renderer that includes both the original nested content
  // (sub-row columns) and the new nested section (nested array data)
  const enhancedNestedRowRenderer = (row: any, rowIndex: number) => {
    // Get the original nested content (sub-row columns functionality)
    const originalNestedContent = smartGridProps.nestedRowRenderer?.(row, rowIndex);
    
    // If no nested section config, just return original content
    if (!nestedSectionConfig) {
      return originalNestedContent;
    }

    const nestedData = row[nestedSectionConfig.nestedDataKey] || [];
    const isExpanded = !collapsedNestedSections.has(rowIndex); // Expanded by default
    const rowCount = Array.isArray(nestedData) ? nestedData.length : 0;

    return (
      <div className="space-y-0">
        {/* Original nested content from parent SmartGrid (sub-row columns) */}
        {originalNestedContent && (
          <div className="border-b border-border/30">
            {originalNestedContent}
          </div>
        )}

        {/* New nested section for array data */}
        <div className="bg-background">
          {/* Nested section header */}
          <div
            style={{ display: 'none' }}
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
                    editableColumns={nestedSectionConfig.editableColumns}
                    onInlineEdit={nestedSectionConfig.onInlineEdit 
                      ? async (nestedRowIndex, updatedRow) => {
                          nestedSectionConfig.onInlineEdit!(rowIndex, nestedRowIndex, updatedRow);
                          // Trigger server callback if provided
                          if (nestedSectionConfig.onServerUpdate) {
                            await nestedSectionConfig.onServerUpdate(row, nestedData[nestedRowIndex], updatedRow);
                          }
                        }
                      : undefined}
                    onUpdate={nestedSectionConfig.onUpdate
                      ? (updatedRow) => nestedSectionConfig.onUpdate!(rowIndex, nestedData.findIndex((item: any) => item === updatedRow), updatedRow)
                      : undefined}
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

  return (
    <SmartGrid
      {...smartGridProps}
      nestedRowRenderer={finalNestedRowRenderer}
      plugins={finalPlugins}
    />
  );
}
