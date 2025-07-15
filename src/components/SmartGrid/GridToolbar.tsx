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
  gridTitle?: string;
  recordCount?: number;
  showCreateButton?: boolean;
  searchPlaceholder?: string;
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
  searchPlaceholder = "Search all columns..."
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

  return (
    <div className="d-flex align-items-center justify-content-between w-100 py-2 bg-light">
      {/* Left side - Grid Title and Count */}
      <div className="d-flex align-items-center">
        {gridTitle && (
          <div className="d-flex align-items-center">
            <span className="text-dark font-weight-semibold small">
              {gridTitle}
            </span>
            {recordCount !== undefined && (
              <span 
                className="badge badge-primary badge-pill ml-1"
                aria-label={`${gridTitle} count ${recordCount}`}
                style={{ fontSize: '0.75rem' }}
              >
                {recordCount}
              </span>
            )}
          </div>
        )}

        {/* Show active filters count */}
        {filters.length > 0 && (
          <div className="badge badge-info ml-3" style={{ fontSize: '0.75rem' }}>
            {filters.length} filter{filters.length > 1 ? 's' : ''} active
          </div>
        )}
      </div>

      {/* Right side - Controls */}
      <div className="d-flex align-items-center">
        {/* Search box */}
        <div className="position-relative mr-2">
          <Search className="position-absolute" style={{ left: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#6c757d' }} />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="form-control form-control-sm pl-4"
            style={{ paddingLeft: '32px', width: '256px' }}
            disabled={loading}
          />
        </div>

        {/* Icon buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowColumnFilters(!showColumnFilters)}
          disabled={loading}
          title="Toggle Column Filters"
          className={cn(
            "btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center position-relative mr-1",
            showColumnFilters && "btn-primary"
          )}
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          <Filter className="" style={{ width: '16px', height: '16px' }} />
          {filters.length > 0 && (
            <span className="badge badge-primary badge-pill position-absolute" style={{ top: '-4px', right: '-4px', fontSize: '0.6rem', minWidth: '16px', height: '16px', lineHeight: '16px' }}>
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
            "btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center mr-1",
            showCheckboxes && "btn-primary"
          )}
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          <CheckSquare style={{ width: '16px', height: '16px' }} />
        </Button>

        <Button 
          variant="ghost"
          size="sm" 
          onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
          disabled={loading}
          title={`Switch to ${viewMode === 'table' ? 'Card' : 'Table'} View`}
          className={cn(
            "btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center mr-1",
            viewMode === 'card' && "btn-primary"
          )}
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          {viewMode === 'table' ? (
            <Grid2x2 style={{ width: '16px', height: '16px' }} />
          ) : (
            <List style={{ width: '16px', height: '16px' }} />
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
          className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center mr-1"
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          <RotateCcw style={{ width: '16px', height: '16px' }} />
        </Button>
        
        <Button 
          variant="ghost"
          size="sm" 
          onClick={() => onExport('csv')} 
          disabled={loading}
          title="Download CSV"
          className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center mr-1"
          style={{ width: '32px', height: '32px', padding: 0 }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
        </Button>

        {/* Create Button */}
        {showCreateButton && (
          <Button
            variant="outline"
            size="sm"
            className="btn btn-sm btn-outline-primary ml-2"
          >
            <Plus className="mr-1" style={{ width: '16px', height: '16px' }} />
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
