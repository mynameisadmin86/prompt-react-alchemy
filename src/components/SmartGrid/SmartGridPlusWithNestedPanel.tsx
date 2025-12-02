import React, { useState, useCallback, useRef } from 'react';
import { SmartGridPlus } from './SmartGridPlus';
import { SmartGridPlusProps } from '@/types/smartgrid';
import { DynamicPanel, DynamicPanelRef } from '@/components/DynamicPanel/DynamicPanel';
import { PanelConfig } from '@/types/dynamicPanel';

export interface NestedPanelConfig {
  nestedDataKey?: string; // Key in row data that contains nested panel data
  panelTitle?: string | ((row: any) => string); // Title for the panel (can be function)
  panelConfig: PanelConfig | ((row: any, rowIndex: number) => PanelConfig); // Panel configuration
  onPanelDataChange?: (updatedData: Record<string, any>, rowIndex: number, originalRow: any) => void;
  getUserPanelConfig?: (userId: string, panelId: string) => Promise<any> | any;
  saveUserPanelConfig?: (userId: string, panelId: string, settings: any) => Promise<void> | void;
  userId?: string;
  panelWidth?: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  collapsible?: boolean;
}

export interface SmartGridPlusWithNestedPanelProps extends SmartGridPlusProps {
  nestedPanelConfig?: NestedPanelConfig;
}

/**
 * SmartGridPlusWithNestedPanel
 * 
 * Enhanced grid component that extends SmartGridPlus with nested dynamic panel capabilities.
 * Each row can be expanded to show a configurable dynamic panel with form fields.
 * 
 * Features:
 * - All SmartGridPlus features (inline editing, row addition, validation)
 * - Expandable rows with nested dynamic panels
 * - Configurable panel fields per row
 * - Panel data synchronization with grid
 */
export function SmartGridPlusWithNestedPanel({
  nestedPanelConfig,
  ...smartGridProps
}: SmartGridPlusWithNestedPanelProps) {
  const [expandedPanelRows, setExpandedPanelRows] = useState<Set<number>>(new Set());
  const panelRefs = useRef<Map<number, DynamicPanelRef>>(new Map());

  // Enhanced nested row renderer with dynamic panel
  const enhancedNestedRowRenderer = useCallback((row: any, rowIndex: number) => {
    if (!nestedPanelConfig) {
      // If no nested panel config, use original nested renderer
      return smartGridProps.nestedRowRenderer ? smartGridProps.nestedRowRenderer(row, rowIndex) : null;
    }

    // Get panel configuration (can be static or dynamic based on row)
    const panelConfigForRow = typeof nestedPanelConfig.panelConfig === 'function'
      ? nestedPanelConfig.panelConfig(row, rowIndex)
      : nestedPanelConfig.panelConfig;

    // Get panel title (can be static or dynamic based on row)
    const panelTitle = typeof nestedPanelConfig.panelTitle === 'function'
      ? nestedPanelConfig.panelTitle(row)
      : nestedPanelConfig.panelTitle || `Details for Row ${rowIndex + 1}`;

    // Get initial data for panel (from nested data key or entire row)
    const initialData = nestedPanelConfig.nestedDataKey
      ? row[nestedPanelConfig.nestedDataKey] || {}
      : row;

    // Handle panel data changes
    const handlePanelDataChange = (updatedData: Record<string, any>) => {
      if (nestedPanelConfig.onPanelDataChange) {
        nestedPanelConfig.onPanelDataChange(updatedData, rowIndex, row);
      }
    };

    return (
      <div className="p-4 bg-muted/30 border-t">
        <DynamicPanel
          ref={(ref) => {
            if (ref) {
              panelRefs.current.set(rowIndex, ref);
            } else {
              panelRefs.current.delete(rowIndex);
            }
          }}
          panelId={`nested-panel-${rowIndex}`}
          panelTitle={panelTitle}
          panelConfig={panelConfigForRow}
          initialData={initialData}
          onDataChange={handlePanelDataChange}
          getUserPanelConfig={nestedPanelConfig.getUserPanelConfig}
          saveUserPanelConfig={nestedPanelConfig.saveUserPanelConfig}
          userId={nestedPanelConfig.userId}
          panelWidth={nestedPanelConfig.panelWidth || 'full'}
          collapsible={nestedPanelConfig.collapsible}
          showPreview={false}
          className="shadow-none border-0"
        />
      </div>
    );
  }, [nestedPanelConfig, smartGridProps.nestedRowRenderer]);

  // Get panel form values for a specific row
  const getPanelValues = useCallback((rowIndex: number) => {
    const panelRef = panelRefs.current.get(rowIndex);
    if (panelRef) {
      return panelRef.getFormValues();
    }
    return null;
  }, []);

  // Validate panel for a specific row
  const validatePanel = useCallback((rowIndex: number) => {
    const panelRef = panelRefs.current.get(rowIndex);
    if (panelRef) {
      return panelRef.doValidation();
    }
    return { isValid: true, errors: {}, mandatoryFieldsEmpty: [] };
  }, []);

  return (
    <SmartGridPlus
      {...smartGridProps}
      nestedRowRenderer={enhancedNestedRowRenderer}
    />
  );
}

// Export helper functions for external use
export const createNestedPanelHelpers = (panelRefs: React.MutableRefObject<Map<number, DynamicPanelRef>>) => ({
  getPanelValues: (rowIndex: number) => {
    const panelRef = panelRefs.current.get(rowIndex);
    return panelRef ? panelRef.getFormValues() : null;
  },
  validatePanel: (rowIndex: number) => {
    const panelRef = panelRefs.current.get(rowIndex);
    return panelRef ? panelRef.doValidation() : { isValid: true, errors: {}, mandatoryFieldsEmpty: [] };
  },
  validateAllPanels: () => {
    const results: Record<number, any> = {};
    panelRefs.current.forEach((ref, rowIndex) => {
      results[rowIndex] = ref.doValidation();
    });
    return results;
  }
});
