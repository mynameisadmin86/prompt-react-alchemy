import React, { useState, useEffect } from 'react';
import { Controller, Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { InputDropdown } from '@/components/ui/input-dropdown';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicLazySelect } from './DynamicLazySelect';
import { SearchableSelect } from './SearchableSelect';
import { Search, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FieldConfig } from '@/types/dynamicPanel';

interface FieldRendererProps {
  config: FieldConfig;
  control: Control<any>;
  fieldId: string;
  tabIndex?: number;
  validationErrors?: Record<string, string>;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  config,
  control,
  fieldId,
  tabIndex,
  validationErrors = {}
}) => {
  const { fieldType, editable, placeholder, options, color, fieldColour, events, style } = config;

  const searchData: string[] | undefined = (config as any).searchData;
  
  // Helper function to create event handlers that include field value
  const createEventHandlers = (field: any) => ({
    onClick: events?.onClick ? (e: React.MouseEvent) => events.onClick?.(e, field.value) : undefined,
    onChange: events?.onChange ? (e: React.ChangeEvent<any>) => {
      field.onChange(e); // Call react-hook-form's onChange first
      events.onChange?.(e.target.value, e);
    } : field.onChange,
    onFocus: events?.onFocus,
    onBlur: events?.onBlur,
    onKeyDown: events?.onKeyDown,
    onKeyUp: events?.onKeyUp,
    onMouseEnter: events?.onMouseEnter,
    onMouseLeave: events?.onMouseLeave,
  });

  if (!editable) {
    return (
      <Controller
        name={fieldId}
        control={control}
        render={({ field }) => (
          <div style={style}>
            <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
            <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border min-h-[32px] flex items-center">
              {field.value || '-'}
            </div>
          </div>
        )}
      />
    );
  }

  const hasError = validationErrors[fieldId];
  const baseInputClasses = `h-8 text-xs focus:ring-1 focus:z-50 focus:relative focus:outline-none ${
    hasError 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }`;

// --- UPDATED: search fieldType with suggestions ---
  if (fieldType === 'search') {
    return (
      <Controller
        name={fieldId}
        control={control}
        render={({ field }) => {
          const [inputValue, setInputValue] = useState(field.value || '');
          const [showSuggestions, setShowSuggestions] = useState(false);

          useEffect(() => {
            setInputValue(field.value || '');
          }, [field.value]);

          // Use the searchData array from config
          const suggestions: string[] = searchData || [];
          const filteredSuggestions = inputValue
            ? suggestions.filter(item =>
                item.toLowerCase().includes(inputValue.toLowerCase())
              )
            : [];

          // const borderClass = getFieldBorderClass(mandatory, inputValue);

          return (
            <div className="relative focus-within:z-50">
              <Input
                type="search"
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                  field.onChange(e.target.value);
                  setShowSuggestions(true);
                  events?.onChange?.(e.target.value, e);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder || 'Search...'}
                className={`pr-8 h-8 text-[13px] rounded-md ${
                  hasError 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                tabIndex={tabIndex}
                autoComplete="off"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul
                  className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow z-50 mt-1 max-h-40 overflow-y-auto text-xs"
                  style={{ listStyle: 'none', margin: 0, padding: 0 }}
                >
                  {filteredSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      onMouseDown={() => {
                        setInputValue(suggestion);
                        field.onChange(suggestion);
                        setShowSuggestions(false);
                        events?.onChange?.(suggestion, { target: { value: suggestion } } as any);
                      }}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }}
      />
    );
  }
  // --- END UPDATED ---
  
  switch (fieldType) {
    case 'text':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const eventHandlers = createEventHandlers(field);
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <Input
                  type="text"
                  {...field}
                  {...eventHandlers}
                  placeholder={placeholder}
                  className={baseInputClasses}
                  tabIndex={tabIndex}
                />
              </div>
            );
          }}
        />
      );

    case 'textarea':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const eventHandlers = createEventHandlers(field);
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <Textarea
                  {...field}
                  {...eventHandlers}
                  placeholder={placeholder}
                  className={`min-h-[60px] text-xs focus:ring-1 focus:z-50 focus:relative focus:outline-none ${
                    hasError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  tabIndex={tabIndex}
                />
              </div>
            );
          }}
        />
      );

    case 'radio':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const eventHandlers = createEventHandlers(field);
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <RadioGroup
                  value={field.value || ''}
                  onValueChange={(value) => {
                    field.onChange(value);
                    events?.onChange?.(value, { target: { value } } as any);
                  }}
                  className="flex gap-4 focus-within:z-50 relative"
                  {...(events && { 
                    onClick: events.onClick && ((e: React.MouseEvent) => events.onClick!(e, field.value)),
                    onFocus: events.onFocus,
                    onBlur: events.onBlur
                  })}
                >
                  {options?.map((option, index) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.value} 
                        id={`${config.id}-${option.value}`} 
                        tabIndex={index === 0 ? tabIndex : -1}
                      />
                      <Label htmlFor={`${config.id}-${option.value}`} className="text-xs">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            );
          }}
        />
      );

    case 'select':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const eventHandlers = createEventHandlers(field);
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <div className="relative focus-within:z-50">
                  <select
                    {...field}
                    {...eventHandlers}
                    className={`w-full h-8 px-3 text-xs rounded-md border bg-white focus:ring-1 focus:z-50 focus:relative focus:outline-none appearance-none ${
                      hasError 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    tabIndex={tabIndex}
                  >
                    <option value="">Select...</option>
                    {options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          }}
        />
      );

    case 'lazyselect':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const fetchOptions = config.fetchOptions;
            if (!fetchOptions) {
              return (
                <div>
                  <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded border">
                    fetchOptions is required for lazyselect field type
                  </div>
                </div>
              );
            }

            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <DynamicLazySelect
                  fetchOptions={fetchOptions}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    if (events?.onChange) {
                      const selectedOption = value ? { label: '', value } : null;
                      events.onChange(selectedOption, { target: { value } } as any);
                    }
                  }}
                  placeholder={placeholder || 'Select...'}
                  className={`h-8 text-xs focus:ring-1 ${
                    hasError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  tabIndex={tabIndex}
                  onClick={events?.onClick}
                  onFocus={events?.onFocus}
                  onBlur={events?.onBlur}
                  hideSearch={config.hideSearch}
                  disableLazyLoading={config.disableLazyLoading}
                />
              </div>
            );
          }}
        />
      );

    case 'date':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const dateValue = field.value ? new Date(field.value) : undefined;
            const dateFormat = config.dateFormat || "PPP"; // Default to "PPP" if no format specified
            
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <div className="relative focus-within:z-50">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-8 justify-start text-left font-normal text-xs px-3 pr-8",
                          !dateValue && "text-muted-foreground",
                          hasError 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        )}
                        tabIndex={tabIndex}
                        onClick={events?.onClick ? (e) => events.onClick!(e, field.value) : undefined}
                        onFocus={events?.onFocus}
                        onBlur={events?.onBlur}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {dateValue ? format(dateValue, dateFormat) : <span>{placeholder || "Pick a date"}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={(date) => {
                          const dateString = date ? format(date, 'yyyy-MM-dd') : '';
                          field.onChange(dateString);
                          events?.onChange?.(dateString, { target: { value: dateString } } as any);
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  {dateValue && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange('');
                        events?.onChange?.('', { target: { value: '' } } as any);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          }}
        />
      );

    case 'time':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const eventHandlers = createEventHandlers(field);
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <div className="relative focus-within:z-50">
                  <Input
                    type="time"
                    {...field}
                    {...eventHandlers}
                    className={baseInputClasses}
                    tabIndex={tabIndex}
                  />
                  <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            );
          }}
        />
      );

    case 'currency':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const eventHandlers = createEventHandlers(field);
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <div className="relative focus-within:z-50">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                    €
                  </span>
                  <Input
                    type="number"
                    {...field}
                    {...eventHandlers}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      field.onChange(value);
                      events?.onChange?.(value, e);
                    }}
                    placeholder="0.00"
                    className={`${baseInputClasses} pl-6`}
                    step="0.01"
                    tabIndex={tabIndex}
                  />
                </div>
              </div>
            );
          }}
        />
      );

    case 'card':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const cardStyle = color ? {
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              borderColor: `${color}40`
            } : {};
            
            return (
              <div 
                className="border rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                style={color ? { ...cardStyle, ...style } : style}
                onClick={events?.onClick ? (e) => events.onClick!(e, field.value) : undefined}
                onMouseEnter={events?.onMouseEnter}
                onMouseLeave={events?.onMouseLeave}
              >
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {config.label}
                </div>
                <div 
                  className="text-lg font-bold"
                  style={{ color: fieldColour || 'inherit' }}
                >
                  {field.value || '€ 0.00'}
                </div>
              </div>
            );
          }}
        />
      );

    case 'inputdropdown':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const eventHandlers = createEventHandlers(field);
            const fieldValue = field.value || {};
            
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <InputDropdown
                  value={fieldValue}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                    events?.onChange?.(newValue, { target: { value: newValue } } as any);
                  }}
                  options={options}
                  placeholder={placeholder}
                  tabIndex={tabIndex}
                  onDropdownClick={events?.onClick ? (e) => events.onClick!(e, fieldValue) : undefined}
                  onInputClick={events?.onClick ? (e) => events.onClick!(e, fieldValue) : undefined}
                  onFocus={events?.onFocus}
                  onBlur={events?.onBlur}
                  onKeyDown={events?.onKeyDown}
                  onKeyUp={events?.onKeyUp}
                />
              </div>
            );
          }}
        />
      );

    case 'searchableselect':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const localOptions = config.localOptions;
            if (!localOptions) {
              return (
                <div>
                  <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded border">
                    localOptions is required for searchableselect field type
                  </div>
                </div>
              );
            }

            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <SearchableSelect
                  options={localOptions}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    if (events?.onChange) {
                      events.onChange(value, { target: { value } } as any);
                    }
                  }}
                  placeholder={placeholder || 'Select...'}
                  className={`h-8 text-xs focus:ring-1 ${
                    hasError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  tabIndex={tabIndex}
                  onClick={events?.onClick}
                  onFocus={events?.onFocus}
                  onBlur={events?.onBlur}
                />
              </div>
            );
          }}
        />
      );

    case 'switch':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2" style={style}>
              <Switch
                checked={!!field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (events?.onChange) {
                    events.onChange(checked, { target: { value: checked } } as any);
                  }
                }}
                tabIndex={tabIndex}
              />
              <span className="text-sm font-medium text-foreground">{config.label}</span>
            </div>
          )}
        />
      );

    default:
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => {
            const eventHandlers = createEventHandlers(field);
            return (
              <div style={style}>
                <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
                <Input
                  type="text"
                  {...field}
                  {...eventHandlers}
                  placeholder={placeholder}
                  className={baseInputClasses}
                  tabIndex={tabIndex}
                />
              </div>
            );
          }}
        />
      );
  }
};
