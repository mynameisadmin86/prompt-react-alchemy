
import React, { useState, useEffect, useCallback } from 'react';
import { FilterControls } from './FilterControls';
import { MainRowFilters } from './MainRowFilters';
import { SubRowFilters } from './SubRowFilters';
import { FilterSetModal } from './FilterSetModal';
import { GridColumnConfig } from '@/types/smartgrid';
import { FilterValue, FilterSet, FilterSystemAPI } from '@/types/filterSystem';
import { useToast } from '@/hooks/use-toast';

interface FilterSystemProps {
  columns: GridColumnConfig[];
  subRowColumns: GridColumnConfig[];
  showFilterRow: boolean;
  onToggleFilterRow: () => void;
  onFiltersChange: (filters: Record<string, FilterValue>) => void;
  gridId: string;
  userId: string;
  api?: FilterSystemAPI;
}

export function FilterSystem({
  columns,
  subRowColumns,
  showFilterRow,
  onToggleFilterRow,
  onFiltersChange,
  gridId,
  userId,
  api
}: FilterSystemProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, FilterValue>>({});
  const [filterSets, setFilterSets] = useState<FilterSet[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
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

  const handleSaveFilterSet = async (name: string, isDefault: boolean) => {
    if (!api) {
      toast({
        title: "Error",
        description: "Filter set API not available",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // If setting as default, remove default from other sets
      if (isDefault) {
        const promises = filterSets
          .filter(set => set.isDefault)
          .map(set => api.updateFilterSet(set.id, { isDefault: false }));
        await Promise.all(promises);
      }

      const newSet = await api.saveUserFilterSet(userId, name, activeFilters, isDefault);
      setFilterSets(prev => [...prev.map(set => ({ ...set, isDefault: false })), newSet]);
      
      toast({
        title: "Success",
        description: `Filter set "${name}" saved successfully`,
      });
    } catch (error) {
      console.error('Failed to save filter set:', error);
      toast({
        title: "Error",
        description: "Failed to save filter set",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSetDefault = async (filterSetId: string) => {
    if (!api) return;

    try {
      setLoading(true);
      
      // Remove default from all sets
      const promises = filterSets.map(set => 
        api.updateFilterSet(set.id, { isDefault: set.id === filterSetId })
      );
      await Promise.all(promises);
      
      setFilterSets(prev => prev.map(set => ({
        ...set,
        isDefault: set.id === filterSetId
      })));
      
      const filterSet = filterSets.find(set => set.id === filterSetId);
      toast({
        title: "Default Set Updated",
        description: `"${filterSet?.name}" is now the default filter set`,
      });
    } catch (error) {
      console.error('Failed to update default filter set:', error);
      toast({
        title: "Error",
        description: "Failed to update default filter set",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (filterSetId: string, newName: string) => {
    if (!api) return;

    try {
      const updatedSet = await api.updateFilterSet(filterSetId, { name: newName });
      setFilterSets(prev => prev.map(set => 
        set.id === filterSetId ? updatedSet : set
      ));
      
      toast({
        title: "Filter Set Renamed",
        description: `Filter set renamed to "${newName}"`,
      });
    } catch (error) {
      console.error('Failed to rename filter set:', error);
      toast({
        title: "Error",
        description: "Failed to rename filter set",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (filterSetId: string) => {
    if (!api) return;

    try {
      await api.deleteFilterSet(filterSetId);
      const deletedSet = filterSets.find(set => set.id === filterSetId);
      setFilterSets(prev => prev.filter(set => set.id !== filterSetId));
      
      toast({
        title: "Filter Set Deleted",
        description: `"${deletedSet?.name}" has been deleted`,
      });
    } catch (error) {
      console.error('Failed to delete filter set:', error);
      toast({
        title: "Error",
        description: "Failed to delete filter set",
        variant: "destructive"
      });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFiltersChange({});
    
    if (api) {
      api.applyGridFilters({});
    }
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="space-y-2">
      {/* Filter Controls */}
      <FilterControls
        showFilterRow={showFilterRow}
        onToggleFilterRow={onToggleFilterRow}
        activeFilterCount={activeFilterCount}
        onClearAllFilters={clearAllFilters}
        onShowSaveModal={() => setShowSaveModal(true)}
        filterSets={filterSets}
        onApplyFilterSet={applyFilterSet}
        onSetDefault={handleSetDefault}
        onRename={handleRename}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Filter Panel - Only shown when showFilterRow is true */}
      {showFilterRow && (
        <div className="bg-white border rounded shadow-sm">
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
      )}

      {/* Save Filter Set Modal */}
      <FilterSetModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveFilterSet}
        activeFilters={activeFilters}
        existingNames={filterSets.map(set => set.name)}
      />
    </div>
  );
}
