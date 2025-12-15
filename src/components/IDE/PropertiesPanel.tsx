import React, { useState, useEffect } from 'react';
import { ComponentInstance, useIDEStore, ComponentStyle } from '@/stores/ideStore';
import { getComponentByType, ConfigField, styleSchema } from './ComponentRegistry';
import { ArrayFieldEditor } from './ArrayFieldEditor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PropertiesPanelProps {
  pageId: string;
  component: ComponentInstance | null;
}

const parseJsOrJson = (text: string): any => {
  // First try standard JSON
  try {
    return JSON.parse(text);
  } catch {
    // Try to convert JS object syntax to JSON
    try {
      // Remove "data:" or similar labels at the start
      let cleaned = text.trim().replace(/^\w+\s*:\s*/, '');
      // Replace single quotes with double quotes
      cleaned = cleaned.replace(/'/g, '"');
      // Add quotes around unquoted keys
      cleaned = cleaned.replace(/(\{|\,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
      // Remove trailing commas
      cleaned = cleaned.replace(/,\s*([\}\]])/g, '$1');
      return JSON.parse(cleaned);
    } catch {
      // Try using Function constructor as last resort (safer than eval)
      try {
        const fn = new Function('return ' + text.trim().replace(/^\w+\s*:\s*/, ''));
        return fn();
      } catch {
        throw new Error('Invalid syntax');
      }
    }
  }
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ pageId, component }) => {
  const { updateComponent } = useIDEStore();
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});
  const [localStyle, setLocalStyle] = useState<ComponentStyle>({});
  const [jsonTexts, setJsonTexts] = useState<Record<string, string>>({});
  const [jsonErrors, setJsonErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (component) {
      setLocalConfig(component.config);
      setLocalStyle(component.style || {});
      // Initialize JSON text fields
      const texts: Record<string, string> = {};
      Object.entries(component.config).forEach(([key, value]) => {
        if (typeof value === 'object') {
          texts[key] = JSON.stringify(value, null, 2);
        }
      });
      setJsonTexts(texts);
      setJsonErrors({});
    }
  }, [component]);

  if (!component) {
    return (
      <div className="h-full p-4 bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">
          Select a component to edit its properties
        </p>
      </div>
    );
  }

  const definition = getComponentByType(component.type);
  if (!definition) return null;

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    updateComponent(pageId, component.id, { config: newConfig });
  };

  const handleStyleChange = (key: keyof ComponentStyle, value: string) => {
    const newStyle = { ...localStyle, [key]: value };
    setLocalStyle(newStyle);
    updateComponent(pageId, component.id, { style: newStyle });
  };

  const handleSizeChange = (key: 'width' | 'height', value: string) => {
    updateComponent(pageId, component.id, {
      size: { ...component.size, [key]: value },
    });
  };

  const renderField = (field: ConfigField) => {
    const value = localConfig[field.key] ?? field.defaultValue;

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.label}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(field.key, Number(e.target.value))}
            placeholder={field.label}
          />
        );

      case 'boolean':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handleChange(field.key, checked)}
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleChange(field.key, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={value || '#ffffff'}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-12 h-9 p-1 cursor-pointer"
            />
            <Input
              value={value || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder="transparent"
              className="flex-1"
            />
          </div>
        );

      case 'array':
        return (
          <ArrayFieldEditor
            value={Array.isArray(value) ? value : []}
            onChange={(newValue) => handleChange(field.key, newValue)}
            itemSchema={field.itemSchema || []}
            itemLabel={field.itemLabel || 'Item'}
            defaultItem={field.defaultItem}
          />
        );

      case 'json':
        const jsonText = jsonTexts[field.key] ?? JSON.stringify(value ?? field.defaultValue, null, 2);
        const hasError = jsonErrors[field.key];
        
        return (
          <div className="space-y-1">
            <Textarea
              value={jsonText}
              onChange={(e) => {
                const text = e.target.value;
                setJsonTexts(prev => ({ ...prev, [field.key]: text }));
                try {
                  const parsed = parseJsOrJson(text);
                  handleChange(field.key, parsed);
                  setJsonErrors(prev => ({ ...prev, [field.key]: false }));
                } catch {
                  setJsonErrors(prev => ({ ...prev, [field.key]: true }));
                }
              }}
              placeholder={`Enter ${field.label} as JSON or JS object syntax`}
              className={`font-mono text-xs min-h-[100px] ${hasError ? 'border-destructive' : ''}`}
            />
            {hasError && (
              <p className="text-xs text-destructive">Invalid JSON/JS format</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderStyleField = (key: keyof ComponentStyle, label: string, placeholder: string) => {
    const value = localStyle[key] || '';
    return (
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        {key === 'backgroundColor' ? (
          <div className="flex gap-2">
            <Input
              type="color"
              value={value || '#ffffff'}
              onChange={(e) => handleStyleChange(key, e.target.value)}
              className="w-10 h-8 p-1 cursor-pointer"
            />
            <Input
              value={value}
              onChange={(e) => handleStyleChange(key, e.target.value)}
              placeholder={placeholder}
              className="flex-1 h-8 text-xs"
            />
          </div>
        ) : (
          <Input
            value={value}
            onChange={(e) => handleStyleChange(key, e.target.value)}
            placeholder={placeholder}
            className="h-8 text-xs"
          />
        )}
      </div>
    );
  };

  // Separate array fields from other fields
  const arrayFields = definition.configSchema.filter(f => f.type === 'array');
  const otherFields = definition.configSchema.filter(f => f.type !== 'array');

  return (
    <ScrollArea className="h-full">
      <div className="p-4 bg-muted/30 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <definition.icon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">{definition.label}</h3>
        </div>

        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="mt-4 space-y-4">
            {otherFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  {field.label}
                </Label>
                {renderField(field)}
              </div>
            ))}
            
            {arrayFields.length > 0 && (
              <Accordion type="multiple" className="w-full">
                {arrayFields.map((field) => (
                  <AccordionItem key={field.key} value={field.key}>
                    <AccordionTrigger className="text-sm font-medium">
                      {field.label}
                    </AccordionTrigger>
                    <AccordionContent>
                      {renderField(field)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
          
          <TabsContent value="style" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {renderStyleField('backgroundColor', 'Background', 'transparent')}
              {renderStyleField('padding', 'Padding', '16px')}
              {renderStyleField('margin', 'Margin', '0px')}
              {renderStyleField('gap', 'Gap', '16px')}
              {renderStyleField('border', 'Border', '1px solid #ccc')}
              {renderStyleField('borderRadius', 'Radius', '8px')}
            </div>
            
            <div className="pt-4 border-t border-border">
              <Label className="text-sm font-medium text-foreground mb-3 block">Size</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <Input
                    value={component.size.width}
                    onChange={(e) => handleSizeChange('width', e.target.value)}
                    placeholder="100%"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Height</Label>
                  <Input
                    value={component.size.height}
                    onChange={(e) => handleSizeChange('height', e.target.value)}
                    placeholder="auto"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Component ID</Label>
              <Input value={component.id} disabled className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Component Type</Label>
              <Input value={component.type} disabled className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Parent ID</Label>
              <Input value={component.parentId || 'Root'} disabled className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Order</Label>
              <Input value={component.order ?? 0} disabled className="font-mono text-xs" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};
