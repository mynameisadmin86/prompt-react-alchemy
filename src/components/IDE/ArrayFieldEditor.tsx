import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { ConfigField } from './ComponentRegistry';

export interface ArrayItemSchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: { label: string; value: any }[];
  defaultValue?: any;
}

interface ArrayFieldEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  itemSchema: ArrayItemSchema[];
  itemLabel: string;
  defaultItem?: Record<string, any>;
}

export const ArrayFieldEditor: React.FC<ArrayFieldEditorProps> = ({
  value = [],
  onChange,
  itemSchema,
  itemLabel,
  defaultItem = {},
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const handleAddItem = () => {
    const newItem: Record<string, any> = { ...defaultItem };
    itemSchema.forEach((field) => {
      if (newItem[field.key] === undefined) {
        newItem[field.key] = field.defaultValue ?? '';
      }
    });
    onChange([...value, newItem]);
    setExpandedItems(new Set([...expandedItems, value.length]));
  };

  const handleRemoveItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(index);
    setExpandedItems(newExpanded);
  };

  const handleItemChange = (index: number, field: string, fieldValue: any) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [field]: fieldValue };
    onChange(newValue);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const renderFieldInput = (
    schema: ArrayItemSchema,
    itemIndex: number,
    currentValue: any
  ) => {
    switch (schema.type) {
      case 'text':
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleItemChange(itemIndex, schema.key, e.target.value)}
            placeholder={schema.label}
            className="h-8 text-sm"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handleItemChange(itemIndex, schema.key, Number(e.target.value))}
            placeholder={schema.label}
            className="h-8 text-sm"
          />
        );
      case 'boolean':
        return (
          <Switch
            checked={currentValue || false}
            onCheckedChange={(checked) => handleItemChange(itemIndex, schema.key, checked)}
          />
        );
      case 'select':
        return (
          <Select
            value={currentValue || ''}
            onValueChange={(val) => handleItemChange(itemIndex, schema.key, val)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder={`Select ${schema.label}`} />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const getItemTitle = (item: any, index: number) => {
    return item.label || item.key || item.id || `${itemLabel} ${index + 1}`;
  };

  return (
    <div className="space-y-2">
      <ScrollArea className="max-h-[400px]">
        <div className="space-y-2 pr-2">
          {value.map((item, index) => (
            <Collapsible
              key={index}
              open={expandedItems.has(index)}
              onOpenChange={() => toggleExpanded(index)}
            >
              <div className="border border-border rounded-md bg-background">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/50">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {expandedItems.has(index) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="flex-1 text-sm font-medium truncate">
                      {getItemTitle(item, index)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(index);
                      }}
                      className="h-6 w-6 p-0 hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0 space-y-3 border-t border-border">
                    {itemSchema.map((schema) => (
                      <div key={schema.key} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          {schema.label}
                        </Label>
                        {renderFieldInput(schema, index, item[schema.key])}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddItem}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {itemLabel}
      </Button>
    </div>
  );
};
