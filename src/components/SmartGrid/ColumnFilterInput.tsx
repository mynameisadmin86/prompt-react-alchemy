
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FilterValue } from '@/types/filterSystem';
import { GridColumnConfig } from '@/types/smartgrid';
import { DateRange } from 'react-day-picker';

interface ColumnFilterInputProps {
  column: GridColumnConfig;
  value: FilterValue | undefined;
  onChange: (value: FilterValue | undefined) => void;
  onApply?: () => void;
  isSubRow?: boolean;
  showFilterTypeDropdown?: boolean;
}

export function ColumnFilterInput({ 
  column, 
  value, 
  onChange, 
  onApply,
  isSubRow = false,
  showFilterTypeDropdown = true
}: ColumnFilterInputProps) {
  const [localValue, setLocalValue] = useState<any>(value?.value || '');
  const [operator, setOperator] = useState<string>(value?.operator || getDefaultOperator());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [rangeFrom, setRangeFrom] = useState<string>('');
  const [rangeTo, setRangeTo] = useState<string>('');
  const [dropdownValue, setDropdownValue] = useState<string>('');
  const [textValue, setTextValue] = useState<string>('');
  const [dropdownMode, setDropdownMode] = useState<'dropdown' | 'text'>('dropdown');

  useEffect(() => {
    setLocalValue(value?.value || '');
    setOperator(value?.operator || getDefaultOperator());
    
    // Initialize complex field values
    if (value?.value && typeof value.value === 'object') {
      if (column.type === 'NumberRange') {
        setRangeFrom(value.value.from || '');
        setRangeTo(value.value.to || '');
      } else if (column.type === 'DropdownText') {
        setDropdownValue(value.value.dropdown || '');
        setTextValue(value.value.text || '');
      }
    } else {
      setRangeFrom('');
      setRangeTo('');
      setDropdownValue('');
      setTextValue('');
    }
  }, [value, column.type]);

  function getDefaultOperator(): string {
    switch (column.type) {
      case 'Date':
      case 'DateTimeRange':
      case 'DateRange':
        return 'equals';
      case 'NumberRange':
        return 'between';
      default:
        return 'contains';
    }
  }

  const handleValueChange = (newValue: any) => {
    setLocalValue(newValue);
    
    if (newValue === '' || newValue == null) {
      onChange(undefined);
    } else {
      onChange({
        value: newValue,
        operator: operator as any,
        type: getFilterType()
      });
    }
  };

  const handleOperatorChange = (newOperator: string) => {
    setOperator(newOperator);
    if (localValue !== '' && localValue != null) {
      onChange({
        value: localValue,
        operator: newOperator as any,
        type: getFilterType()
      });
    }
  };

  const getFilterType = (): FilterValue['type'] => {
    switch (column.type) {
      case 'Date':
      case 'DateTimeRange':
        return 'date';
      case 'DateRange':
        return 'dateRange';
      case 'NumberRange':
        return 'number';
      case 'Dropdown':
        return 'select';
      default:
        return 'text';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Remove auto-search on Enter key press
    // Search will only happen on Search button click
  };

  const handleClear = () => {
    setLocalValue('');
    setRangeFrom('');
    setRangeTo('');
    setDropdownValue('');
    setTextValue('');
    setDropdownMode('dropdown');
    onChange(undefined);
    // onApply will be called automatically when the parent updates filters
  };

  const getAvailableOperators = () => {
    switch (column.type) {
      case 'Date':
      case 'DateTimeRange':
        return [
          { value: 'equals', label: 'Equals (=)', symbol: '=' },
          { value: 'gt', label: 'Greater than (>)', symbol: '>' },
          { value: 'lt', label: 'Less than (<)', symbol: '<' },
          { value: 'gte', label: 'Greater or equal (>=)', symbol: '>=' },
          { value: 'lte', label: 'Less or equal (<=)', symbol: '<=' },
        ];
      case 'DateRange':
      case 'NumberRange':
        return [
          { value: 'between', label: 'Between', symbol: '⟷' },
        ];
      default:
        return [
          { value: 'contains', label: 'Contains', symbol: '⊃' },
          { value: 'equals', label: 'Equals', symbol: '=' },
          { value: 'startsWith', label: 'Starts with', symbol: '⌐' },
          { value: 'endsWith', label: 'Ends with', symbol: '¬' },
        ];
    }
  };

  const getCurrentOperatorSymbol = () => {
    const operators = getAvailableOperators();
    const current = operators.find(op => op.value === operator);
    return current?.symbol || '⊃';
  };

  const handleRangeChange = (from: string, to: string) => {
    setRangeFrom(from);
    setRangeTo(to);
    
    if (from === '' && to === '') {
      onChange(undefined);
    } else {
      onChange({
        value: { from, to },
        operator: 'between' as any,
        type: 'number'
      });
    }
  };

  const handleDropdownTextChange = (dropdown: string, text: string, mode?: 'dropdown' | 'text') => {
    if (mode) setDropdownMode(mode);
    
    let finalValue = '';
    if (mode === 'dropdown' || dropdownMode === 'dropdown') {
      finalValue = dropdown;
      setDropdownValue(dropdown);
      setTextValue(''); // Clear text when using dropdown
    } else {
      finalValue = text;
      setTextValue(text);
      setDropdownValue(''); // Clear dropdown when using text
    }
    
    if (finalValue === '') {
      onChange(undefined);
    } else {
      onChange({
        value: finalValue,
        operator: 'contains' as any,
        type: 'text'
      });
    }
  };

  const renderFilterInput = () => {
    switch (column.type) {
      case 'Dropdown':
        return (
          <Select value={localValue || "__all__"} onValueChange={(value) => handleValueChange(value === "__all__" ? "" : value)}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="__all__" className="text-xs">All</SelectItem>
              {column.options?.map(option => (
                <SelectItem key={option} value={option} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'Date':
      case 'DateTimeRange':
        return (
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-7 text-xs justify-start text-left font-normal",
                  !localValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {localValue ? format(new Date(localValue), "MMM dd, yyyy") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
              <Calendar
                mode="single"
                selected={localValue ? new Date(localValue) : undefined}
                onSelect={(date) => {
                  handleValueChange(date ? date.toISOString() : '');
                  setShowDatePicker(false);
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        );

      case 'DateRange':
        return (
          <Popover open={showDateRangePicker} onOpenChange={setShowDateRangePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-7 text-xs justify-start text-left font-normal w-full",
                  !localValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {localValue?.from && localValue?.to 
                  ? `${format(new Date(localValue.from), "MMM dd")} - ${format(new Date(localValue.to), "MMM dd, yyyy")}`
                  : "Pick date range"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-[100]" align="start">
              <Calendar
                mode="range"
                selected={localValue?.from && localValue?.to ? {
                  from: new Date(localValue.from),
                  to: new Date(localValue.to)
                } : undefined}
                onSelect={(range) => {
                  if (range?.from) {
                    if (range?.to) {
                      // Both dates selected
                      handleValueChange({
                        from: range.from.toISOString(),
                        to: range.to.toISOString()
                      });
                      setShowDateRangePicker(false);
                    } else {
                      // Only from date selected, keep picker open
                      handleValueChange({
                        from: range.from.toISOString(),
                        to: ''
                      });
                    }
                  } else {
                    // Clear selection
                    handleValueChange(undefined);
                  }
                }}
                numberOfMonths={2}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        );

      case 'NumberRange':
        return (
          <div className="flex items-center gap-1">
            <Input
              value={rangeFrom}
              onChange={(e) => handleRangeChange(e.target.value, rangeTo)}
              placeholder="From"
              className="h-7 text-xs flex-1"
              type="number"
            />
            <span className="text-xs text-muted-foreground">-</span>
            <Input
              value={rangeTo}
              onChange={(e) => handleRangeChange(rangeFrom, e.target.value)}
              placeholder="To"
              className="h-7 text-xs flex-1"
              type="number"
            />
          </div>
        );

      case 'DropdownText':
        return (
          <div className="flex items-center gap-1">
            <Select 
              value={dropdownMode === 'dropdown' ? (dropdownValue || "__all__") : "__all__"} 
              onValueChange={(value) => {
                const newValue = value === "__all__" ? "" : value;
                handleDropdownTextChange(newValue, textValue, 'dropdown');
              }}
              disabled={dropdownMode === 'text'}
            >
              <SelectTrigger className={cn("h-7 text-xs flex-1", dropdownMode === 'text' && "opacity-50")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="__all__" className="text-xs">All</SelectItem>
                {column.options?.map(option => (
                  <SelectItem key={option} value={option} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">OR</div>
            <Input
              value={dropdownMode === 'text' ? textValue : ''}
              onChange={(e) => handleDropdownTextChange(dropdownValue, e.target.value, 'text')}
              placeholder="Type text..."
              className={cn("h-7 text-xs flex-1", dropdownMode === 'dropdown' && "opacity-50")}
              disabled={dropdownMode === 'dropdown'}
            />
          </div>
        );

      default:
        return (
          <Input
            value={localValue}
            onChange={(e) => handleValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Filter ${column.label.toLowerCase()}...`}
            className="h-7 text-xs"
          />
        );
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-1 p-1 bg-white rounded border shadow-sm transition-all",
      isSubRow && "bg-blue-50 border-blue-200"
    )}>
      {/* Operator symbol with dropdown - only show if enabled */}
      {showFilterTypeDropdown && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-2 p-0 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors flex items-center justify-center"
              title="Change filter operator"
            >
              <span className="text-xs font-medium">{getCurrentOperatorSymbol()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border shadow-lg z-50" align="start">
            {getAvailableOperators().map(op => (
              <DropdownMenuItem
                key={op.value}
                onClick={() => handleOperatorChange(op.value)}
                className={cn(
                  "text-xs cursor-pointer",
                  operator === op.value && "bg-blue-50 text-blue-700"
                )}
              >
                <span className="mr-2">{op.symbol}</span>
                {op.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="flex-1">
        {renderFilterInput()}
      </div>
      
      {((localValue !== '' && localValue != null) || rangeFrom !== '' || rangeTo !== '' || dropdownValue !== '' || textValue !== '') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-6 w-6 p-0 hover:bg-red-100"
        >
          <X className="h-3 w-3 text-red-500" />
        </Button>
      )}
    </div>
  );
}
