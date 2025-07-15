import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { PanelConfig, FieldVisibilityConfig } from '@/types/dynamicPanel';

interface EnhancedFieldVisibilityConfig extends FieldVisibilityConfig {
  width?: 'third' | 'half' | 'two-thirds' | 'full';
}

interface EnhancedFieldVisibilityModalProps {
  open: boolean;
  onClose: () => void;
  panelConfig: PanelConfig;
  panelTitle: string;
  panelWidth: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  collapsible?: boolean;
  panelVisible?: boolean;
  showHeader?: boolean;
  onSave: (
    updatedConfig: PanelConfig, 
    newTitle?: string, 
    newWidth?: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    newCollapsible?: boolean,
    newPanelVisible?: boolean,
    newShowHeader?: boolean
  ) => void;
}

export const EnhancedFieldVisibilityModal: React.FC<EnhancedFieldVisibilityModalProps> = ({
  open,
  onClose,
  panelConfig,
  panelTitle,
  panelWidth,
  collapsible = false,
  panelVisible = true,
  showHeader = true,
  onSave
}) => {
  const [fieldConfigs, setFieldConfigs] = useState<EnhancedFieldVisibilityConfig[]>([]);
  const [currentTitle, setCurrentTitle] = useState(panelTitle);
  const [currentWidth, setCurrentWidth] = useState<'full' | 'half' | 'third' | 'quarter'>(
    panelWidth === 'half' || panelWidth === 6 ? 'half' :
    panelWidth === 'third' || panelWidth === 4 ? 'third' :
    panelWidth === 'quarter' || panelWidth === 3 ? 'quarter' : 'full'
  );
  const [currentCollapsible, setCurrentCollapsible] = useState(collapsible);
  const [currentPanelVisible, setCurrentPanelVisible] = useState(panelVisible);
  const [currentShowHeader, setCurrentShowHeader] = useState(showHeader);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const configs = Object.entries(panelConfig)
      .map(([fieldId, config]) => ({
        fieldId,
        visible: config.visible,
        order: config.order,
        label: config.label,
        width: config.width || 'full'
      }))
      .sort((a, b) => a.order - b.order);
    
    setFieldConfigs(configs);
    setCurrentTitle(panelTitle);
    setCurrentWidth(
      panelWidth === 'half' || panelWidth === 6 ? 'half' :
      panelWidth === 'third' || panelWidth === 4 ? 'third' :
      panelWidth === 'quarter' || panelWidth === 3 ? 'quarter' : 'full'
    );
    setCurrentCollapsible(collapsible);
    setCurrentPanelVisible(panelVisible);
    setCurrentShowHeader(showHeader);
  }, [panelConfig, panelTitle, panelWidth, collapsible, panelVisible, showHeader]);

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

  const handleWidthChange = (fieldId: string, width: 'third' | 'half' | 'two-thirds' | 'full') => {
    setFieldConfigs(prev => 
      prev.map(config => 
        config.fieldId === fieldId ? { ...config, width } : config
      )
    );
  };

  const handleSave = () => {
    const updatedConfig: PanelConfig = { ...panelConfig };
    
    fieldConfigs.forEach(fieldConfig => {
      if (updatedConfig[fieldConfig.fieldId]) {
        updatedConfig[fieldConfig.fieldId] = {
          ...updatedConfig[fieldConfig.fieldId],
          visible: fieldConfig.visible,
          order: fieldConfig.order,
          label: fieldConfig.label,
          width: fieldConfig.width
        };
      }
    });

    onSave(updatedConfig, currentTitle, currentWidth, currentCollapsible, currentPanelVisible, currentShowHeader);
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
    setCurrentPanelVisible(true);
    setCurrentShowHeader(true);
  };

  const formatWidthValue = (value: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12) => {
    if (typeof value === 'number') return value.toString();
    return value;
  };

  const parseWidthValue = (value: string): 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 => {
    if (['full', 'half', 'third', 'quarter'].includes(value)) {
      return value as 'full' | 'half' | 'third' | 'quarter';
    }
    const numValue = parseInt(value);
    return (numValue >= 1 && numValue <= 12) ? numValue as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 : 'full';
  };

  const getFieldTypeDisplay = (fieldType: string) => {
    const typeMap: Record<string, string> = {
      'text': 'Text',
      'select': 'Select',
      'search': 'Search',
      'currency': 'Currency',
      'date': 'Date',
      'time': 'Time',
      'textarea': 'Textarea'
    };
    return typeMap[fieldType] || fieldType;
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="panel-visible"
                  checked={currentPanelVisible}
                  onCheckedChange={(checked) => setCurrentPanelVisible(checked as boolean)}
                />
                <Label htmlFor="panel-visible" className="flex items-center space-x-2">
                  <span>Show panel</span>
                  {!currentPanelVisible && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Hidden</span>
                  )}
                </Label>
              </div>

              {!currentPanelVisible && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    This panel is currently hidden. Check "Show panel" to make it visible again.
                  </p>
                </div>
              )}

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
                <Select value={currentWidth} onValueChange={(value: 'full' | 'half' | 'third' | 'quarter') => setCurrentWidth(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full (12 columns)</SelectItem>
                    <SelectItem value="half">Half (6 columns)</SelectItem>
                    <SelectItem value="third">Third (4 columns)</SelectItem>
                    <SelectItem value="quarter">Quarter (3 columns)</SelectItem>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-header"
                  checked={currentShowHeader}
                  onCheckedChange={(checked) => setCurrentShowHeader(checked as boolean)}
                />
                <Label htmlFor="show-header">Show header section</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="field-visibility">
            <AccordionTrigger>Field Visibility & Configuration</AccordionTrigger>
            <AccordionContent>
              <div className="overflow-auto" style={{ maxHeight: '24rem' }}>
                {fieldConfigs.map((fieldConfig, index) => {
                  const isMandatory = panelConfig[fieldConfig.fieldId]?.mandatory;
                  const isVisible = fieldConfig.visible;
                  const fieldType = panelConfig[fieldConfig.fieldId]?.fieldType;
                  
                  return (
                    <div
                      key={fieldConfig.fieldId}
                      className="border rounded p-3 mb-3 bg-light"
                      draggable
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(e) => {
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
                      }}
                      onDragEnd={() => setDraggedIndex(null)}
                    >
                      <div className="d-flex align-items-center mb-3">
                        <GripVertical size={16} className="text-muted mr-2" style={{ cursor: 'grab' }} />
                        
                        <Checkbox
                          checked={isVisible}
                          onCheckedChange={(checked) => 
                            setFieldConfigs(prev => 
                              prev.map(config => 
                                config.fieldId === fieldConfig.fieldId ? { ...config, visible: checked as boolean } : config
                              )
                            )
                          }
                          disabled={isMandatory}
                        />

                        <div className="d-flex align-items-center ml-2 mr-2">
                          {isVisible ? (
                            <Eye size={16} className="text-success" />
                          ) : (
                            <EyeOff size={16} className="text-muted" />
                          )}
                        </div>
                        
                        <div className="flex-fill">
                          <Input
                            value={fieldConfig.label}
                            onChange={(e) => setFieldConfigs(prev => 
                              prev.map(config => 
                                config.fieldId === fieldConfig.fieldId ? { ...config, label: e.target.value } : config
                              )
                            )}
                            className="form-control form-control-sm"
                            placeholder="Field label"
                          />
                          <div className="d-flex justify-content-between mt-1">
                            <small className="text-muted">
                              {fieldConfig.fieldId}
                            </small>
                            <small className="text-primary font-weight-bold">
                              {getFieldTypeDisplay(fieldType)}
                            </small>
                          </div>
                          {isMandatory && (
                            <small className="text-danger">Mandatory field</small>
                          )}
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <Label className="text-muted mr-2">
                          <small>Field Width:</small>
                        </Label>
                        <Select 
                          value={fieldConfig.width || 'full'} 
                          onValueChange={(value: 'third' | 'half' | 'two-thirds' | 'full') => 
                            handleWidthChange(fieldConfig.fieldId, value)
                          }
                        >
                          <SelectTrigger className="form-control form-control-sm" style={{ width: '8rem' }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="third">1/3 Width</SelectItem>
                            <SelectItem value="half">1/2 Width</SelectItem>
                            <SelectItem value="two-thirds">2/3 Width</SelectItem>
                            <SelectItem value="full">Full Width</SelectItem>
                          </SelectContent>
                        </Select>
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
