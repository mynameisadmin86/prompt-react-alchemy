
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Download, 
  CheckSquare,
  Grid2x2,
  List,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColumnVisibilityManager } from './ColumnVisibilityManager';
import { FilterSystem } from './FilterSystem';
import { GridColumnConfig, GridPreferences } from '@/types/smartgrid';
import { ConfigurableButton, ConfigurableButtonConfig } from '@/components/ui/configurable-button';
import { FilterSystemAPI } from '@/types/filterSystem';

interface GridToolbarProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  showColumnFilters: boolean;
  setShowColumnFilters: (show: boolean) => void;
  showCheckboxes: boolean;
  setShowCheckboxes: (show: boolean) => void;
  viewMode: 'table' | 'card';
  setViewMode: (mode: 'table' | 'card') => void;
  loading: boolean;
  filters: any[];
  columns: GridColumnConfig[];
  preferences: GridPreferences;
  onColumnVisibilityToggle: (columnId: string) => void;
  onColumnHeaderChange: (columnId: string, header: string) => void;
  onResetToDefaults: () => void;
  onExport: (format: 'csv') => void;
  onSubRowToggle?: (columnKey: string) => void;
  configurableButtons?: ConfigurableButtonConfig[];
  showDefaultConfigurableButton?: boolean;
  defaultConfigurableButtonLabel?: string;
  gridTitle?: string;
  recordCount?: number;
  showCreateButton?: boolean;
  searchPlaceholder?: string;
  // FilterSystem props
  onFiltersChange?: (filters: Record<string, any>) => void;
  gridId?: string;
  userId?: string;
  filterSystemAPI?: FilterSystemAPI;
}

export function GridToolbar({
  globalFilter,
  setGlobalFilter,
  showColumnFilters,
  setShowColumnFilters,
  showCheckboxes,
  setShowCheckboxes,
  viewMode,
  setViewMode,
  loading,
  filters,
  columns,
  preferences,
  onColumnVisibilityToggle,
  onColumnHeaderChange,
  onResetToDefaults,
  onExport,
  onSubRowToggle,
  configurableButtons,
  showDefaultConfigurableButton = true,
  defaultConfigurableButtonLabel = "Add",
  gridTitle,
  recordCount,
  showCreateButton = false,
  searchPlaceholder = "Search all columns...",
  onFiltersChange,
  gridId = 'default-grid',
  userId = 'default-user',
  filterSystemAPI
}: GridToolbarProps) {
  const [showFilterSystem, setShowFilterSystem] = useState(false);

  // Default configurable button configuration
  const defaultConfigurableButton: ConfigurableButtonConfig = {
    label: defaultConfigurableButtonLabel,
    tooltipTitle: "Add new item",
    showDropdown: false
  };

  // Determine which buttons to show
  const buttonsToShow = configurableButtons && configurableButtons.length > 0 
    ? configurableButtons 
    : (showDefaultConfigurableButton ? [defaultConfigurableButton] : []);

  // Get sub-row columns for FilterSystem
  const subRowColumns = columns.filter(col => col.subRow);

  return (
    <div className="w-full bg-gray-50">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between w-full py-2 px-4">
        {/* Left side - Grid Title and Count */}
        <div className="flex items-center">
          {gridTitle && (
            <div className="flex items-center">
              <span className="text-gray-900 font-semibold text-sm">
                {gridTitle}
              </span>
              {recordCount !== undefined && (
                <span 
                  className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-500 text-xs px-2 py-0.5 ml-1"
                  aria-label={`${gridTitle} count ${recordCount}`}
                >
                  {recordCount}
                </span>
              )}
            </div>
          )}

          {/* Show active filters count */}
          {filters.length > 0 && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded ml-3">
              {filters.length} filter{filters.length > 1 ? 's' : ''} active
            </div>
          )}
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center space-x-1">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border border-gray-300 rounded text-sm placeholder-gray-400 px-2 py-1 pl-8 w-64 h-8"
              disabled={loading}
            />
          </div>

          {/* Filters Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterSystem(!showFilterSystem)}
            disabled={loading}
            className={cn(
              "rounded-md px-3 py-1 border text-sm font-medium flex items-center space-x-2 h-8 transition-all duration-200",
              showFilterSystem 
                ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100" 
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {showFilterSystem ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>

          {/* Icon buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColumnFilters(!showColumnFilters)}
            disabled={loading}
            title="Toggle Column Filters"
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0",
              showColumnFilters && "bg-blue-50 text-blue-600"
            )}
          >
            <Filter className="h-4 w-4" />
            {filters.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {filters.length}
              </span>
            )}
          </Button>

          <Button 
            variant="ghost"
            size="sm" 
            onClick={() => setShowCheckboxes(!showCheckboxes)}
            disabled={loading}
            title="Toggle Checkboxes"
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0",
              showCheckboxes && "bg-blue-50 text-blue-600"
            )}
          >
            <CheckSquare className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost"
            size="sm" 
            onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            disabled={loading}
            title={`Switch to ${viewMode === 'table' ? 'Card' : 'Table'} View`}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0",
              viewMode === 'card' && "bg-blue-50 text-blue-600"
            )}
          >
            {viewMode === 'table' ? (
              <Grid2x2 className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>

          {/* Column Visibility Manager */}
          <ColumnVisibilityManager
            columns={columns}
            preferences={preferences}
            onColumnVisibilityToggle={onColumnVisibilityToggle}
            onColumnHeaderChange={onColumnHeaderChange}
            onResetToDefaults={onResetToDefaults}
            onSubRowToggle={onSubRowToggle}
          />

          <Button 
            variant="ghost"
            size="sm" 
            onClick={onResetToDefaults} 
            disabled={loading}
            title="Reset All"
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost"
            size="sm" 
            onClick={() => onExport('csv')} 
            disabled={loading}
            title="Download CSV"
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>

          {/* Create Button */}
          {showCreateButton && (
            <Button
              variant="outline"
              size="sm"
              className="border border-blue-500 text-blue-500 rounded px-3 py-1 text-sm hover:bg-blue-50 h-8 ml-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Trip
            </Button>
          )}
          
          {/* Configurable Buttons */}
          {buttonsToShow.map((buttonConfig, index) => (
            <ConfigurableButton
              key={index}
              config={buttonConfig}
            />
          ))}
        </div>
      </div>

      {/* FilterSystem with smooth transition */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-200",
          showFilterSystem 
            ? "max-h-[500px] opacity-100" 
            : "max-h-0 opacity-0"
        )}
      >
        {showFilterSystem && onFiltersChange && (
          <div className="px-4 py-3 bg-white shadow-sm">
            <FilterSystem
              columns={columns}
              subRowColumns={subRowColumns}
              showFilterRow={true}
              onToggleFilterRow={() => {}}
              onFiltersChange={onFiltersChange}
              gridId={gridId}
              userId={userId}
              api={filterSystemAPI}
            />
          </div>
        )}
      </div>
    </div>
  );
}
