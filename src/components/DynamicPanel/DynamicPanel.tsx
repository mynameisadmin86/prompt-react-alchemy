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
  const [showHeader, setShowHeader] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState(initialData);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    newPanelVisible?: boolean,
    newShowHeader?: boolean
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

  // Determine panel width class based on Bootstrap 4 grid system
  const getWidthClass = () => {
    if (typeof currentPanelWidth === 'number') {
      const colSize = Math.min(Math.max(currentPanelWidth, 1), 12); // Clamp between 1-12
      return `col-${colSize}`;
    }
    
    switch (currentPanelWidth) {
      case 'half':
        return 'col-6'; // 6/12 = 50%
      case 'third':
        return 'col-4'; // 4/12 = 33.33%
      case 'quarter':
        return 'col-3'; // 3/12 = 25%
      case 'full':
      default:
        return 'col-12'; // Full width
    }
  };

  const getFieldWidthClass = (fieldWidth?: 'third' | 'half' | 'two-thirds' | 'full') => {
    switch (fieldWidth) {
      case 'third':
        return 'col-4'; // 4/12 = 1/3
      case 'half':
        return 'col-6'; // 6/12 = 1/2 (50%)
      case 'two-thirds':
        return 'col-8'; // 8/12 = 2/3
      case 'full':
      default:
        return 'col-12'; // 12/12 = 100%
    }
  };

  const PanelContent = () => (
    <>
      <div className="row">
        {visibleFields.map(([fieldId, fieldConfig]) => (
          <div key={fieldId} className={`mb-3 ${getFieldWidthClass(fieldConfig.width)}`}>
            <label className="form-label small text-muted">
              {fieldConfig.label}
              {fieldConfig.mandatory && (
                <span className="text-danger ml-1">*</span>
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
        <div className="text-center text-muted py-4">
          <small>No visible fields configured. Click the settings icon to configure fields.</small>
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
        className="btn btn-sm btn-outline-secondary border-0 p-1"
        style={{ width: '24px', height: '24px' }}
      >
        <Settings size={12} />
      </Button>
    )
  );

  if (isCollapsible) {
    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        className={`${getWidthClass()}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="card border shadow-sm">
          {showHeader ? (
            <CollapsibleTrigger asChild>
              <CardHeader className="card-header d-flex flex-row justify-content-between align-items-center py-3 px-3 cursor-pointer">
                <div className="d-flex align-items-center">
                  <div className="border border-primary rounded mr-2" style={{ width: '20px', height: '20px' }}></div>
                  <CardTitle className="h6 mb-0 text-muted">{panelTitle}</CardTitle>
                  <PanelStatusIndicator 
                    panelConfig={panelConfig}
                    formData={formData}
                    showStatus={showStatusIndicator}
                  />
                  {showPreview && (
                    <span className="badge badge-primary ml-2">DB000023/42</span>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <SettingsButton />
                  {isOpen ? (
                    <ChevronUp size={16} className="text-muted ml-2" />
                  ) : (
                    <ChevronDown size={16} className="text-muted ml-2" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
          ) : (
            <div className="position-absolute" style={{ top: '8px', right: '8px', zIndex: 10 }}>
              <SettingsButton />
            </div>
          )}
          
          <CollapsibleContent>
            <CardContent className={`card-body px-3 pb-3 ${!showHeader ? 'pt-5' : ''}`}>
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
    );
  }

  return (
    <Card 
      className={`${getWidthClass()} card border shadow-sm position-relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showHeader ? (
        <CardHeader className="card-header d-flex flex-row justify-content-between align-items-center py-3 px-3">
          <div className="d-flex align-items-center">
            <div className="border border-primary rounded mr-2" style={{ width: '20px', height: '20px' }}></div>
            <CardTitle className="h6 mb-0 text-muted">{panelTitle}</CardTitle>
            <PanelStatusIndicator 
              panelConfig={panelConfig}
              formData={formData}
              showStatus={showStatusIndicator}
            />
            {showPreview && (
              <span className="badge badge-primary ml-2">DB000023/42</span>
            )}
          </div>
          <SettingsButton />
        </CardHeader>
      ) : (
        <div className="position-absolute" style={{ top: '8px', right: '8px', zIndex: 10 }}>
          <SettingsButton />
        </div>
      )}
      
      <CardContent className={`card-body px-3 pb-3 ${!showHeader ? 'pt-5' : ''}`}>
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
  );
};
