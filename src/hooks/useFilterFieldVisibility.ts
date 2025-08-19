import { useState, useEffect, useCallback } from 'react';
import { GridColumnConfig } from '@/types/smartgrid';

interface ExtraFilter {
  key: string;
  label: string;
  type?: 'text' | 'select' | 'date' | 'dateRange' | 'time' | 'number' | 'boolean';
  options?: string[];
}

interface SubRowFilter {
  key: string;
  label: string;
  type?: 'text' | 'select' | 'date' | 'dateRange' | 'time' | 'number' | 'boolean';
  options?: string[];
}

interface FilterFieldVisibilitySettings {
  [key: string]: boolean;
}

export function useFilterFieldVisibility(
  gridId: string,
  columns: GridColumnConfig[],
  subRowColumns: GridColumnConfig[],
  extraFilters: ExtraFilter[],
  subRowFilters: SubRowFilter[]
) {
  const [visibleFields, setVisibleFields] = useState<FilterFieldVisibilitySettings>({});
  
  const storageKey = `filter-field-visibility-${gridId}`;

  // Initialize and load from localStorage
  useEffect(() => {
    const filterableColumns = columns.filter(col => col.filterable !== false);
    const filterableSubRowColumns = subRowColumns.filter(col => col.filterable !== false);
    
    // Create default visibility settings
    const defaultFields: FilterFieldVisibilitySettings = {};
    
    // Main columns
    filterableColumns.forEach(col => {
      defaultFields[col.key] = true;
    });
    
    // Extra filters
    extraFilters.forEach(filter => {
      defaultFields[`extra-${filter.key}`] = true;
    });
    
    // Sub-row columns
    filterableSubRowColumns.forEach(col => {
      defaultFields[`subrow-${col.key}`] = true;
    });
    
    // Sub-row filters
    subRowFilters.forEach(filter => {
      defaultFields[`subrowfilter-${filter.key}`] = true;
    });

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem(storageKey);
    let mergedSettings = defaultFields;
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with defaults to handle new fields
        mergedSettings = { ...defaultFields, ...parsed };
      } catch (error) {
        console.warn('Failed to parse saved filter field visibility settings:', error);
      }
    }
    
    setVisibleFields(mergedSettings);
  }, [gridId, columns, subRowColumns, extraFilters, subRowFilters, storageKey]);

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (Object.keys(visibleFields).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(visibleFields));
    }
  }, [visibleFields, storageKey]);

  const updateFieldVisibility = useCallback((fieldKey: string, visible: boolean) => {
    setVisibleFields(prev => ({
      ...prev,
      [fieldKey]: visible
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    const filterableColumns = columns.filter(col => col.filterable !== false);
    const filterableSubRowColumns = subRowColumns.filter(col => col.filterable !== false);
    
    const defaultFields: FilterFieldVisibilitySettings = {};
    
    filterableColumns.forEach(col => {
      defaultFields[col.key] = true;
    });
    
    extraFilters.forEach(filter => {
      defaultFields[`extra-${filter.key}`] = true;
    });
    
    filterableSubRowColumns.forEach(col => {
      defaultFields[`subrow-${col.key}`] = true;
    });
    
    subRowFilters.forEach(filter => {
      defaultFields[`subrowfilter-${filter.key}`] = true;
    });
    
    setVisibleFields(defaultFields);
  }, [columns, subRowColumns, extraFilters, subRowFilters]);

  return {
    visibleFields,
    updateFieldVisibility,
    resetToDefaults
  };
}