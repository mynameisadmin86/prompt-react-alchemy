import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { GridColumnConfig } from '@/types/smartgrid';
import { DynamicLazySelect } from '@/components/DynamicPanel/DynamicLazySelect';
import { cn } from '@/lib/utils';

interface EnhancedCellEditorProps {
  value: any;
  column: GridColumnConfig;
  onSave: (value: any) => void;
  onCancel: () => void;
}

export function EnhancedCellEditor({ value, column, onSave, onCancel }: EnhancedCellEditorProps) {
  const [editValue, setEditValue] = useState(value ?? '');
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !['LazySelect', 'Select'].includes(column.type)) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [column.type]);

  const validateValue = (val: any): string | null => {
    if (column.mandatory && (val === '' || val === null || val === undefined)) {
      return 'This field is required';
    }

    switch (column.type) {
      case 'Integer':
        if (val !== '' && (isNaN(val) || !Number.isInteger(Number(val)))) {
          return 'Must be a valid integer';
        }
        break;
      case 'Time':
        if (val && !/^\d{2}:\d{2}$/.test(val)) {
          return 'Must be in HH:MM format';
        }
        break;
      case 'Date':
        if (val && isNaN(Date.parse(val))) {
          return 'Must be a valid date';
        }
        break;
    }

    return null;
  };

  const handleSave = () => {
    const validationError = validateValue(editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    let finalValue = editValue;

    // Type conversion
    switch (column.type) {
      case 'Integer':
        finalValue = editValue === '' ? null : parseInt(editValue, 10);
        break;
      case 'String':
      case 'Text':
        finalValue = String(editValue);
        break;
      case 'Date':
      case 'Time':
        finalValue = editValue || null;
        break;
    }

    onSave(finalValue);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  // LazySelect renderer
  if (column.type === 'LazySelect' && column.fetchOptions) {
    return (
      <div className="flex items-center space-x-1 p-1 bg-background border rounded shadow-sm min-w-[200px]">
        <div className="flex-1">
          <DynamicLazySelect
            fetchOptions={column.fetchOptions}
            value={editValue}
            onChange={(val) => setEditValue(val)}
            placeholder="Select..."
            multiSelect={column.multiSelect}
            hideSearch={column.hideSearch}
            disableLazyLoading={column.disableLazyLoading}
          />
        </div>
        <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  // Select/Dropdown renderer
  if ((column.type === 'Select' || column.type === 'Dropdown') && column.options) {
    return (
      <div className="flex items-center space-x-1 p-1 bg-background border rounded shadow-sm">
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 text-sm border-0 bg-background focus:ring-0 focus:outline-none"
          autoFocus
        >
          <option value="">Select...</option>
          {column.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  // Input type determination
  let inputType = 'text';
  switch (column.type) {
    case 'Integer':
      inputType = 'number';
      break;
    case 'Date':
      inputType = 'date';
      break;
    case 'Time':
      inputType = 'time';
      break;
    default:
      inputType = 'text';
  }

  // Standard input renderer
  return (
    <div className="flex items-center space-x-1 p-1 bg-background border rounded shadow-sm relative">
      <Input
        ref={inputRef}
        type={inputType}
        value={editValue}
        onChange={(e) => {
          setEditValue(e.target.value);
          setError('');
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex-1 h-8 px-2 text-sm',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
        step={column.type === 'Integer' ? '1' : undefined}
      />
      <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
        <Check className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
        <X className="h-3 w-3" />
      </Button>
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive z-50 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}
