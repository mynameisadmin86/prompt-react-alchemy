
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';
import { EnhancedFieldVisibilityModal } from './EnhancedFieldVisibilityModal';
import { PanelStatusIndicator } from './PanelStatusIndicator';
import { DynamicPanelProps, PanelConfig, PanelSettings } from '@/types/dynamicPanel';

export const DynamicPanel: React.FC<DynamicPanelProps> = ({
  panelId,
  panelTitle: initialPanelTitle,
  panelConfig: initialPanelConfig,
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
  showPreview = false
}) => {
  const [panelConfig, setPanelConfig] = useState<PanelConfig>(initialPanelConfig);
  const [panelTitle, setPanelTitle] = useState(initialPanelTitle);
  const [currentPanelWidth, setCurrentPanelWidth] = useState<'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>(panelWidth);
  const [isCollapsible, setIsCollapsible] = useState(collapsible);
  const [panelVisible, setPanelVisible] = useState(true);
  const [showStatusIndicator, setShowStatusIndicator] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
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
            if (userSettings.collapsible !== undefined) {
              setIsCollapsible(userSettings.collapsible);
            }
            if (userSettings.showStatusIndicator !== undefined) {
              setShowStatusIndicator(userSettings.showStatusIndicator);
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

  const handleConfigSave = async (
    updatedConfig: PanelConfig, 
    newTitle?: string, 
    newWidth?: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    newCollapsible?: boolean,
    newPanelVisible?: boolean
  ) => {
    setPanelConfig(updatedConfig);
    
    if (newTitle !== undefined) {
      setPanelTitle(newTitle);
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

    if (newPanelVisible !== undefined) {
      setPanelVisible(newPanelVisible);
    }
    
    if (saveUserPanelConfig) {
      try {
        const settings: PanelSettings = {
          title: newTitle || panelTitle,
          width: newWidth || currentPanelWidth,
          collapsible: newCollapsible !== undefined ? newCollapsible : isCollapsible,
          showStatusIndicator: showStatusIndicator,
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
      const colSpan = Math.min(Math.max(currentPanelWidth, 1), 12); // Clamp between 1-12
      return `col-span-${colSpan}`;
    }
    
    switch (currentPanelWidth) {
      case 'half':
        return 'col-span-6'; // 6/12 = 50%
      case 'third':
        return 'col-span-4'; // 4/12 = 33.33%
      case 'quarter':
        return 'col-span-3'; // 3/12 = 25%
      case 'full':
      default:
        return 'col-span-12'; // Full width
    }
  };

  const PanelContent = () => (
    <>
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
    </>
  );

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
        onSave={handleConfigSave}
      />
    );
  }

  if (isCollapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className={`${getWidthClass()}`}>
        <Card className="border border-gray-200 shadow-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-500 rounded"></div>
                <CardTitle className="text-sm font-medium text-gray-700">{panelTitle}</CardTitle>
                <PanelStatusIndicator 
                  panelConfig={panelConfig}
                  formData={formData}
                  showStatus={showStatusIndicator}
                />
                {showPreview && (
                  <span className="text-xs text-blue-600 font-medium">DB000023/42</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!showPreview && (
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
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="px-4 pb-4">
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
              onSave={handleConfigSave}
            />
          )}
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card className={`${getWidthClass()} border border-gray-200 shadow-sm`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-purple-500 rounded"></div>
          <CardTitle className="text-sm font-medium text-gray-700">{panelTitle}</CardTitle>
          <PanelStatusIndicator 
            panelConfig={panelConfig}
            formData={formData}
            showStatus={showStatusIndicator}
          />
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
          onSave={handleConfigSave}
        />
      )}
    </Card>
  );
};
