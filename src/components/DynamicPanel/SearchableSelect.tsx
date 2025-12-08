import React, { useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string | string[];
  onChange: (value: string | string[] | undefined) => void;
  placeholder?: string;
  multiSelect?: boolean;
  disabled?: boolean;
  className?: string;
  tabIndex?: number;
  onClick?: (e: React.MouseEvent, value: any) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  allowAddNew?: boolean; // Enable adding new items not in the list
  onAddNew?: (newValue: string) => Promise<void> | void; // Callback when adding new item
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  multiSelect = false,
  disabled = false,
  className,
  tabIndex,
  onClick,
  onFocus,
  onBlur,
  allowAddNew = false,
  onAddNew,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm('');
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter(v => v !== selectedValue)
        : [...currentValues, selectedValue];
      onChange(newValues.length > 0 ? newValues : undefined);
    } else {
      onChange(selectedValue);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setSearchTerm(''); // Clear the search box as well
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen && onClick) {
      onClick(e, value);
    }
  };

  // Check if search term matches any existing option
  const isSearchTermInOptions = useCallback(() => {
    if (!searchTerm.trim()) return true;
    const lowerSearch = searchTerm.toLowerCase().trim();
    return options.some(opt => 
      opt.label.toLowerCase() === lowerSearch || 
      opt.value.toLowerCase() === lowerSearch ||
      opt.label.toLowerCase().includes(lowerSearch) ||
      opt.value.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, options]);

  // Handle adding new item
  const handleAddNew = async () => {
    if (!searchTerm.trim() || !onAddNew) return;
    
    setIsAddingNew(true);
    try {
      await onAddNew(searchTerm.trim());
      onChange(searchTerm.trim());
      setSearchTerm('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add new item:', error);
    } finally {
      setIsAddingNew(false);
    }
  };

  // Handle Enter key for adding new item
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allowAddNew && searchTerm.trim() && !isSearchTermInOptions() && onAddNew) {
      e.preventDefault();
      handleAddNew();
    }
  };

  const showAddNewOption = allowAddNew && searchTerm.trim() && filteredOptions.length === 0;

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (multiSelect && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option?.label || value[0];
      }
      return `${value.length} items selected`;
    } else if (typeof value === 'string') {
      const option = options.find(opt => opt.value === value);
      return option?.label || value;
    }
    
    return placeholder;
  };

  const isSelected = (optionValue: string) => {
    if (multiSelect && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  const hasValue = multiSelect 
    ? Array.isArray(value) && value.length > 0
    : Boolean(value);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          type="button"
          aria-expanded={isOpen}
          className={cn(
            "w-full justify-between text-left font-normal group",
            !hasValue && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          tabIndex={tabIndex}
          onClick={handleButtonClick}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span className="truncate">{getDisplayValue()}</span>
          <div className="flex items-center gap-1">
            {hasValue && (
              <X
                className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                onClick={handleClear}
              />
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50 bg-background" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder={allowAddNew ? "Search or add new..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="h-8"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {/* Add New Option */}
          {showAddNewOption && (
            <div
              className={cn(
                "flex items-center space-x-2 px-2 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b",
                isAddingNew && "opacity-50 pointer-events-none"
              )}
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4 text-primary" />
              <span className="flex-1 truncate text-sm font-medium text-primary">
                Add "{searchTerm.trim()}"
              </span>
              {isAddingNew && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
          )}
          
          {filteredOptions.length === 0 && !showAddNewOption ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {searchTerm ? 'No results found.' : 'No options available.'}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-2 px-2 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  isSelected(option.value) && "bg-accent"
                )}
                onClick={() => handleSelect(option.value)}
              >
                {multiSelect && (
                  <Checkbox
                    checked={isSelected(option.value)}
                    onChange={() => {}}
                  />
                )}
                <span className="flex-1 truncate">{option.label}</span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}