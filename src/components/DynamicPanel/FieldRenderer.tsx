import React, { useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, Calendar, Clock } from 'lucide-react';
import { FieldConfig } from '@/types/dynamicPanel';

interface FieldRendererProps {
  config: FieldConfig;
  fieldId: string;
  tabIndex?: number;
  value?: any;
  onChange?: (value: any) => void;
}

const FieldRendererComponent: React.FC<FieldRendererProps> = ({
  config,
  fieldId,
  tabIndex,
  value,
  onChange
}) => {
  console.log(`FieldRenderer render: ${fieldId}, value: ${value}`);
  const { fieldType, editable, placeholder, options, color, fieldColour } = config;

  // Use useRef to keep the latest onChange without causing re-renders
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleChange = useCallback((newValue: any) => {
    console.log(`FieldRenderer handleChange: ${fieldId} = ${newValue}`);
    onChangeRef.current?.(newValue);
  }, [fieldId]);

  if (!editable) {
    return (
      <div>
        <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
        <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border min-h-[32px] flex items-center">
          {value || config.value || '-'}
        </div>
      </div>
    );
  }

  const baseInputClasses = "h-8 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:z-50 focus:relative focus:outline-none";

  switch (fieldType) {
    case 'text':
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
            <Input
              type="text"
              value={value || config.value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className={baseInputClasses}
              tabIndex={tabIndex}
            />
        </div>
      );

    case 'textarea':
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
            <Textarea
              value={value || config.value || ''}
              onChange={(e) => {
                console.log(`Textarea change: ${fieldId} = ${e.target.value}`);
                handleChange(e.target.value);
              }}
              placeholder={placeholder}
              className="min-h-[60px] text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:z-50 focus:relative focus:outline-none"
              tabIndex={tabIndex}
            />
        </div>
      );

    case 'radio':
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
          <RadioGroup
            value={value || config.value || ''}
            onValueChange={handleChange}
            className="flex gap-4 focus-within:z-50 relative"
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

    case 'select':
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
          <div className="relative focus-within:z-50">
            <select
              value={value || config.value || ''}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-8 px-3 text-xs rounded-md border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:z-50 focus:relative focus:outline-none appearance-none"
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

    case 'date':
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
          <div className="relative focus-within:z-50">
            <Input
              type="date"
              value={value || config.value || ''}
              onChange={(e) => handleChange(e.target.value)}
              className={baseInputClasses}
              tabIndex={tabIndex}
            />
            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      );

    case 'time':
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
          <div className="relative focus-within:z-50">
            <Input
              type="time"
              value={value || config.value || ''}
              onChange={(e) => handleChange(e.target.value)}
              className={baseInputClasses}
              tabIndex={tabIndex}
            />
            <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      );

    case 'currency':
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
          <div className="relative focus-within:z-50">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
              €
            </span>
            <Input
              type="number"
              value={value || config.value || ''}
              onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={`${baseInputClasses} pl-6`}
              step="0.01"
              tabIndex={tabIndex}
            />
          </div>
        </div>
      );

    case 'search':
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
          <div className="relative focus-within:z-50">
            <Input
              type="search"
              value={value || config.value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder || 'Search...'}
              className={`${baseInputClasses} pr-8`}
              tabIndex={tabIndex}
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      );

    case 'card':
      return (
        <div 
          className="border rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md"
          style={color ? {
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            borderColor: `${color}40`
          } : {}}
        >
          <div className="text-sm font-medium text-muted-foreground mb-2">
            {config.label}
          </div>
          <div 
            className="text-lg font-bold"
            style={{ color: fieldColour || 'inherit' }}
          >
            {value || config.value || '€ 0.00'}
          </div>
        </div>
      );

    default:
      return (
        <div>
          <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
          <Input
            type="text"
            value={value || config.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={baseInputClasses}
            tabIndex={tabIndex}
          />
        </div>
      );
  }
};

export const FieldRenderer = React.memo(FieldRendererComponent);