import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, Calendar, Clock } from 'lucide-react';
import { FieldConfig } from '@/types/dynamicPanel';

interface FieldRendererProps {
  config: FieldConfig;
  control: Control<any>;
  fieldId: string;
  tabIndex?: number;
  onBlur?: () => void;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  config,
  control,
  fieldId,
  tabIndex,
  onBlur
}) => {
  const { fieldType, editable, placeholder, options, color, fieldColour } = config;

  if (!editable) {
    return (
      <Controller
        name={fieldId}
        control={control}
        render={({ field }) => (
          <div>
            <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
            <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border min-h-[32px] flex items-center">
              {field.value || '-'}
            </div>
          </div>
        )}
      />
    );
  }

  const baseInputClasses = "h-8 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:z-50 focus:relative focus:outline-none";

  switch (fieldType) {
    case 'text':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
               <Input
                type="text"
                {...field}
                placeholder={placeholder}
                className={baseInputClasses}
                tabIndex={tabIndex}
                onBlur={(e) => {
                  field.onBlur();
                  onBlur?.();
                }}
              />
            </div>
          )}
        />
      );

    case 'textarea':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
               <Textarea
                {...field}
                placeholder={placeholder}
                className="min-h-[60px] text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:z-50 focus:relative focus:outline-none"
                tabIndex={tabIndex}
                onBlur={(e) => {
                  field.onBlur();
                  onBlur?.();
                }}
              />
            </div>
          )}
        />
      );

    case 'radio':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
               <RadioGroup
                value={field.value || ''}
                onValueChange={(value) => {
                  field.onChange(value);
                  onBlur?.();
                }}
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
          )}
        />
      );

    case 'select':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
              <div className="relative focus-within:z-50">
                <select
                  {...field}
                  className="w-full h-8 px-3 text-xs rounded-md border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:z-50 focus:relative focus:outline-none appearance-none"
                  tabIndex={tabIndex}
                  onBlur={(e) => {
                    field.onBlur();
                    onBlur?.();
                  }}
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
          )}
        />
      );

    case 'date':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
              <div className="relative focus-within:z-50">
                <Input
                  type="date"
                  {...field}
                  className={baseInputClasses}
                  tabIndex={tabIndex}
                  onBlur={(e) => {
                    field.onBlur();
                    onBlur?.();
                  }}
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        />
      );

    case 'time':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
              <div className="relative focus-within:z-50">
                <Input
                  type="time"
                  {...field}
                  className={baseInputClasses}
                  tabIndex={tabIndex}
                  onBlur={(e) => {
                    field.onBlur();
                    onBlur?.();
                  }}
                />
                <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        />
      );

    case 'currency':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
              <div className="relative focus-within:z-50">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                  €
                </span>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`${baseInputClasses} pl-6`}
                  step="0.01"
                  tabIndex={tabIndex}
                  onBlur={(e) => {
                    field.onBlur();
                    onBlur?.();
                  }}
                />
              </div>
            </div>
          )}
        />
      );

    case 'search':
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
              <div className="relative focus-within:z-50">
                <Input
                  type="search"
                  {...field}
                  placeholder={placeholder || 'Search...'}
                  className={`${baseInputClasses} pr-8`}
                  tabIndex={tabIndex}
                  onBlur={(e) => {
                    field.onBlur();
                    onBlur?.();
                  }}
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
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
                style={color ? cardStyle : {}}
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

    default:
      return (
        <Controller
          name={fieldId}
          control={control}
          render={({ field }) => (
            <div>
              <div className="text-xs text-blue-600 mb-1">TabIndex: {tabIndex}</div>
               <Input
                type="text"
                {...field}
                placeholder={placeholder}
                className={baseInputClasses}
                tabIndex={tabIndex}
                onBlur={(e) => {
                  field.onBlur();
                  onBlur?.();
                }}
              />
            </div>
          )}
        />
      );
  }
};
