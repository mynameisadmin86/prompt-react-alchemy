
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Settings, GripVertical, Edit2, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Column, GridPreferences } from '@/types/smartgrid';

interface ColumnManagerProps<T> {
  columns: Column<T>[];
  preferences: GridPreferences;
  onColumnOrderChange: (newOrder: string[]) => void;
  onColumnVisibilityToggle: (columnId: string) => void;
  onColumnHeaderChange: (columnId: string, header: string) => void;
  onSubRowToggle?: (columnId: string) => void;
  onSubRowConfigToggle?: (enabled: boolean) => void;
}

export function ColumnManager<T>({
  columns,
  preferences,
  onColumnOrderChange,
  onColumnVisibilityToggle,
  onColumnHeaderChange,
  onSubRowToggle,
  onSubRowConfigToggle
}: ColumnManagerProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const orderedColumns = preferences.columnOrder
    .map(id => columns.find(col => col.id === id))
    .filter(Boolean) as Column<T>[];

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const newOrder = [...preferences.columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    onColumnOrderChange(newOrder);
  };

  const handleHeaderSave = (columnId: string, newHeader: string) => {
    onColumnHeaderChange(columnId, newHeader);
    setEditingHeader(null);
  };

  const handleSubRowToggle = (columnId: string) => {
    console.log('Sub-row toggle clicked for column:', columnId);
    if (onSubRowToggle) {
      onSubRowToggle(columnId);
    }
  };

  const handleSubRowConfigToggle = (enabled: boolean) => {
    console.log('Sub-row config toggle:', enabled);
    if (onSubRowConfigToggle) {
      onSubRowConfigToggle(enabled);
    }
  };

  const handleSelectAllSubRows = () => {
    if (onSubRowToggle) {
      const visibleColumns = columns.filter(col => !preferences.hiddenColumns.includes(col.id));
      visibleColumns.forEach(column => {
        if (!preferences.subRowColumns?.includes(column.id)) {
          onSubRowToggle(column.id);
        }
      });
    }
  };

  const handleDeselectAllSubRows = () => {
    if (onSubRowToggle) {
      const subRowColumns = preferences.subRowColumns || [];
      subRowColumns.forEach(columnId => {
        onSubRowToggle(columnId);
      });
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="btn btn-sm btn-outline-secondary d-flex align-items-center mr-1"
      >
        <Settings className="mr-2" style={{ width: '16px', height: '16px' }} />
        <span>Columns</span>
      </Button>
    );
  }

  return (
    <div className="position-absolute bg-white border rounded shadow-lg" style={{ top: '100%', right: 0, marginTop: '8px', width: '384px', zIndex: 50, padding: '16px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="font-weight-semibold">Manage Columns</h3>
        <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)} className="btn btn-sm btn-link p-0">
          ×
        </Button>
      </div>

      {/* Sub-row Configuration Toggle */}
      <div className="d-flex align-items-center justify-content-between p-3 mb-4 bg-light rounded">
        <div className="d-flex flex-column">
          <span className="small font-weight-medium text-dark">Enable Sub-row Configuration</span>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Allow columns to be displayed in expandable sub-rows</span>
        </div>
        <Switch
          checked={preferences.enableSubRowConfig || false}
          onCheckedChange={handleSubRowConfigToggle}
        />
      </div>

      {/* Sub-row bulk actions */}
      {preferences.enableSubRowConfig && (
        <div className="mb-4 p-3 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#6f42c1' }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="small font-weight-medium" style={{ color: '#6f42c1' }}>Sub-row Actions</span>
            <span className="text-muted" style={{ fontSize: '0.75rem', color: '#6f42c1' }}>
              {preferences.subRowColumns?.length || 0} selected
            </span>
          </div>
          <div className="d-flex">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAllSubRows}
              className="btn btn-sm btn-outline-secondary flex-fill mr-2"
              style={{ fontSize: '0.75rem' }}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAllSubRows}
              className="btn btn-sm btn-outline-secondary flex-fill"
              style={{ fontSize: '0.75rem' }}
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}
      
      <div style={{ maxHeight: '288px', overflowY: 'auto' }}>
        {orderedColumns.map((column) => {
          const isHidden = preferences.hiddenColumns.includes(column.id);
          const isSubRow = preferences.subRowColumns?.includes(column.id) || false;
          const customHeader = preferences.columnHeaders[column.id];
          const displayHeader = customHeader || column.header;

          return (
            <div
              key={column.id}
              className="border rounded p-3 mb-2"
              style={{ cursor: 'move' }}
              draggable
              onDragStart={() => handleDragStart(column.id)}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div className="d-flex align-items-center">
                <GripVertical className="text-muted mr-2" style={{ width: '16px', height: '16px', cursor: 'move' }} />
                
                <Checkbox
                  checked={!isHidden}
                  onCheckedChange={() => onColumnVisibilityToggle(column.id)}
                  disabled={column.mandatory}
                  className="mr-2"
                />

                {isHidden ? (
                  <EyeOff className="text-muted mr-2" style={{ width: '16px', height: '16px' }} />
                ) : (
                  <Eye className="text-success mr-2" style={{ width: '16px', height: '16px' }} />
                )}

                {/* Sub-row icon indicator */}
                {isSubRow && (
                  <ChevronDown className="mr-2" style={{ width: '16px', height: '16px', color: '#6f42c1' }} />
                )}

                <div className="flex-fill" style={{ minWidth: 0 }}>
                  {editingHeader === column.id ? (
                    <Input
                      defaultValue={displayHeader}
                      onBlur={(e) => handleHeaderSave(column.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleHeaderSave(column.id, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                          setEditingHeader(null);
                        }
                      }}
                      className="form-control form-control-sm"
                      style={{ height: '24px', padding: '2px 4px', fontSize: '0.875rem' }}
                      autoFocus
                    />
                  ) : (
                    <div className="d-flex align-items-center">
                      <span className="small text-truncate">{displayHeader}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingHeader(column.id)}
                        className="btn btn-sm btn-link p-0 ml-1"
                        style={{ width: '16px', height: '16px' }}
                      >
                        <Edit2 style={{ width: '12px', height: '12px' }} />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center">
                  {column.mandatory && (
                    <span className="badge badge-warning mr-2" style={{ fontSize: '0.75rem' }}>
                      Required
                    </span>
                  )}

                  {/* Sub-row checkbox moved to the end */}
                  {preferences.enableSubRowConfig && (
                    <div className="d-flex align-items-center">
                      <Checkbox
                        checked={isSubRow}
                        onCheckedChange={() => handleSubRowToggle(column.id)}
                        className="mr-1"
                      />
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Sub-row</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary section */}
      <div className="mt-4 pt-3 border-top small text-muted">
        <div className="d-flex justify-content-between">
          <span>Visible columns:</span>
          <span className="font-weight-medium">{orderedColumns.length - preferences.hiddenColumns.length}</span>
        </div>
        {preferences.enableSubRowConfig && (
          <div className="d-flex justify-content-between">
            <span>Sub-row columns:</span>
            <span className="font-weight-medium">{preferences.subRowColumns?.length || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
}
