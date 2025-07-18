import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { FieldConfig } from '@/types/dynamicPanel';

interface FieldRendererRHFProps {
  config: FieldConfig;
  value: any;
  onChange: (value: any) => void;
}

export const FieldRendererRHF: React.FC<FieldRendererRHFProps> = ({
  config,
  value,
  onChange,
}) => {
  const { id, label, fieldType, mandatory, editable, options, placeholder, color, fieldColour } = config;

  if (!editable) {
    // Read-only display
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label} {mandatory && <span className="text-destructive">*</span>}</Label>
        <div className="text-sm text-muted-foreground">
          {fieldType === 'card' ? (
            <Card 
              className="p-3 text-center"
              style={{ 
                backgroundColor: color || 'hsl(var(--card))',
                color: fieldColour || 'hsl(var(--card-foreground))'
              }}
            >
              {value || 'No value'}
            </Card>
          ) : (
            value || 'No value'
          )}
        </div>
      </div>
    );
  }

  const handleInputChange = (newValue: any) => {
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {mandatory && <span className="text-destructive">*</span>}
      </Label>

      {fieldType === 'text' && (
        <Input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          required={mandatory}
        />
      )}

      {fieldType === 'textarea' && (
        <Textarea
          id={id}
          value={value || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          required={mandatory}
          rows={3}
        />
      )}

      {fieldType === 'select' && (
        <Select value={value || ''} onValueChange={handleInputChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder || 'Select an option...'} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {fieldType === 'radio' && (
        <RadioGroup value={value || ''} onValueChange={handleInputChange}>
          {options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
              <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {fieldType === 'date' && (
        <Input
          id={id}
          type="date"
          value={value || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          required={mandatory}
        />
      )}

      {fieldType === 'time' && (
        <Input
          id={id}
          type="time"
          value={value || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          required={mandatory}
        />
      )}

      {fieldType === 'currency' && (
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id={id}
            type="number"
            step="0.01"
            value={value || ''}
            onChange={(e) => handleInputChange(parseFloat(e.target.value) || 0)}
            placeholder={placeholder}
            required={mandatory}
            className="pl-8"
          />
        </div>
      )}

      {fieldType === 'search' && (
        <Input
          id={id}
          type="search"
          value={value || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder || 'Search...'}
          required={mandatory}
        />
      )}

      {fieldType === 'card' && (
        <Card 
          className="p-4 text-center cursor-pointer transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: color || 'hsl(var(--card))',
            color: fieldColour || 'hsl(var(--card-foreground))'
          }}
          onClick={() => handleInputChange(!value)}
        >
          <div className="space-y-2">
            <div className="font-medium">{value ? 'Selected' : 'Click to select'}</div>
            <div className="text-sm opacity-75">{placeholder || label}</div>
          </div>
        </Card>
      )}
    </div>
  );
};