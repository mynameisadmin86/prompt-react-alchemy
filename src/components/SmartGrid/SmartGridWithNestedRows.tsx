import React, { useState, useCallback } from 'react';
import { SmartGrid } from './SmartGrid';
import { SmartGridProps, GridColumnConfig } from '@/types/smartgrid';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export type NestedSelectionMode = 'none' | 'single' | 'multi';

export interface NestedRowSelection {
  parentRowIndex: number;
  nestedRowIndex: number;
  parentRow: any;
  nestedRow: any;
}

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
  selectionMode?: NestedSelectionMode;
  onSelectionChange?: (selectedRows: NestedRowSelection[]) => void;
  selectedRows?: NestedRowSelection[];
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

  // Internal state for selection if not controlled externally
  const [internalSelectedRows, setInternalSelectedRows] = useState<NestedRowSelection[]>([]);

  const selectionMode = nestedSectionConfig?.selectionMode ?? 'none';
  const selectedRows = nestedSectionConfig?.selectedRows ?? internalSelectedRows;
  const onSelectionChange = nestedSectionConfig?.onSelectionChange ?? setInternalSelectedRows;

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

  // Check if a nested row is selected
  const isNestedRowSelected = useCallback((parentRowIndex: number, nestedRowIndex: number) => {
    return selectedRows.some(
      (sel) => sel.parentRowIndex === parentRowIndex && sel.nestedRowIndex === nestedRowIndex
    );
  }, [selectedRows]);

  // Handle nested row selection
  const handleNestedRowSelect = useCallback((
    parentRowIndex: number,
    nestedRowIndex: number,
    parentRow: any,
    nestedRow: any
  ) => {
    if (selectionMode === 'none') return;

    const isCurrentlySelected = isNestedRowSelected(parentRowIndex, nestedRowIndex);
    const newSelection: NestedRowSelection = {
      parentRowIndex,
      nestedRowIndex,
      parentRow,
      nestedRow,
    };

    if (selectionMode === 'single') {
      // Single selection - replace all
      if (isCurrentlySelected) {
        onSelectionChange([]);
      } else {
        onSelectionChange([newSelection]);
      }
    } else if (selectionMode === 'multi') {
      // Multi selection - toggle
      if (isCurrentlySelected) {
        onSelectionChange(
          selectedRows.filter(
            (sel) => !(sel.parentRowIndex === parentRowIndex && sel.nestedRowIndex === nestedRowIndex)
          )
        );
      } else {
        onSelectionChange([...selectedRows, newSelection]);
      }
    }
  }, [selectionMode, selectedRows, onSelectionChange, isNestedRowSelected]);

  // Select all nested rows in a parent row
  const handleSelectAllNestedInParent = useCallback((
    parentRowIndex: number,
    parentRow: any,
    nestedData: any[]
  ) => {
    if (selectionMode !== 'multi') return;

    const allNestedInParent = nestedData.map((nestedRow, nestedIdx) => ({
      parentRowIndex,
      nestedRowIndex: nestedIdx,
      parentRow,
      nestedRow,
    }));

    const currentlySelectedInParent = selectedRows.filter(
      (sel) => sel.parentRowIndex === parentRowIndex
    );

    if (currentlySelectedInParent.length === nestedData.length) {
      // Deselect all in this parent
      onSelectionChange(
        selectedRows.filter((sel) => sel.parentRowIndex !== parentRowIndex)
      );
    } else {
      // Select all in this parent (add those not already selected)
      const otherSelections = selectedRows.filter(
        (sel) => sel.parentRowIndex !== parentRowIndex
      );
      onSelectionChange([...otherSelections, ...allNestedInParent]);
    }
  }, [selectionMode, selectedRows, onSelectionChange]);

  // Check if all nested rows in a parent are selected
  const areAllNestedSelected = useCallback((parentRowIndex: number, nestedCount: number) => {
    if (nestedCount === 0) return false;
    const selectedInParent = selectedRows.filter(
      (sel) => sel.parentRowIndex === parentRowIndex
    );
    return selectedInParent.length === nestedCount;
  }, [selectedRows]);

  // Check if some (but not all) nested rows in a parent are selected
  const areSomeNestedSelected = useCallback((parentRowIndex: number, nestedCount: number) => {
    const selectedInParent = selectedRows.filter(
      (sel) => sel.parentRowIndex === parentRowIndex
    );
    return selectedInParent.length > 0 && selectedInParent.length < nestedCount;
  }, [selectedRows]);

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
                  {/* Custom table for nested rows with selection */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {selectionMode !== 'none' && (
                            <th className="px-3 py-2 text-left w-10">
                              {selectionMode === 'multi' && (
                                <Checkbox
                                  checked={areAllNestedSelected(rowIndex, rowCount)}
                                  ref={(el) => {
                                    if (el) {
                                      (el as any).indeterminate = areSomeNestedSelected(rowIndex, rowCount);
                                    }
                                  }}
                                  onCheckedChange={() => handleSelectAllNestedInParent(rowIndex, row, nestedData)}
                                  aria-label="Select all nested rows"
                                />
                              )}
                            </th>
                          )}
                          {nestedSectionConfig.columns.map((col) => (
                            <th
                              key={col.key}
                              className="px-3 py-2 text-left font-medium text-muted-foreground"
                              style={{ width: col.width }}
                            >
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {nestedData.map((nestedRow: any, nestedIdx: number) => {
                          const isSelected = isNestedRowSelected(rowIndex, nestedIdx);
                          return (
                            <tr
                              key={nestedIdx}
                              className={cn(
                                "border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer",
                                isSelected && "bg-primary/10"
                              )}
                              onClick={() => handleNestedRowSelect(rowIndex, nestedIdx, row, nestedRow)}
                            >
                              {selectionMode !== 'none' && (
                                <td className="px-3 py-2 w-10">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleNestedRowSelect(rowIndex, nestedIdx, row, nestedRow)}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Select row ${nestedIdx + 1}`}
                                  />
                                </td>
                              )}
                              {nestedSectionConfig.columns.map((col) => (
                                <td
                                  key={col.key}
                                  className="px-3 py-2"
                                  style={{ width: col.width }}
                                >
                                  {col.type === 'Badge' ? (
                                    <span className={cn(
                                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                      nestedRow[col.key] === 'Completed' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                      nestedRow[col.key] === 'In Progress' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                                      nestedRow[col.key] === 'Pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    )}>
                                      {nestedRow[col.key]}
                                    </span>
                                  ) : (
                                    nestedRow[col.key]
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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
    />
  );
}
