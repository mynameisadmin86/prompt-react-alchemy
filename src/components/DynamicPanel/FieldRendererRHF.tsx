import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, Calendar, Clock } from 'lucide-react';
import { FieldConfig } from '@/types/dynamicPanel';

interface FieldRendererRHFProps {
  name: string;
  config: FieldConfig;
}

export const FieldRendererRHF: React.FC<FieldRendererRHFProps> = ({
  name,
  config
}) => {
  const { control } = useFormContext();
  const { fieldType, editable, placeholder, options, color, fieldColour } = config;

  if (!editable) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border min-h-[32px] flex items-center">
            {field.value || '-'}
          </div>
        )}
      />
    );
  }

  const baseInputClasses = "h-8 text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  const renderField = () => {
    switch (fieldType) {
      case 'text':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                className={baseInputClasses}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Textarea
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                className="min-h-[60px] text-xs border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value || ''}
                onValueChange={field.onChange}
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
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="relative">
                <select
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
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
            )}
          />
        );

      case 'date':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  type="date"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={baseInputClasses}
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            )}
          />
        );

      case 'time':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  type="time"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={baseInputClasses}
                />
                <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            )}
          />
        );

      case 'currency':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                  €
                </span>
                <Input
                  type="number"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  onBlur={field.onBlur}
                  placeholder="0.00"
                  className={`${baseInputClasses} pl-6`}
                  step="0.01"
                />
              </div>
            )}
          />
        );

      case 'search':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  type="search"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={placeholder || 'Search...'}
                  className={`${baseInputClasses} pr-8`}
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            )}
          />
        );

      case 'card':
        const cardStyle = color ? {
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          borderColor: `${color}40`
        } : {};
        
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
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
            )}
          />
        );

      default:
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                className={baseInputClasses}
              />
            )}
          />
        );
    }
  };

  return renderField();
};