import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FieldRendererRHF } from './FieldRendererRHF';
import { EnhancedFieldVisibilityModal } from '../DynamicPanel/EnhancedFieldVisibilityModal';
import { PanelStatusIndicator } from '../DynamicPanel/PanelStatusIndicator';
import { DynamicPanelProps, PanelConfig, PanelSettings } from '@/types/dynamicPanel';

export const DynamicPanelRHF: React.FC<DynamicPanelProps> = ({
  panelId,
  panelTitle,
  panelConfig,
  initialData = {},
  onDataChange,
  onTitleChange,
  onWidthChange,
  onCollapsibleChange,
  getUserPanelConfig,
  saveUserPanelConfig,
  userId = 'default-user',
  panelWidth = 'full',
  collapsible = false,
  showPreview = false,
}) => {
  const [currentPanelConfig, setCurrentPanelConfig] = useState<PanelConfig>(panelConfig);
  const [currentPanelTitle, setCurrentPanelTitle] = useState(panelTitle);
  const [currentPanelWidth, setCurrentPanelWidth] = useState(panelWidth);
  const [isCollapsible, setIsCollapsible] = useState(collapsible);
  const [panelVisible, setPanelVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Initialize react-hook-form
  const { control, watch, reset, getValues } = useForm({
    defaultValues: initialData,
  });

  // Watch all form values for changes
  const formData = watch();

  // Load user configuration on mount
  useEffect(() => {
    const loadUserConfig = async () => {
      if (getUserPanelConfig && userId) {
        try {
          const userConfig = await getUserPanelConfig(userId, panelId);
          if (userConfig) {
            setCurrentPanelConfig(userConfig.fields);
            setCurrentPanelTitle(userConfig.title);
            if (userConfig.width) {
              setCurrentPanelWidth(userConfig.width);
            }
            if (userConfig.collapsible !== undefined) {
              setIsCollapsible(userConfig.collapsible);
            }
          }
        } catch (error) {
          console.error('Failed to load user panel config:', error);
        }
      }
    };

    loadUserConfig();
  }, [getUserPanelConfig, userId, panelId]);

  // Reset form when initialData changes
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  // Call onDataChange when form data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Get visible fields sorted by order
  const visibleFields = Object.entries(currentPanelConfig)
    .filter(([_, field]) => field.visible)
    .sort(([, a], [, b]) => a.order - b.order);

  // Handle configuration save
  const handleConfigSave = async (
    updatedConfig: PanelConfig,
    newTitle?: string,
    newWidth?: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    newCollapsible?: boolean
  ) => {
    setCurrentPanelConfig(updatedConfig);
    
    if (newTitle !== undefined) {
      setCurrentPanelTitle(newTitle);
      onTitleChange?.(newTitle);
    }
    
    if (newWidth !== undefined) {
      setCurrentPanelWidth(newWidth);
      onWidthChange?.(newWidth);
    }
    
    if (newCollapsible !== undefined) {
      setIsCollapsible(newCollapsible);
      onCollapsibleChange?.(newCollapsible);
    }

    // Save to user config if available
    if (saveUserPanelConfig && userId) {
      try {
        const panelSettings: PanelSettings = {
          title: newTitle !== undefined ? newTitle : currentPanelTitle,
          width: newWidth !== undefined ? newWidth : currentPanelWidth,
          collapsible: newCollapsible !== undefined ? newCollapsible : isCollapsible,
          showStatusIndicator: true,
          showHeader: true,
          fields: updatedConfig,
        };
        await saveUserPanelConfig(userId, panelId, panelSettings);
      } catch (error) {
        console.error('Failed to save user panel config:', error);
      }
    }
  };

  // Get width class for panel
  const getWidthClass = () => {
    if (typeof currentPanelWidth === 'number') {
      return `col-span-${currentPanelWidth}`;
    }
    
    switch (currentPanelWidth) {
      case 'quarter': return 'col-span-3';
      case 'third': return 'col-span-4';
      case 'half': return 'col-span-6';
      case 'full': return 'col-span-12';
      default: return 'col-span-12';
    }
  };

  // Get field width class
  const getFieldWidthClass = (fieldWidth?: 'third' | 'half' | 'two-thirds' | 'full') => {
    switch (fieldWidth) {
      case 'third': return 'col-span-4';
      case 'half': return 'col-span-6';
      case 'two-thirds': return 'col-span-8';
      case 'full': return 'col-span-12';
      default: return 'col-span-12';
    }
  };

  // Panel content component
  const PanelContent = () => (
    <div className="grid grid-cols-12 gap-4">
      {visibleFields.length > 0 ? (
        visibleFields.map(([fieldId, fieldConfig]) => (
          <div key={fieldId} className={getFieldWidthClass(fieldConfig.width)}>
            <Controller
              name={fieldId}
              control={control}
              defaultValue={fieldConfig.value}
              render={({ field }) => (
                <FieldRendererRHF
                  config={fieldConfig}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        ))
      ) : (
        <div className="col-span-12 text-center text-muted-foreground py-8">
          No fields configured for this panel.
        </div>
      )}
    </div>
  );

  // If panel is not visible and not in preview mode, show the visibility modal
  if (!panelVisible && !showPreview) {
    return (
      <EnhancedFieldVisibilityModal
        open={true}
        onClose={() => setPanelVisible(true)}
        panelConfig={currentPanelConfig}
        onSave={handleConfigSave}
        panelTitle={currentPanelTitle}
        panelWidth={currentPanelWidth}
        collapsible={isCollapsible}
      />
    );
  }

  // Settings button component
  const SettingsButton = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsModalOpen(true)}
      className="h-8 w-8 p-0"
    >
      <Settings className="h-4 w-4" />
    </Button>
  );

  // Main panel rendering
  if (isCollapsible) {
    return (
      <div className={getWidthClass()}>
        <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-semibold">
                      {currentPanelTitle}
                    </CardTitle>
                    <PanelStatusIndicator
                      panelConfig={currentPanelConfig}
                      formData={formData}
                      showStatus={true}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPanelVisible(!panelVisible);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      {panelVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SettingsButton />
                    </div>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <PanelContent />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <EnhancedFieldVisibilityModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          panelConfig={currentPanelConfig}
          onSave={handleConfigSave}
          panelTitle={currentPanelTitle}
          panelWidth={currentPanelWidth}
          collapsible={isCollapsible}
        />
      </div>
    );
  }

  return (
    <div className={getWidthClass()}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-semibold">
                {currentPanelTitle}
              </CardTitle>
              <PanelStatusIndicator
                panelConfig={currentPanelConfig}
                formData={formData}
                showStatus={true}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPanelVisible(!panelVisible)}
                className="h-8 w-8 p-0"
              >
                {panelVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
              <SettingsButton />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PanelContent />
        </CardContent>
      </Card>

      <EnhancedFieldVisibilityModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        panelConfig={currentPanelConfig}
        onSave={handleConfigSave}
        panelTitle={currentPanelTitle}
        panelWidth={currentPanelWidth}
        collapsible={isCollapsible}
      />
    </div>
  );
};