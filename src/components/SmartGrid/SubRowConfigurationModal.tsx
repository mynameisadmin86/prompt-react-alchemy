
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { Column, GridPreferences } from '@/types/smartgrid';

interface SubRowConfigurationModalProps<T> {
  columns: Column<T>[];
  preferences: GridPreferences;
  onSubRowToggle: (columnId: string) => void;
  onSubRowConfigToggle: (enabled: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function SubRowConfigurationModal<T>({
  columns,
  preferences,
  onSubRowToggle,
  onSubRowConfigToggle,
  onSelectAll,
  onDeselectAll
}: SubRowConfigurationModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const subRowColumns = preferences.subRowColumns || [];
  const isSubRowEnabled = preferences.enableSubRowConfig || false;
  const availableColumns = columns.filter(col => !preferences.hiddenColumns.includes(col.id));

  const handleSelectAll = () => {
    onSelectAll();
  };

  const handleDeselectAll = () => {
    onDeselectAll();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <LayoutGrid className="h-4 w-4" />
          <span>Sub-row Config</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sub-row Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Master toggle for sub-row functionality */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Enable Sub-row Display</span>
              <span className="text-xs text-gray-500">Allow columns to be displayed in expandable sub-rows</span>
            </div>
            <Switch
              checked={isSubRowEnabled}
              onCheckedChange={onSubRowConfigToggle}
            />
          </div>

          {isSubRowEnabled && (
            <>
              {/* Bulk actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex-1"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="flex-1"
                >
                  Deselect All
                </Button>
              </div>

              {/* Column list */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Select columns to display in sub-rows:
                </div>
                
                {availableColumns.map((column) => {
                  const isSubRow = subRowColumns.includes(column.id);
                  const customHeader = preferences.columnHeaders[column.id];
                  const displayHeader = customHeader || column.header;

                  return (
                    <div
                      key={column.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <Checkbox
                        checked={isSubRow}
                        onCheckedChange={() => onSubRowToggle(column.id)}
                        disabled={column.mandatory}
                      />
                      
                      {isSubRow && (
                        <ChevronDown className="h-4 w-4 text-purple-600" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-900 truncate">
                          {displayHeader}
                        </span>
                        {column.mandatory && (
                          <span className="ml-2 text-xs text-orange-600 font-medium bg-orange-50 px-1 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="pt-3 border-t text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Sub-row columns:</span>
                  <span className="font-medium">{subRowColumns.length}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
