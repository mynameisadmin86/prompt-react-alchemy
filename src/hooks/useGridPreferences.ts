
import { useState, useCallback, useEffect } from 'react';
import { GridPreferences, GridColumnConfig, SortConfig, FilterConfig } from '@/types/smartgrid';

interface UseGridPreferencesProps {
  columns: GridColumnConfig[];
  persistPreferences?: boolean;
  preferencesKey?: string;
  onPreferenceSave?: (preferences: GridPreferences) => Promise<void>;
  onPreferenceLoad?: () => Promise<GridPreferences | null>;
}

export function useGridPreferences({
  columns,
  persistPreferences,
  preferencesKey,
  onPreferenceSave,
  onPreferenceLoad
}: UseGridPreferencesProps) {
  const defaultPreferences: GridPreferences = {
    columnOrder: columns.map(col => col.key),
    hiddenColumns: [],
    columnWidths: {},
    columnHeaders: {},
    filters: [],
    pageSize: 10
  };

  const [preferences, setPreferences] = useState<GridPreferences>(defaultPreferences);

  const savePreferences = useCallback(async (newPreferences: GridPreferences) => {
    setPreferences(newPreferences);
    
    if (onPreferenceSave) {
      try {
        await onPreferenceSave(newPreferences);
      } catch (error) {
        console.error('Failed to save preferences via callback:', error);
      }
    } else if (persistPreferences && preferencesKey) {
      try {
        localStorage.setItem(preferencesKey, JSON.stringify(newPreferences));
      } catch (error) {
        console.error('Failed to save preferences to localStorage:', error);
      }
    }
  }, [onPreferenceSave, persistPreferences, preferencesKey]);

  const loadPreferences = useCallback(async () => {
    try {
      let loadedPreferences: GridPreferences | null = null;

      if (onPreferenceLoad) {
        loadedPreferences = await onPreferenceLoad();
      } else if (persistPreferences && preferencesKey) {
        const stored = localStorage.getItem(preferencesKey);
        if (stored) {
          loadedPreferences = JSON.parse(stored);
        }
      }

      if (loadedPreferences) {
        // Merge with defaults to handle new columns
        const mergedPreferences: GridPreferences = {
          ...defaultPreferences,
          ...loadedPreferences,
          columnOrder: [
            ...loadedPreferences.columnOrder.filter(id => columns.some(col => col.key === id)),
            ...columns.filter(col => !loadedPreferences.columnOrder.includes(col.key)).map(col => col.key)
          ]
        };
        setPreferences(mergedPreferences);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      setPreferences(defaultPreferences);
    }
  }, [onPreferenceLoad, persistPreferences, preferencesKey, columns, defaultPreferences]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const updateColumnOrder = useCallback((newOrder: string[]) => {
    const newPreferences = { ...preferences, columnOrder: newOrder };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    const column = columns.find(col => col.key === columnId);
    if (column?.mandatory) return; // Can't hide mandatory columns

    const hiddenColumns = preferences.hiddenColumns.includes(columnId)
      ? preferences.hiddenColumns.filter(id => id !== columnId)
      : [...preferences.hiddenColumns, columnId];
    
    const newPreferences = { ...preferences, hiddenColumns };
    savePreferences(newPreferences);
  }, [preferences, savePreferences, columns]);

  const updateColumnWidth = useCallback((columnId: string, width: number) => {
    const newPreferences = {
      ...preferences,
      columnWidths: { ...preferences.columnWidths, [columnId]: width }
    };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const updateColumnHeader = useCallback((columnId: string, header: string) => {
    const newPreferences = {
      ...preferences,
      columnHeaders: { ...preferences.columnHeaders, [columnId]: header }
    };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const resetPreferences = useCallback(() => {
    savePreferences(defaultPreferences);
  }, [savePreferences, defaultPreferences]);

  const setColumnOrder = useCallback((newOrder: string[]) => {
    updateColumnOrder(newOrder);
  }, [updateColumnOrder]);

  const setColumnHeader = useCallback((columnId: string, header: string) => {
    updateColumnHeader(columnId, header);
  }, [updateColumnHeader]);

  const applySort = useCallback((sortConfig: SortConfig) => {
    const newPreferences = { ...preferences, sort: sortConfig };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const applyFilter = useCallback((filterConfig: FilterConfig) => {
    const existingFilters = preferences.filters.filter(f => f.column !== filterConfig.column);
    const newFilters = filterConfig.value ? [...existingFilters, filterConfig] : existingFilters;
    const newPreferences = { ...preferences, filters: newFilters };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const setPageSize = useCallback((pageSize: number) => {
    const newPreferences = { ...preferences, pageSize };
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  return {
    preferences,
    setPreferences,
    resetPreferences,
    updateColumnOrder,
    toggleColumnVisibility,
    updateColumnWidth,
    updateColumnHeader,
    setColumnOrder,
    setColumnHeader,
    applySort,
    applyFilter,
    setPageSize,
    savePreferences
  };
}
