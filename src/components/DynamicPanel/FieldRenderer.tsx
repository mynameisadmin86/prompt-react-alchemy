import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Clock, ChevronDown } from 'lucide-react';
import { FieldConfig } from '@/types/dynamicPanel';

interface FieldRendererProps {
  config: FieldConfig;
  value: any;
  onChange: (value: any) => void;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  config,
  value,
  onChange
}) => {
  const { fieldType, editable, placeholder, options, currencySymbol = '€', step = 0.01, min, max, searchable, summaryConfig } = config;

  if (!editable) {
    return (
      <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border min-h-[32px] flex items-center">
        {value || '-'}
      </div>
    );
  }

  const baseInputClasses = "h-8 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  switch (fieldType) {
    case 'text':
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseInputClasses}
        />
      );

    case 'textarea':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[60px] text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      );

    case 'radio':
      return (
        <RadioGroup
          value={value || ''}
          onValueChange={onChange}
          className="flex gap-4"
        >
          {options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${config.id}-${option.value}`} />
              <Label htmlFor={`${config.id}-${option.value}`} className="text-xs">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'select':
      return (
        <div className="relative">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 px-3 text-xs rounded-md border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
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
      );

    case 'date':
      return (
        <div className="relative">
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
          />
          <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
      );

    case 'time':
      return (
        <div className="relative">
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
          />
          <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
      );

    case 'currency':
      return (
        <div className="relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
            €
          </span>
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={`${baseInputClasses} pl-6`}
            step="0.01"
          />
        </div>
      );

    case 'search':
      return (
        <div className="relative">
          <Input
            type="search"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Search...'}
            className={`${baseInputClasses} pr-8`}
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
      );

    case 'number':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          className={baseInputClasses}
          step={step}
          min={min}
          max={max}
        />
      );

    case 'currency-with-select':
      return (
        <div className="flex gap-1">
          <Select value={currencySymbol} onValueChange={() => {}}>
            <SelectTrigger className="w-12 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="€">€</SelectItem>
              <SelectItem value="$">$</SelectItem>
              <SelectItem value="£">£</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={`${baseInputClasses} flex-1`}
            step={step}
          />
        </div>
      );

    case 'search-with-icon':
      return (
        <div className="relative">
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Search...'}
            className={`${baseInputClasses} pr-8`}
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      );

    case 'dropdown-with-search':
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className={`${baseInputClasses} text-left`}>
            <SelectValue placeholder={placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'summary-card':
      return (
        <div className={`grid grid-cols-2 gap-4 p-3 rounded-lg ${summaryConfig?.backgroundColor || 'bg-muted/50'}`}>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              {summaryConfig?.mainLabel || 'Contract Price'}
            </div>
            <div className="font-medium text-sm">
              {summaryConfig?.mainValue || value?.main || '€ 0.00'}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              {summaryConfig?.subLabel || 'Net Amount'}
            </div>
            <div className="font-medium text-sm">
              {summaryConfig?.subValue || value?.sub || '€ 0.00'}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseInputClasses}
        />
      );
  }
};
