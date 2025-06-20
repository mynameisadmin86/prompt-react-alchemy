
import React, { useState, useEffect, useCallback } from 'react';
import { MainRowFilters } from './MainRowFilters';
import { SubRowFilters } from './SubRowFilters';
import { GridColumnConfig } from '@/types/smartgrid';
import { FilterValue, FilterSet, FilterSystemAPI } from '@/types/filterSystem';
import { useToast } from '@/hooks/use-toast';

interface FilterSystemProps {
  columns: GridColumnConfig[];
  subRowColumns: GridColumnConfig[];
  onFiltersChange: (filters: Record<string, FilterValue>) => void;
  gridId: string;
  userId: string;
  showFilterRow: boolean;
  api?: FilterSystemAPI;
}

export function FilterSystem({
  columns,
  subRowColumns,
  onFiltersChange,
  gridId,
  userId,
  showFilterRow,
  api
}: FilterSystemProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, FilterValue>>({});
  const [filterSets, setFilterSets] = useState<FilterSet[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  // Load saved filter sets on mount
  useEffect(() => {
    if (api && userId) {
      loadFilterSets();
    }
  }, [api, userId, gridId]);

  // Apply default filter set on load
  useEffect(() => {
    const defaultSet = filterSets.find(set => set.isDefault);
    if (defaultSet && Object.keys(activeFilters).length === 0) {
      applyFilterSet(defaultSet);
    }
  }, [filterSets]);

  const loadFilterSets = async () => {
    if (!api) return;
    
    try {
      setLoading(true);
      const sets = await api.getUserFilterSets(userId, gridId);
      setFilterSets(sets);
    } catch (error) {
      console.error('Failed to load filter sets:', error);
      toast({
        title: "Error",
        description: "Failed to load saved filter sets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((columnKey: string, value: FilterValue | undefined) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (value === undefined) {
        delete newFilters[columnKey];
      } else {
        newFilters[columnKey] = value;
      }
      
      return newFilters;
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    onFiltersChange(activeFilters);
    if (api) {
      api.applyGridFilters(activeFilters);
    }
  }, [activeFilters, onFiltersChange, api]);

  const applyFilterSet = (filterSet: FilterSet) => {
    setActiveFilters(filterSet.filters);
    onFiltersChange(filterSet.filters);
    
    if (api) {
      api.applyGridFilters(filterSet.filters);
    }
    
    toast({
      title: "Filter Set Applied",
      description: `Applied "${filterSet.name}" with ${Object.keys(filterSet.filters).length} filters`,
    });
  };

  // Don't render anything if showFilterRow is false
  if (!showFilterRow) {
    return null;
  }

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Main Row Filters */}
      <MainRowFilters
        columns={columns}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
      />

      {/* Sub-Row Filters - Collapsible Section */}
      <SubRowFilters
        subRowColumns={subRowColumns}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
