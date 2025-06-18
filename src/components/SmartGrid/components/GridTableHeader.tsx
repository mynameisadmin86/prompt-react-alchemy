
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColumnFilter } from '../ColumnFilter';
import { GridColumnConfig, SortConfig, FilterConfig } from '@/types/smartgrid';

interface GridTableHeaderProps {
  showCheckboxes: boolean;
  orderedColumns: GridColumnConfig[];
  plugins: any[];
  showColumnFilters: boolean;
  filters: FilterConfig[];
  sort?: SortConfig;
  editingHeader: string | null;
  setEditingHeader: (key: string | null) => void;
  draggedColumn: string | null;
  dragOverColumn: string | null;
  resizeHoverColumn: string | null;
  resizingColumn: string | null;
  currentSelectedRows: Set<number>;
  paginatedData: any[];
  handleSelectionChange: (rows: Set<number>) => void;
  handleHeaderClick: (columnKey: string) => void;
  handleHeaderEdit: (columnKey: string, newHeader: string) => void;
  handleSort: (columnKey: string) => void;
  handleColumnDragStart: (e: React.DragEvent, columnKey: string) => void;
  handleColumnDragOver: (e: React.DragEvent, targetColumnKey: string) => void;
  handleColumnDragLeave: (e: React.DragEvent) => void;
  handleColumnDrop: (e: React.DragEvent, targetColumnKey: string) => void;
  handleColumnDragEnd: () => void;
  handleResizeStart: (e: React.MouseEvent, columnKey: string) => void;
  setResizeHoverColumn: (key: string | null) => void;
  handleColumnFilterChange: (filter: FilterConfig | null) => void;
  handleClearColumnFilter: (columnKey: string) => void;
  loading: boolean;
}

export function GridTableHeader({
  showCheckboxes,
  orderedColumns,
  plugins,
  showColumnFilters,
  filters,
  sort,
  editingHeader,
  setEditingHeader,
  draggedColumn,
  dragOverColumn,
  resizeHoverColumn,
  resizingColumn,
  currentSelectedRows,
  paginatedData,
  handleSelectionChange,
  handleHeaderClick,
  handleHeaderEdit,
  handleSort,
  handleColumnDragStart,
  handleColumnDragOver,
  handleColumnDragLeave,
  handleColumnDrop,
  handleColumnDragEnd,
  handleResizeStart,
  setResizeHoverColumn,
  handleColumnFilterChange,
  handleClearColumnFilter,
  loading
}: GridTableHeaderProps) {
  return (
    <TableHeader className="sticky top-0 z-20 bg-white shadow-sm border-b-2 border-gray-100">
      <TableRow className="hover:bg-transparent">
        {showCheckboxes && (
          <TableHead className="bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-900 px-3 py-3 border-r border-gray-100 w-[50px] flex-shrink-0">
            <input 
              type="checkbox" 
              className="rounded" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.checked) {
                  handleSelectionChange(new Set(Array.from({ length: paginatedData.length }, (_, i) => i)));
                } else {
                  handleSelectionChange(new Set());
                }
              }}
              checked={currentSelectedRows.size === paginatedData.length && paginatedData.length > 0}
            />
          </TableHead>
        )}
        {orderedColumns.map((column, index) => {
          const shouldHideIcons = resizeHoverColumn === column.key || resizingColumn === column.key;
          return (
            <TableHead 
              key={column.key}
              className={cn(
                "relative group bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-900 px-2 py-3 border-r border-gray-100 last:border-r-0",
                draggedColumn === column.key && "opacity-50",
                dragOverColumn === column.key && "bg-blue-100 border-blue-300",
                resizingColumn === column.key && "bg-blue-50",
                !resizingColumn && "cursor-move"
              )}
              style={{ width: `${column.width}px`, minWidth: `${Math.max(120, column.width)}px` }}
              draggable={!editingHeader && !resizingColumn}
              onDragStart={(e) => handleColumnDragStart(e, column.key)}
              onDragOver={(e) => handleColumnDragOver(e, column.key)}
              onDragLeave={handleColumnDragLeave}
              onDrop={(e) => handleColumnDrop(e, column.key)}
              onDragEnd={handleColumnDragEnd}
            >
              <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  {!shouldHideIcons && (
                    <GripVertical className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  )}
                  {editingHeader === column.key ? (
                    <Input
                      defaultValue={column.label}
                      onBlur={(e) => handleHeaderEdit(column.key, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleHeaderEdit(column.key, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                          setEditingHeader(null);
                        }
                      }}
                      className="h-5 px-1 text-sm font-semibold bg-white border-blue-300 focus:border-blue-500 min-w-0"
                      autoFocus
                      onFocus={(e) => e.target.select()}
                      onClick={(e) => e.stopPropagation()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <div 
                      className={cn(
                        "flex items-center gap-1 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors group/header flex-1 min-w-0",
                        !resizingColumn && "cursor-pointer hover:bg-gray-100/50"
                      )}
                      onClick={(e) => {
                        if (resizingColumn) return;
                        e.stopPropagation();
                        handleHeaderClick(column.key);
                      }}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <span 
                        className="select-none text-sm font-semibold flex-1 min-w-0" 
                        style={{ 
                          whiteSpace: 'nowrap',
                          overflow: 'visible',
                          textOverflow: 'clip'
                        }}
                        title={column.label}
                      >
                        {column.label}
                      </span>
                      {column.editable && !shouldHideIcons && (
                        <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover/header:opacity-100 transition-opacity flex-shrink-0" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  {column.sortable && !shouldHideIcons && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        if (resizingColumn) return;
                        e.stopPropagation();
                        handleSort(column.key);
                      }}
                      className="h-5 w-5 p-0 hover:bg-transparent transition-opacity flex-shrink-0"
                      disabled={loading || !!resizingColumn}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      {sort?.column === column.key ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-3 w-3 text-blue-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-blue-600" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-col-resize bg-transparent hover:bg-blue-300/50 transition-colors flex items-center justify-center group/resize z-30"
                onMouseDown={(e) => handleResizeStart(e, column.key)}
                onMouseEnter={() => setResizeHoverColumn(column.key)}
                onMouseLeave={() => setResizeHoverColumn(null)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragStart={(e) => e.preventDefault()}
              >
                <div className="w-0.5 h-4 bg-gray-300 opacity-0 group-hover/resize:opacity-100 transition-opacity" />
              </div>
            </TableHead>
          );
        })}
        {plugins.some(plugin => plugin.rowActions) && (
          <TableHead className="bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-900 px-3 py-3 text-center w-[100px] flex-shrink-0">
            Actions
          </TableHead>
        )}
      </TableRow>
      
      {showColumnFilters && (
        <TableRow className="hover:bg-transparent border-b border-gray-200">
          {showCheckboxes && (
            <TableHead className="bg-gray-25 px-3 py-2 border-r border-gray-100 w-[50px]">
              {/* Empty space for checkbox column */}
            </TableHead>
          )}
          {orderedColumns.map((column) => {
            const currentFilter = filters.find(f => f.column === column.key);
            return (
              <TableHead 
                key={`filter-${column.key}`}
                className="bg-gray-25 px-2 py-2 border-r border-gray-100 last:border-r-0 relative"
                style={{ width: `${column.width}px` }}
              >
                {column.filterable && (
                  <ColumnFilter
                    column={column}
                    currentFilter={currentFilter}
                    onFilterChange={(filter) => {
                      if (filter) {
                        handleColumnFilterChange(filter);
                      } else {
                        handleClearColumnFilter(column.key);
                      }
                    }}
                  />
                )}
              </TableHead>
            );
          })}
          {plugins.some(plugin => plugin.rowActions) && (
            <TableHead className="bg-gray-25 px-3 py-2 text-center w-[100px]">
              {/* Empty space for actions column */}
            </TableHead>
          )}
        </TableRow>
      )}
    </TableHeader>
  );
}
