
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';
import { EnhancedFieldVisibilityModal } from './EnhancedFieldVisibilityModal';
import { DynamicPanelProps, PanelConfig, PanelSettings } from '@/types/dynamicPanel';

export const DynamicPanel: React.FC<DynamicPanelProps> = ({
  panelId,
  panelTitle: initialPanelTitle,
  panelConfig: initialPanelConfig,
  initialData = {},
  onDataChange,
  onTitleChange,
  onWidthChange,
  getUserPanelConfig,
  saveUserPanelConfig,
  userId = 'default-user',
  panelWidth = 'full',
  showPreview = false
}) => {
  const [panelConfig, setPanelConfig] = useState<PanelConfig>(initialPanelConfig);
  const [panelTitle, setPanelTitle] = useState(initialPanelTitle);
  const [currentPanelWidth, setCurrentPanelWidth] = useState<'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6>(panelWidth);
  const [formData, setFormData] = useState(initialData);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Load user configuration on mount
  useEffect(() => {
    const loadUserConfig = async () => {
      if (getUserPanelConfig) {
        try {
          const userSettings = await getUserPanelConfig(userId, panelId);
          if (userSettings && Object.keys(userSettings.fields).length > 0) {
            setPanelConfig(userSettings.fields);
            if (userSettings.title) {
              setPanelTitle(userSettings.title);
            }
            if (userSettings.width) {
              setCurrentPanelWidth(userSettings.width);
            }
          }
        } catch (error) {
          console.error('Failed to load user panel config:', error);
        }
      }
    };

    loadUserConfig();
  }, [getUserPanelConfig, userId, panelId]);

  // Get visible fields sorted by order
  const visibleFields = Object.entries(panelConfig)
    .filter(([_, config]) => config.visible)
    .sort(([_, a], [__, b]) => a.order - b.order);

  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedData = { ...formData, [fieldId]: value };
    setFormData(updatedData);
    onDataChange?.(updatedData);
  };

  const handleConfigSave = async (updatedConfig: PanelConfig, newTitle?: string, newWidth?: 'full' | 'half' | 'third' | 1 | 2 | 3 | 4 | 5 | 6) => {
    setPanelConfig(updatedConfig);
    
    if (newTitle !== undefined) {
      setPanelTitle(newTitle);
      onTitleChange?.(newTitle);
    }

    if (newWidth !== undefined) {
      setCurrentPanelWidth(newWidth);
      onWidthChange?.(newWidth);
    }
    
    if (saveUserPanelConfig) {
      try {
        const settings: PanelSettings = {
          title: newTitle || panelTitle,
          width: newWidth || currentPanelWidth,
          fields: updatedConfig
        };
        await saveUserPanelConfig(userId, panelId, settings);
      } catch (error) {
        console.error('Failed to save user panel config:', error);
      }
    }
  };

  // Determine panel width class based on 6-column grid system
  const getWidthClass = () => {
    if (typeof currentPanelWidth === 'number') {
      const colSpan = Math.min(Math.max(currentPanelWidth, 1), 6); // Clamp between 1-6
      return `col-span-${colSpan}`;
    }
    
    switch (currentPanelWidth) {
      case 'half':
        return 'col-span-3'; // 3/6 = 50%
      case 'third':
        return 'col-span-2'; // 2/6 = 33.33%
      case 'full':
      default:
        return 'col-span-6'; // Full width
    }
  };

  return (
    <Card className={`${getWidthClass()} border border-gray-200 shadow-sm`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-purple-500 rounded"></div>
          <CardTitle className="text-sm font-medium text-gray-700">{panelTitle}</CardTitle>
          {showPreview && (
            <span className="text-xs text-blue-600 font-medium">DB000023/42</span>
          )}
        </div>
        {!showPreview && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsConfigModalOpen(true)}
            className="h-6 w-6 text-gray-400 hover:text-gray-600"
          >
            <Settings className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleFields.map(([fieldId, fieldConfig]) => (
            <div key={fieldId} className="space-y-1">
              <label className="text-xs font-medium text-gray-600 block">
                {fieldConfig.label}
                {fieldConfig.mandatory && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <FieldRenderer
                config={fieldConfig}
                value={formData[fieldId]}
                onChange={(value) => handleFieldChange(fieldId, value)}
              />
            </div>
          ))}
        </div>
        
        {visibleFields.length === 0 && !showPreview && (
          <div className="text-center text-gray-500 py-8 text-sm">
            No visible fields configured. Click the settings icon to configure fields.
          </div>
        )}
      </CardContent>

      {!showPreview && (
        <EnhancedFieldVisibilityModal
          open={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          panelConfig={panelConfig}
          panelTitle={panelTitle}
          panelWidth={currentPanelWidth}
          onSave={handleConfigSave}
        />
      )}
    </Card>
  );
};
