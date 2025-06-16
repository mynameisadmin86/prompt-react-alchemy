import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GripVertical } from 'lucide-react';
import { PanelConfig, FieldVisibilityConfig } from '@/types/dynamicPanel';

interface EnhancedFieldVisibilityModalProps {
  open: boolean;
  onClose: () => void;
  panelConfig: PanelConfig;
  panelTitle: string;
  panelWidth: 'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6;
  collapsible?: boolean;
  onSave: (
    updatedConfig: PanelConfig, 
    newTitle?: string, 
    newWidth?: 'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6,
    newCollapsible?: boolean
  ) => void;
}

export const EnhancedFieldVisibilityModal: React.FC<EnhancedFieldVisibilityModalProps> = ({
  open,
  onClose,
  panelConfig,
  panelTitle,
  panelWidth,
  collapsible = false,
  onSave
}) => {
  const [fieldConfigs, setFieldConfigs] = useState<FieldVisibilityConfig[]>([]);
  const [currentTitle, setCurrentTitle] = useState(panelTitle);
  const [currentWidth, setCurrentWidth] = useState<'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6>(panelWidth);
  const [currentCollapsible, setCurrentCollapsible] = useState(collapsible);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const configs = Object.entries(panelConfig)
      .map(([fieldId, config]) => ({
        fieldId,
        visible: config.visible,
        order: config.order,
        label: config.label
      }))
      .sort((a, b) => a.order - b.order);
    
    setFieldConfigs(configs);
    setCurrentTitle(panelTitle);
    setCurrentWidth(panelWidth);
    setCurrentCollapsible(collapsible);
  }, [panelConfig, panelTitle, panelWidth, collapsible]);

  const handleVisibilityChange = (fieldId: string, visible: boolean) => {
    setFieldConfigs(prev => 
      prev.map(config => 
        config.fieldId === fieldId ? { ...config, visible } : config
      )
    );
  };

  const handleLabelChange = (fieldId: string, label: string) => {
    setFieldConfigs(prev => 
      prev.map(config => 
        config.fieldId === fieldId ? { ...config, label } : config
      )
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newConfigs = [...fieldConfigs];
    const draggedItem = newConfigs[draggedIndex];
    newConfigs.splice(draggedIndex, 1);
    newConfigs.splice(index, 0, draggedItem);
    
    // Update order
    const updatedConfigs = newConfigs.map((config, idx) => ({
      ...config,
      order: idx
    }));
    
    setFieldConfigs(updatedConfigs);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    const updatedConfig: PanelConfig = { ...panelConfig };
    
    fieldConfigs.forEach(fieldConfig => {
      if (updatedConfig[fieldConfig.fieldId]) {
        updatedConfig[fieldConfig.fieldId] = {
          ...updatedConfig[fieldConfig.fieldId],
          visible: fieldConfig.visible,
          order: fieldConfig.order,
          label: fieldConfig.label
        };
      }
    });

    onSave(updatedConfig, currentTitle, currentWidth, currentCollapsible);
    onClose();
  };

  const handleReset = () => {
    const configs = Object.entries(panelConfig)
      .map(([fieldId, config]) => ({
        fieldId,
        visible: true,
        order: config.order,
        label: fieldId
      }))
      .sort((a, b) => a.order - b.order);
    
    setFieldConfigs(configs);
    setCurrentTitle(panelTitle);
    setCurrentWidth('full');
    setCurrentCollapsible(false);
  };

  const formatWidthValue = (value: 'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6) => {
    if (typeof value === 'number') return value.toString();
    return value;
  };

  const parseWidthValue = (value: string): 'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6 => {
    if (['full', 'half', 'third'].includes(value)) {
      return value as 'full' | 'half' | 'third';
    }
    const numValue = parseInt(value);
    return (numValue >= 1 && numValue <= 6) ? numValue as 1 | 2 | 3 | 4 | 5 | 6 : 'full';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Panel Configuration</DialogTitle>
        </DialogHeader>
        
        <Accordion type="single" collapsible defaultValue="panel-settings" className="w-full">
          <AccordionItem value="panel-settings">
            <AccordionTrigger>Panel Settings</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="panel-title">Panel Title</Label>
                <Input
                  id="panel-title"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="Enter panel title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="panel-width">Panel Width</Label>
                <Select value={formatWidthValue(currentWidth)} onValueChange={(value) => setCurrentWidth(parseWidthValue(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full (6 columns)</SelectItem>
                    <SelectItem value="half">Half (3 columns)</SelectItem>
                    <SelectItem value="third">Third (2 columns)</SelectItem>
                    <SelectItem value="1">1 Column</SelectItem>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                    <SelectItem value="5">5 Columns</SelectItem>
                    <SelectItem value="6">6 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="collapsible"
                  checked={currentCollapsible}
                  onCheckedChange={(checked) => setCurrentCollapsible(checked as boolean)}
                />
                <Label htmlFor="collapsible">Make panel collapsible</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="field-visibility">
            <AccordionTrigger>Field Visibility & Order</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {fieldConfigs.map((fieldConfig, index) => {
                  const isMandatory = panelConfig[fieldConfig.fieldId]?.mandatory;
                  
                  return (
                    <div
                      key={fieldConfig.fieldId}
                      className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                      
                      <Checkbox
                        checked={fieldConfig.visible}
                        onCheckedChange={(checked) => 
                          handleVisibilityChange(fieldConfig.fieldId, checked as boolean)
                        }
                        disabled={isMandatory}
                      />
                      
                      <div className="flex-1">
                        <Input
                          value={fieldConfig.label}
                          onChange={(e) => handleLabelChange(fieldConfig.fieldId, e.target.value)}
                          className="text-sm"
                          placeholder="Field label"
                        />
                        {isMandatory && (
                          <span className="text-xs text-red-600 mt-1">Mandatory field</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
