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
  Zap,
  EllipsisVertical,
  SlidersHorizontal,
  Calendar,
  Package
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
import { spawn } from 'child_process';

interface GridToolbarProps {
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  showColumnFilters?: boolean;
  setShowColumnFilters?: (show: boolean) => void;
  showCheckboxes?: boolean;
  setShowCheckboxes?: (show: boolean) => void;
  viewMode?: 'table' | 'card';
  setViewMode?: (mode: 'table' | 'card') => void;
  loading: boolean;
  filters: any[];
  columns: GridColumnConfig[];
  preferences: GridPreferences;
  onColumnVisibilityToggle?: (columnId: string) => void;
  onColumnHeaderChange?: (columnId: string, header: string) => void;
  onResetToDefaults?: () => void;
  onExport?: (format: 'csv' | 'xlsx') => void;
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
  createButtonLabel?: string;
  showFilterSystem?: boolean;
  setShowFilterSystem?: (show: boolean) => void;
  // Server-side filter props
  showServersideFilter?: boolean;
  onToggleServersideFilter?: () => void;
  gridId?: string;
  hideCheckboxToggle?: boolean;
  // Selection props
  selectedRowsCount?: number;
  onClearSelection?: () => void;
  hideFilters?: boolean;
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
  createButtonLabel = "Create",
  searchPlaceholder = "Search",
  showFilterSystem,
  setShowFilterSystem,
  clientSideSearch = true,
  showAdvancedFilter,
  onToggleAdvancedFilter,
  groupByField,
  onGroupByChange,
  groupableColumns,
  showGroupingDropdown = false,
  showServersideFilter = false,
  onToggleServersideFilter,
  gridId,
  hideCheckboxToggle = false,
  selectedRowsCount = 0,
  onClearSelection,
  hideFilters = false
}: GridToolbarProps) {
  // Default configurable button configuration
  const defaultConfigurableButton: ConfigurableButtonConfig = {
    label: defaultConfigurableButtonLabel,
    tooltipTitle: "Add new item",
    showDropdown: false,
    onClick: () => {
      defaultConfigurableButton.onClick();
    }
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
    <div className={`flex items-center justify-between w-full
      ${(gridTitle == 'Plan List' || gridTitle == 'Actual List') ? 'mb-0 p-4' : 'mb-4'}`}>
      {/* Left side - Grid Title and Count */}
      <div className="flex items-center">
        {gridTitle && (
          <div className="flex items-center">
            <span className="text-Gray-800 font-semibold text-lg flex items-center">
              {gridTitle === "Leg Details" && (
                <span className='p-3 rounded-xl bg-blue-50 mr-4'>
                  <Calendar color="#0058AF" strokeWidth={1.2} />
                </span>
              )}
              {(gridTitle === "Trip Customer Orders" || gridTitle == 'Trip Customer Orders Multi') && (
                <span className='p-3 rounded-xl bg-[#EBE9FE] mr-4'>
                  <Package color="#7a5af8" strokeWidth={2} />
                </span>
              )}
              {gridTitle == 'Leg Details' ? 'Events & Consignment' 
                : (gridTitle == 'Trip Customer Orders' || gridTitle == 'Trip Customer Orders Multi') ? 'Customer Orders' : gridTitle}
            </span>
            {recordCount !== undefined && (gridTitle !== 'Plan List' && gridTitle !== 'Actual List') && (
              <span
                className="inline-flex items-center justify-center rounded-full text-xs badge-blue ml-3 font-medium"
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

        {/* Show selected rows count and clear button */}
        {/* {selectedRowsCount > 0 && (
          <div className="flex items-center gap-2 ml-3">
            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              {selectedRowsCount} row{selectedRowsCount > 1 ? 's' : ''} selected
            </div>
            {onClearSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </div>
        )} */}
      </div>

      {/* Right side - Controls */}
      {!hideFilters && (
        <div className="flex items-center space-x-3">
...
        </div>
      )}
    </div>
  );
}
