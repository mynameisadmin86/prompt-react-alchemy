
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Save, RotateCcw } from 'lucide-react';
import { PanelConfig, FieldVisibilityConfig } from '@/types/dynamicPanel';

interface EnhancedFieldVisibilityModalProps {
  open: boolean;
  onClose: () => void;
  panelConfig: PanelConfig;
  panelTitle: string;
  panelWidth: 'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6;
  onSave: (updatedConfig: PanelConfig, newTitle?: string, newWidth?: 'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6) => void;
}

export const EnhancedFieldVisibilityModal: React.FC<EnhancedFieldVisibilityModalProps> = ({
  open,
  onClose,
  panelConfig,
  panelTitle,
  panelWidth,
  onSave
}) => {
  const [localTitle, setLocalTitle] = useState(panelTitle);
  const [localWidth, setLocalWidth] = useState<'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6>(panelWidth);
  const [localConfig, setLocalConfig] = useState<FieldVisibilityConfig[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    setLocalTitle(panelTitle);
    setLocalWidth(panelWidth);
    const configArray = Object.entries(panelConfig).map(([fieldId, config]) => ({
      fieldId,
      visible: config.visible,
      order: config.order,
      label: config.label,
    }));
    configArray.sort((a, b) => a.order - b.order);
    setLocalConfig(configArray);
  }, [panelConfig, panelTitle, panelWidth, open]);

  const handleVisibilityChange = (fieldId: string, visible: boolean) => {
    setLocalConfig(prev => 
      prev.map(item => 
        item.fieldId === fieldId ? { ...item, visible } : item
      )
    );
  };

  const handleLabelChange = (fieldId: string, label: string) => {
    setLocalConfig(prev => 
      prev.map(item => 
        item.fieldId === fieldId ? { ...item, label } : item
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedItem(fieldId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetFieldId) return;

    const draggedIndex = localConfig.findIndex(item => item.fieldId === draggedItem);
    const targetIndex = localConfig.findIndex(item => item.fieldId === targetFieldId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newConfig = [...localConfig];
    const [draggedItemData] = newConfig.splice(draggedIndex, 1);
    newConfig.splice(targetIndex, 0, draggedItemData);

    // Update order based on new positions
    const updatedConfig = newConfig.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setLocalConfig(updatedConfig);
    setDraggedItem(null);
  };

  const handleSave = () => {
    const updatedPanelConfig: PanelConfig = {};
    
    localConfig.forEach(({ fieldId, visible, order, label }) => {
      if (panelConfig[fieldId]) {
        updatedPanelConfig[fieldId] = {
          ...panelConfig[fieldId],
          visible,
          order,
          label
        };
      }
    });

    onSave(updatedPanelConfig, localTitle, localWidth);
    onClose();
  };

  const handleReset = () => {
    setLocalTitle(panelTitle);
    setLocalWidth(panelWidth);
    const configArray = Object.entries(panelConfig).map(([fieldId, config]) => ({
      fieldId,
      visible: config.visible,
      order: config.order,
      label: config.label,
    }));
    configArray.sort((a, b) => a.order - b.order);
    setLocalConfig(configArray);
  };

  const handleWidthChange = (value: string) => {
    if (value === 'full' || value === 'half' || value === 'third') {
      setLocalWidth(value);
    } else {
      const numValue = parseInt(value);
      if (numValue >= 1 && numValue <= 6) {
        setLocalWidth(numValue as 1 | 2 | 3 | 4 | 5 | 6);
      }
    }
  };

  const isMandatory = (fieldId: string) => panelConfig[fieldId]?.mandatory || false;

  const getWidthDisplayValue = () => {
    if (typeof localWidth === 'number') {
      return localWidth.toString();
    }
    return localWidth;
  };

  const getWidthLabel = (value: string) => {
    switch (value) {
      case 'full':
        return 'Full Width (6 columns)';
      case 'half':
        return 'Half Width (3 columns)';
      case 'third':
        return 'Third Width (2 columns)';
      case '1':
        return '1 Column';
      case '2':
        return '2 Columns';
      case '3':
        return '3 Columns';
      case '4':
        return '4 Columns';
      case '5':
        return '5 Columns';
      case '6':
        return '6 Columns';
      default:
        return value;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Panel</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Panel Title Configuration */}
          <div className="space-y-2">
            <Label htmlFor="panel-title">Panel Title</Label>
            <Input
              id="panel-title"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              placeholder="Enter panel title"
            />
          </div>

          {/* Panel Width Configuration */}
          <div className="space-y-2">
            <Label htmlFor="panel-width">Panel Width</Label>
            <Select value={getWidthDisplayValue()} onValueChange={handleWidthChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select panel width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">{getWidthLabel('full')}</SelectItem>
                <SelectItem value="half">{getWidthLabel('half')}</SelectItem>
                <SelectItem value="third">{getWidthLabel('third')}</SelectItem>
                <SelectItem value="1">{getWidthLabel('1')}</SelectItem>
                <SelectItem value="2">{getWidthLabel('2')}</SelectItem>
                <SelectItem value="3">{getWidthLabel('3')}</SelectItem>
                <SelectItem value="4">{getWidthLabel('4')}</SelectItem>
                <SelectItem value="5">{getWidthLabel('5')}</SelectItem>
                <SelectItem value="6">{getWidthLabel('6')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Configuration */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Field Configuration</h4>
            <div className="space-y-2">
              {localConfig.map((item) => (
                <Card 
                  key={item.fieldId}
                  className="border border-gray-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.fieldId)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.fieldId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={item.visible}
                          onCheckedChange={(checked) => 
                            handleVisibilityChange(item.fieldId, checked as boolean)
                          }
                          disabled={isMandatory(item.fieldId)}
                        />
                        {isMandatory(item.fieldId) && (
                          <span className="text-xs text-red-500">*</span>
                        )}
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-500">Field ID</Label>
                          <div className="text-sm font-mono text-gray-600">{item.fieldId}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Label</Label>
                          <Input
                            value={item.label}
                            onChange={(e) => handleLabelChange(item.fieldId, e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 min-w-[60px] text-center">
                        Order: {item.order}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
