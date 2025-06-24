
import React, { useState, useRef, useEffect, ComponentType } from 'react';
import { Settings } from 'lucide-react';
import { PanelConfig, PanelSettings } from './types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FlexGridPanelProps {
  config: PanelConfig;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSettingsChange: (settings: Partial<PanelSettings>) => void;
  style?: React.CSSProperties;
}

const FlexGridPanel: React.FC<FlexGridPanelProps> = ({
  config,
  isCollapsed,
  onToggleCollapse,
  onSettingsChange,
  style
}) => {
  const [settings, setSettings] = useState<PanelSettings>({
    visible: true,
    collapsible: config.collapsible,
    width: config.width
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!config.hasPullHandle) return;
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    setInitialWidth(panelRef.current?.offsetWidth || 0);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStartX;
      const newWidth = Math.max(0, initialWidth + deltaX);
      
      if (panelRef.current) {
        panelRef.current.style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Optionally save the new width to settings
        if (panelRef.current) {
          const newWidth = `${panelRef.current.offsetWidth}px`;
          setSettings(prev => ({ ...prev, width: newWidth }));
          onSettingsChange({ width: newWidth });
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartX, initialWidth, onSettingsChange]);

  const handleSettingChange = (key: keyof PanelSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange({ [key]: value });
  };

  const renderContent = () => {
    if (typeof config.content === 'function') {
      const Component = config.content as ComponentType;
      return <Component />;
    }
    return config.content;
  };

  if (!settings.visible) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={`
        relative bg-white border-r shadow transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-0 min-w-0 overflow-hidden' : ''}
      `}
      style={{
        ...style,
        width: isCollapsed ? '0' : (settings.width || config.width || 'auto'),
        minWidth: isCollapsed ? '0' : (config.minWidth || 'auto')
      }}
    >
      {/* Panel Header */}
      <div className="flex justify-between items-center text-sm font-medium bg-gray-50 px-3 py-2 border-b">
        <span>{config.title}</span>
        
        {config.hasConfigGear && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 p-1 h-6 w-6 rounded hover:bg-gray-100 text-gray-500"
                aria-label="Panel settings"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Panel Settings</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="visible-toggle" className="text-sm">Visible</Label>
                  <Switch
                    id="visible-toggle"
                    checked={settings.visible}
                    onCheckedChange={(checked) => handleSettingChange('visible', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="collapsible-toggle" className="text-sm">Collapsible</Label>
                  <Switch
                    id="collapsible-toggle"
                    checked={settings.collapsible}
                    onCheckedChange={(checked) => handleSettingChange('collapsible', checked)}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Panel Content */}
      <div className="p-4 h-full overflow-auto">
        {renderContent()}
      </div>

      {/* Pull Handle */}
      {config.hasPullHandle && settings.collapsible && (
        <div
          className={`
            absolute top-0 right-0 h-full w-2 bg-gray-300 hover:bg-gray-400 
            cursor-col-resize rounded-l transition-colors duration-200
            ${isDragging ? 'bg-gray-500' : ''}
          `}
          onMouseDown={handleMouseDown}
          onClick={onToggleCollapse}
          role="button"
          tabIndex={0}
          aria-label="Toggle left panel"
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onToggleCollapse();
            }
          }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-0.5 h-8 bg-white rounded opacity-50" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexGridPanel;
