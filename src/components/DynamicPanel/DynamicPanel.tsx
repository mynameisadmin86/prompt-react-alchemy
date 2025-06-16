
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
  getUserPanelConfig,
  saveUserPanelConfig,
  userId = 'default-user',
  panelWidth = 'full',
  showPreview = false
}) => {
  const [panelConfig, setPanelConfig] = useState<PanelConfig>(initialPanelConfig);
  const [panelTitle, setPanelTitle] = useState(initialPanelTitle);
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

  const handleConfigSave = async (updatedConfig: PanelConfig, newTitle?: string) => {
    setPanelConfig(updatedConfig);
    
    if (newTitle !== undefined) {
      setPanelTitle(newTitle);
      onTitleChange?.(newTitle);
    }
    
    if (saveUserPanelConfig) {
      try {
        const settings: PanelSettings = {
          title: newTitle || panelTitle,
          fields: updatedConfig
        };
        await saveUserPanelConfig(userId, panelId, settings);
      } catch (error) {
        console.error('Failed to save user panel config:', error);
      }
    }
  };

  // Determine panel width class
  const widthClass = panelWidth === 'half' ? 'w-1/2' : panelWidth === 'third' ? 'w-1/3' : 'w-full';

  return (
    <Card className={`${widthClass} border border-gray-200 shadow-sm`}>
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
          onSave={handleConfigSave}
        />
      )}
    </Card>
  );
};
