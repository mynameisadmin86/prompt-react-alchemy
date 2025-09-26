import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X } from 'lucide-react';
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
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen && onClick) {
      onClick(e, value);
    }
  };

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
            "w-full justify-between text-left font-normal",
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
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
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
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
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