import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartGridPlus } from './SmartGridPlus';
import { SmartGridPlusProps } from '@/types/smartgrid';
import { DynamicPanel } from '@/components/DynamicPanel';
import { PanelConfig } from '@/types/dynamicPanel';

export interface RowPanelConfig {
  getPanelConfig: (row: any, rowIndex: number) => PanelConfig;
  panelTitle?: (row: any, rowIndex: number) => string;
  onPanelDataChange?: (rowIndex: number, updatedData: Record<string, any>) => void;
}

export interface SmartGridPlusWithPanelsProps extends SmartGridPlusProps {
  rowPanelConfig?: RowPanelConfig;
  defaultPanelExpanded?: boolean;
}

export function SmartGridPlusWithPanels({
  rowPanelConfig,
  defaultPanelExpanded = false,
  ...smartGridProps
}: SmartGridPlusWithPanelsProps) {
  const [expandedPanels, setExpandedPanels] = useState<Set<number>>(new Set());

  const togglePanelExpansion = useCallback((rowIndex: number) => {
    setExpandedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  }, []);

  // Custom nested row renderer that shows the panel
  const customNestedRowRenderer = useCallback((row: any, rowIndex: number) => {
    if (!rowPanelConfig) return null;

    const panelConfig = rowPanelConfig.getPanelConfig(row, rowIndex);
    const panelTitle = rowPanelConfig.panelTitle 
      ? rowPanelConfig.panelTitle(row, rowIndex)
      : `Details for Row ${rowIndex + 1}`;

    return (
      <div className="p-4 bg-muted/30">
        <DynamicPanel
          panelId={`panel-row-${rowIndex}`}
          panelTitle={panelTitle}
          panelConfig={panelConfig}
          initialData={row}
          onDataChange={(updatedData) => {
            if (rowPanelConfig.onPanelDataChange) {
              rowPanelConfig.onPanelDataChange(rowIndex, updatedData);
            }
          }}
          panelWidth="full"
          collapsible={false}
          showPreview={false}
        />
      </div>
    );
  }, [rowPanelConfig]);

  // Override the nestedRowRenderer prop
  return (
    <SmartGridPlus
      {...smartGridProps}
      nestedRowRenderer={customNestedRowRenderer}
    />
  );
}
