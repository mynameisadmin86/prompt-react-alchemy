
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';
import { FieldVisibilityModal } from './FieldVisibilityModal';
import { DynamicPanelProps, PanelConfig } from '@/types/dynamicPanel';

export const DynamicPanel: React.FC<DynamicPanelProps> = ({
  panelId,
  panelTitle,
  panelConfig: initialPanelConfig,
  initialData = {},
  onDataChange,
  getUserPanelConfig,
  saveUserPanelConfig,
  userId = 'default-user'
}) => {
  const [panelConfig, setPanelConfig] = useState<PanelConfig>(initialPanelConfig);
  const [formData, setFormData] = useState(initialData);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Load user configuration on mount
  useEffect(() => {
    const loadUserConfig = async () => {
      if (getUserPanelConfig) {
        try {
          const userConfig = await getUserPanelConfig(userId, panelId);
          if (userConfig && Object.keys(userConfig).length > 0) {
            setPanelConfig(userConfig);
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

  const handleConfigSave = async (updatedConfig: PanelConfig) => {
    setPanelConfig(updatedConfig);
    
    if (saveUserPanelConfig) {
      try {
        await saveUserPanelConfig(userId, panelId, updatedConfig);
      } catch (error) {
        console.error('Failed to save user panel config:', error);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{panelTitle}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsConfigModalOpen(true)}
          className="h-8 w-8 text-gray-500 hover:text-gray-700"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleFields.map(([fieldId, fieldConfig]) => (
            <div key={fieldId} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
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
        
        {visibleFields.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No visible fields configured. Click the settings icon to configure fields.
          </div>
        )}
      </CardContent>

      <FieldVisibilityModal
        open={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        panelConfig={panelConfig}
        onSave={handleConfigSave}
      />
    </Card>
  );
};
