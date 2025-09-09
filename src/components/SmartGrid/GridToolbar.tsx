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
  Plus,
  ChevronDown,
  Group,
  Zap
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ColumnVisibilityManager } from './ColumnVisibilityManager';
import { GridColumnConfig, GridPreferences } from '@/types/smartgrid';
import { ConfigurableButton, ConfigurableButtonConfig } from '@/components/ui/configurable-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useFilterStore } from '@/stores/filterStore';

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
  onExport: (format: 'csv' | 'xlsx') => void;
  onSubRowToggle?: (columnKey: string) => void;
  configurableButtons?: ConfigurableButtonConfig[];
  showDefaultConfigurableButton?: boolean;
  defaultConfigurableButtonLabel?: string;
  gridTitle?: string;
  recordCount?: number;
  showCreateButton?: boolean;
  searchPlaceholder?: string;
  clientSideSearch?: boolean;
  // Advanced Filter props
  showAdvancedFilter: boolean;
  onToggleAdvancedFilter: () => void;
  // Grouping props
  groupByField?: string | null;
  onGroupByChange?: (field: string | null) => void;
  groupableColumns?: string[];
  showGroupingDropdown?: boolean;
  // Server-side filter props
  showServersideFilter?: boolean;
  onToggleServersideFilter?: () => void;
  gridId?: string;
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
  clientSideSearch = true,
  showAdvancedFilter,
  onToggleAdvancedFilter,
  groupByField,
  onGroupByChange,
  groupableColumns,
  showGroupingDropdown = false,
  showServersideFilter = false,
  onToggleServersideFilter,
  gridId
}: GridToolbarProps) {
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

  // Determine which columns can be grouped
  const availableGroupColumns = React.useMemo(() => {
    if (groupableColumns) {
      return columns.filter(col => groupableColumns.includes(col.key));
    }
    // Show all columns by default
    return columns;
  }, [columns, groupableColumns]);

  const handleGroupByChange = (value: string) => {
    const newGroupBy = value === 'none' ? null : value;
    onGroupByChange?.(newGroupBy);
  };

  // Get active serverside filters from store
  const { activeFilters } = useFilterStore();
  const currentActiveFilters = activeFilters[gridId || 'default'] || {};
  const hasActiveServersideFilters = Object.keys(currentActiveFilters).length > 0;

  return (
    <div className="flex items-center justify-between w-full py-2 bg-gray-50">
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
        {/* Search box - only show if clientSideSearch is enabled */}
        {clientSideSearch && (
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
        )}

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

        {/* Advanced Filter Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAdvancedFilter}
          disabled={loading}
          title="Toggle Advanced Filters"
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0",
            showAdvancedFilter && "bg-blue-50 text-blue-600"
          )}
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Server-side Filter Toggle */}
        {onToggleServersideFilter && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleServersideFilter}
              disabled={loading}
              title="Toggle Server-side Filters"
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0",
                showServersideFilter && "bg-purple-50 text-purple-600"
              )}
            >
              <Zap className="h-4 w-4" />
            </Button>
            {/* Server-side Filter Badge - Show when filters are hidden but active */}
            {!showServersideFilter && hasActiveServersideFilters && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-5 min-w-5 text-xs bg-purple-500 text-white rounded-full flex items-center justify-center p-0"
              >
                {Object.keys(currentActiveFilters).length}
              </Badge>
            )}
          </div>
        )}

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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="sm" 
              disabled={loading}
              title="Export Data"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0"
            >
              <Download className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('csv')}>
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('xlsx')}>
              Export Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Group by dropdown button */}
        {showGroupingDropdown && availableGroupColumns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost"
                size="sm" 
                disabled={loading}
                title="Group By"
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 p-0"
              >
                <Group className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleGroupByChange('none')}>
                No grouping
              </DropdownMenuItem>
              {availableGroupColumns.map(col => (
                <DropdownMenuItem 
                  key={col.key} 
                  onClick={() => handleGroupByChange(col.key)}
                  className={groupByField === col.key ? 'bg-blue-50 text-blue-600' : ''}
                >
                  {col.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
  );
}
