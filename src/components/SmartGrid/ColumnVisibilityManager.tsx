
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings2, Eye, EyeOff, Search, RotateCcw, ChevronDown, Edit2, Check, X } from 'lucide-react';
import { GridColumnConfig, GridPreferences } from '@/types/smartgrid';
import { cn } from '@/lib/utils';

interface ColumnVisibilityManagerProps {
  columns: GridColumnConfig[];
  preferences: GridPreferences;
  onColumnVisibilityToggle: (columnId: string) => void;
  onSubRowToggle?: (columnId: string) => void;
  onColumnHeaderChange?: (columnId: string, newHeader: string) => void;
  onResetToDefaults: () => void;
}

export function ColumnVisibilityManager({
  columns,
  preferences,
  onColumnVisibilityToggle,
  onSubRowToggle,
  onColumnHeaderChange,
  onResetToDefaults
}: ColumnVisibilityManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const filteredColumns = columns.filter(column =>
    column.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    column.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCount = columns.filter(col => !preferences.hiddenColumns.includes(col.key)).length;
  const totalCount = columns.length;

  const handleToggleAll = () => {
    const allVisible = preferences.hiddenColumns.length === 0;
    const mandatoryColumns = columns.filter(col => col.mandatory).map(col => col.key);
    
    if (allVisible) {
      // Hide all non-mandatory columns
      columns.forEach(col => {
        if (!col.mandatory) {
          onColumnVisibilityToggle(col.key);
        }
      });
    } else {
      // Show all columns
      preferences.hiddenColumns.forEach(columnId => {
        onColumnVisibilityToggle(columnId);
      });
    }
  };

  const handleStartEditing = (columnKey: string, currentLabel: string) => {
    setEditingHeader(columnKey);
    setEditingValue(preferences.columnHeaders[columnKey] || currentLabel);
  };

  const handleSaveHeader = (columnKey: string) => {
    if (onColumnHeaderChange && editingValue.trim()) {
      onColumnHeaderChange(columnKey, editingValue.trim());
    }
    setEditingHeader(null);
    setEditingValue('');
  };

  const handleCancelEditing = () => {
    setEditingHeader(null);
    setEditingValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Settings2 className="h-4 w-4" />
          <span>Columns ({visibleCount}/{totalCount})</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>Configure Columns</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToDefaults}
              className="text-gray-600 hover:text-gray-900"
              title="Reset to defaults"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 flex-1 min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Toggle All */}
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Toggle All</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleAll}
              className="text-xs"
            >
              {preferences.hiddenColumns.length === 0 ? 'Hide All' : 'Show All'}
            </Button>
          </div>

          {/* Column List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredColumns.map((column) => {
              const isVisible = !preferences.hiddenColumns.includes(column.key);
              const isMandatory = column.mandatory;
              const isCollapsibleChild = column.collapsibleChild;
              const customHeader = preferences.columnHeaders[column.key];
              const displayHeader = customHeader || column.label;

              return (
                <div
                  key={column.key}
                  className={cn(
                    "flex flex-col p-3 rounded-lg border transition-colors space-y-3",
                    isVisible ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Checkbox
                        checked={isVisible}
                        onCheckedChange={() => !isMandatory && onColumnVisibilityToggle(column.key)}
                        disabled={isMandatory}
                        className="flex-shrink-0"
                      />
                      
                      <div className="flex items-center space-x-2 min-w-0">
                        {isVisible ? (
                          <Eye className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        
                        <div className="min-w-0 flex-1">
                          {editingHeader === column.key ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveHeader(column.key);
                                  } else if (e.key === 'Escape') {
                                    handleCancelEditing();
                                  }
                                }}
                                className="h-6 text-sm flex-1"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSaveHeader(column.key)}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEditing}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div>
                                <div className="font-medium text-sm truncate">
                                  {displayHeader}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {column.key}
                                </div>
                              </div>
                              {onColumnHeaderChange && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleStartEditing(column.key, column.label)}
                                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                                  title="Edit column header"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {isMandatory && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                          Required
                        </span>
                      )}
                      
                      {column.type && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {column.type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sub-row setting */}
                  {isVisible && !isMandatory && onSubRowToggle && (
                    <div className="flex items-center justify-between pl-6 pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <ChevronDown className="h-3 w-3 text-purple-600" />
                        <span className="text-xs text-gray-600">Show in sub-row</span>
                      </div>
                      <Checkbox
                        checked={isCollapsibleChild}
                        onCheckedChange={() => onSubRowToggle(column.key)}
                        className="h-4 w-4"
                      />
                    </div>
                  )}

                  {isCollapsibleChild && (
                    <div className="pl-6">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium flex items-center gap-1 inline-flex">
                        <ChevronDown className="h-3 w-3" />
                        Sub-row
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredColumns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No columns found matching "{searchTerm}"</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="pt-4 border-t bg-gray-50 rounded-lg px-4 py-3">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Visible columns:</span>
                <span className="font-medium">{visibleCount} of {totalCount}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Hidden columns:</span>
                <span className="font-medium">{totalCount - visibleCount}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Sub-row columns:</span>
                <span className="font-medium">{columns.filter(col => col.collapsibleChild).length}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
