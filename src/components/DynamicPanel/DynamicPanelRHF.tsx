import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';
import { EnhancedFieldVisibilityModal } from './EnhancedFieldVisibilityModal';
import { PanelStatusIndicator } from './PanelStatusIndicator';
import { DynamicPanelProps, PanelConfig, PanelSettings } from '@/types/dynamicPanel';

export const DynamicPanelRHF: React.FC<DynamicPanelProps> = ({
  panelId,
  panelOrder = 1,
  startingTabIndex = 1,
  panelTitle: initialPanelTitle,
  panelConfig: initialPanelConfig,
  initialData = {},
  getUserPanelConfig,
  saveUserPanelConfig,
  userId = 'default-user',
  panelWidth = 'full',
  collapsible = false,
  showPreview = false
}) => {
  const [panelConfig, setPanelConfig] = useState<PanelConfig>(initialPanelConfig);
  const [panelTitle, setPanelTitle] = useState(initialPanelTitle);
  const [currentPanelWidth, setCurrentPanelWidth] = useState<'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>(panelWidth);
  const [isCollapsible, setIsCollapsible] = useState(collapsible);
  const [panelVisible, setPanelVisible] = useState(true);
  const [showStatusIndicator, setShowStatusIndicator] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Create validation rules based on panel config
  const validationRules = useMemo(() => {
    const rules: Record<string, any> = {};
    Object.entries(panelConfig).forEach(([fieldId, config]) => {
      if (config.mandatory) {
        rules[fieldId] = {
          required: `${config.label} is required`
        };
      }
    });
    return rules;
  }, [panelConfig]);

  // Initialize form with react-hook-form
  const form = useForm({
    defaultValues: initialData,
    mode: 'onChange',
    shouldUnregister: false
  });

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
            if (userSettings.collapsible !== undefined) {
              setIsCollapsible(userSettings.collapsible);
            }
            if (userSettings.showStatusIndicator !== undefined) {
              setShowStatusIndicator(userSettings.showStatusIndicator);
            }
            if (userSettings.showHeader !== undefined) {
              setShowHeader(userSettings.showHeader);
            }
          }
        } catch (error) {
          console.error('Failed to load user panel config:', error);
        }
      }
    };

    loadUserConfig();
  }, [getUserPanelConfig, userId, panelId]);

  // Get visible fields sorted by order with calculated tab indices
  const visibleFields = useMemo(() => {
    const fields = Object.entries(panelConfig)
      .filter(([_, config]) => config.visible)
      .sort(([_, a], [__, b]) => a.order - b.order)
      .map(([fieldId, config], index) => {
        const tabIndex = config.editable ? startingTabIndex + index : -1;
        return {
          fieldId,
          config,
          tabIndex
        };
      });
    
    return fields;
  }, [panelConfig, panelOrder, startingTabIndex]);

  const handleConfigSave = async (
    updatedConfig: PanelConfig, 
    newTitle?: string, 
    newWidth?: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    newCollapsible?: boolean,
    newPanelVisible?: boolean,
    newShowHeader?: boolean
  ) => {
    setPanelConfig(updatedConfig);
    
    if (newTitle !== undefined) {
      setPanelTitle(newTitle);
    }

    if (newWidth !== undefined) {
      setCurrentPanelWidth(newWidth);
    }

    if (newCollapsible !== undefined) {
      setIsCollapsible(newCollapsible);
    }

    if (newPanelVisible !== undefined) {
      setPanelVisible(newPanelVisible);
    }

    if (newShowHeader !== undefined) {
      setShowHeader(newShowHeader);
    }
    
    if (saveUserPanelConfig) {
      try {
        const settings: PanelSettings = {
          title: newTitle || panelTitle,
          width: newWidth || currentPanelWidth,
          collapsible: newCollapsible !== undefined ? newCollapsible : isCollapsible,
          showStatusIndicator: showStatusIndicator,
          showHeader: newShowHeader !== undefined ? newShowHeader : showHeader,
          fields: updatedConfig
        };
        await saveUserPanelConfig(userId, panelId, settings);
      } catch (error) {
        console.error('Failed to save user panel config:', error);
      }
    }
  };

  // Determine panel width class based on 12-column grid system
  const getWidthClass = () => {
    if (typeof currentPanelWidth === 'number') {
      const colSpan = Math.min(Math.max(currentPanelWidth, 1), 12);
      return `col-span-${colSpan}`;
    }
    
    switch (currentPanelWidth) {
      case 'half':
        return 'col-span-6';
      case 'third':
        return 'col-span-4';
      case 'quarter':
        return 'col-span-3';
      case 'full':
      default:
        return 'col-span-12';
    }
  };

  const getFieldWidthClass = (fieldWidth?: 'third' | 'half' | 'two-thirds' | 'full') => {
    switch (fieldWidth) {
      case 'third':
        return 'col-span-4';
      case 'half':
        return 'col-span-6';
      case 'two-thirds':
        return 'col-span-8';
      case 'full':
      default:
        return 'col-span-12';
    }
  };

  const PanelContent = () => {
    const { watch } = useFormContext();
    const formData = watch();

    return (
      <div className="grid grid-cols-12 gap-4">
        {visibleFields.map(({ fieldId, config, tabIndex }) => (
          <div key={`${panelId}-${fieldId}`} className={`space-y-1 ${getFieldWidthClass(config.width)}`}>
            <label className="text-xs font-medium text-gray-600 block">
              {config.label}
              {config.mandatory && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <FieldRenderer
              key={`${panelId}-${fieldId}-renderer`}
              config={config}
              fieldId={fieldId}
              tabIndex={tabIndex}
              validation={validationRules[fieldId]}
            />
          </div>
        ))}
        
        {visibleFields.length === 0 && !showPreview && (
          <div className="col-span-12 text-center text-gray-500 py-8 text-sm">
            No visible fields configured. Click the settings icon to configure fields.
          </div>
        )}
      </div>
    );
  };

  // Don't render the panel if it's not visible
  if (!panelVisible && !showPreview) {
    return (
      <EnhancedFieldVisibilityModal
        open={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        panelConfig={panelConfig}
        panelTitle={panelTitle}
        panelWidth={currentPanelWidth}
        collapsible={isCollapsible}
        panelVisible={panelVisible}
        showHeader={showHeader}
        onSave={handleConfigSave}
      />
    );
  }

  const SettingsButton = () => (
    !showPreview && isHovered && (
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsConfigModalOpen(true);
        }}
        className="h-6 w-6 text-gray-400 hover:text-gray-600"
      >
        <Settings className="h-3 w-3" />
      </Button>
    )
  );

  const PanelStatusIndicatorWithData = () => {
    const { watch } = useFormContext();
    const formData = watch();
    
    return (
      <PanelStatusIndicator 
        panelConfig={panelConfig}
        formData={formData}
        showStatus={showStatusIndicator}
      />
    );
  };

  if (isCollapsible) {
    return (
      <FormProvider {...form}>
        <Collapsible 
          open={isOpen} 
          onOpenChange={setIsOpen} 
          className={`${getWidthClass()}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className="border border-gray-200 shadow-sm">
            {showHeader ? (
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-purple-500 rounded"></div>
                    <CardTitle className="text-sm font-medium text-gray-700">{panelTitle}</CardTitle>
                    <PanelStatusIndicatorWithData />
                    {showPreview && (
                      <span className="text-xs text-blue-600 font-medium">DB000023/42</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <SettingsButton />
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
            ) : (
              <div className="absolute top-2 right-2 z-10">
                <SettingsButton />
              </div>
            )}
            
            <CollapsibleContent>
              <CardContent className={`px-4 pb-4 ${!showHeader ? 'pt-8' : ''}`}>
                <PanelContent />
              </CardContent>
            </CollapsibleContent>

            {!showPreview && (
              <EnhancedFieldVisibilityModal
                open={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                panelConfig={panelConfig}
                panelTitle={panelTitle}
                panelWidth={currentPanelWidth}
                collapsible={isCollapsible}
                panelVisible={panelVisible}
                showHeader={showHeader}
                onSave={handleConfigSave}
              />
            )}
          </Card>
        </Collapsible>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...form}>
      <Card 
        className={`${getWidthClass()} border border-gray-200 shadow-sm relative`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showHeader ? (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-purple-500 rounded"></div>
              <CardTitle className="text-sm font-medium text-gray-700">{panelTitle}</CardTitle>
              <PanelStatusIndicatorWithData />
              {showPreview && (
                <span className="text-xs text-blue-600 font-medium">DB000023/42</span>
              )}
            </div>
            <SettingsButton />
          </CardHeader>
        ) : (
          <div className="absolute top-2 right-2 z-10">
            <SettingsButton />
          </div>
        )}
        
        <CardContent className={`px-4 pb-4 ${!showHeader ? 'pt-8' : ''}`}>
          <PanelContent />
        </CardContent>

        {!showPreview && (
          <EnhancedFieldVisibilityModal
            open={isConfigModalOpen}
            onClose={() => setIsConfigModalOpen(false)}
            panelConfig={panelConfig}
            panelTitle={panelTitle}
            panelWidth={currentPanelWidth}
            collapsible={isCollapsible}
            panelVisible={panelVisible}
            showHeader={showHeader}
            onSave={handleConfigSave}
          />
        )}
      </Card>
    </FormProvider>
  );
};