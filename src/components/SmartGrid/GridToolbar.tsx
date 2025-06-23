
import React from 'react';
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
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColumnVisibilityManager } from './ColumnVisibilityManager';
import { GridColumnConfig, GridPreferences } from '@/types/smartgrid';
import { ConfigurableButton, ConfigurableButtonConfig } from '@/components/ui/configurable-button';

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
  showDefaultConfigurableButton = false,
  defaultConfigurableButtonLabel = "Add"
}: GridToolbarProps) {
  // Default configurable button configuration
  const defaultConfigurableButton: ConfigurableButtonConfig = {
    label: defaultConfigurableButtonLabel,
    tooltipTitle: "Add new item",
    showDropdown: false
  };

  // Use provided buttons or default button if none provided and showDefault is true
  const buttonsToShow = configurableButtons || (showDefaultConfigurableButton ? [defaultConfigurableButton] : []);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center space-x-2">
        {/* Show active filters count */}
        {filters.length > 0 && (
          <div className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {filters.length} filter{filters.length > 1 ? 's' : ''} active
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        

        {/* Search box - first */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 w-full"
            disabled={loading}
          />
        </div>

        {/* Common Filter Button - Updated to toggle column filters */}
        <Button
          variant={showColumnFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowColumnFilters(!showColumnFilters)}
          disabled={loading}
          title="Toggle Column Filters"
          className={cn(
            "transition-colors",
            showColumnFilters && "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          )}
        >
          <Filter className="h-4 w-4" />
          {filters.length > 0 && (
            <span className="ml-1 text-xs bg-blue-100 text-blue-600 rounded-full px-1.5 py-0.5">
              {filters.length}
            </span>
          )}
        </Button>

        {/* Toggle Checkboxes Button - Updated with blue selection state */}
        <Button 
          variant={showCheckboxes ? "default" : "outline"}
          size="sm" 
          onClick={() => setShowCheckboxes(!showCheckboxes)}
          disabled={loading}
          title="Toggle Checkboxes"
          className={cn(
            "transition-colors",
            showCheckboxes && "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          )}
        >
          <CheckSquare className="h-4 w-4" />
        </Button>

        {/* Toggle View Mode Button - Updated with better visual states */}
        <Button 
          variant="outline"
          size="sm" 
          onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
          disabled={loading}
          title={`Switch to ${viewMode === 'table' ? 'Card' : 'Table'} View`}
          className={cn(
            "transition-colors",
            viewMode === 'card' && "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
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
          variant="outline" 
          size="sm" 
          onClick={onResetToDefaults} 
          disabled={loading}
          title="Reset All"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onExport('csv')} 
          disabled={loading}
          title="Download CSV"
        >
          <Download className="h-4 w-4" />
        </Button>
        {/* Configurable Buttons */}
        {buttonsToShow.map((buttonConfig, index) => (
          <ConfigurableButton
            key={index}
            config={buttonConfig}
            className="mr-2"
          />
        ))}
      </div>
    </div>
  );
}
