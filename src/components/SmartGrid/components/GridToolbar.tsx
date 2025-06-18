
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Filter, 
  Search, 
  RotateCcw, 
  CheckSquare,
  Grid2x2,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColumnVisibilityManager } from '../ColumnVisibilityManager';
import { GridColumnConfig } from '@/types/smartgrid';

interface GridToolbarProps {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  showColumnFilters: boolean;
  setShowColumnFilters: (show: boolean) => void;
  filters: any[];
  showCheckboxes: boolean;
  setShowCheckboxes: (show: boolean) => void;
  viewMode: 'table' | 'card';
  setViewMode: (mode: 'table' | 'card') => void;
  columns: GridColumnConfig[];
  preferences: any;
  toggleColumnVisibility: (columnKey: string) => void;
  updateColumnHeader: (columnKey: string, header: string) => void;
  handleResetPreferences: () => void;
  handleExport: (format: 'csv') => void;
  loading: boolean;
}

export function GridToolbar({
  globalFilter,
  setGlobalFilter,
  showColumnFilters,
  setShowColumnFilters,
  filters,
  showCheckboxes,
  setShowCheckboxes,
  viewMode,
  setViewMode,
  columns,
  preferences,
  toggleColumnVisibility,
  updateColumnHeader,
  handleResetPreferences,
  handleExport,
  loading
}: GridToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center space-x-2">
        {filters.length > 0 && (
          <div className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {filters.length} filter{filters.length > 1 ? 's' : ''} active
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
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

        <ColumnVisibilityManager
          columns={columns}
          preferences={preferences}
          onColumnVisibilityToggle={toggleColumnVisibility}
          onColumnHeaderChange={updateColumnHeader}
          onResetToDefaults={handleResetPreferences}
        />

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetPreferences} 
          disabled={loading}
          title="Reset All"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExport('csv')} 
          disabled={loading}
          title="Download CSV"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
