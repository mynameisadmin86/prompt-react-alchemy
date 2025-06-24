
import React, { useState, useEffect } from 'react';
import FlexGridPanel from './FlexGridPanel';
import { LayoutConfig, PanelSettings } from './types';

interface FlexGridLayoutProps {
  config: LayoutConfig;
  className?: string;
}

const FlexGridLayout: React.FC<FlexGridLayoutProps> = ({ config, className = '' }) => {
  const [collapsedPanels, setCollapsedPanels] = useState<Set<string>>(new Set());
  const [panelSettings, setPanelSettings] = useState<Record<string, PanelSettings>>({});

  // Initialize panel settings and collapsed state
  useEffect(() => {
    const initialSettings: Record<string, PanelSettings> = {};
    const initialCollapsed = new Set<string>();

    config.panels.forEach(panel => {
      // Load from localStorage if available
      const savedSettings = localStorage.getItem(`panel-settings-${panel.id}`);
      const savedCollapsed = localStorage.getItem(`panel-collapsed-${panel.id}`);

      initialSettings[panel.id] = savedSettings 
        ? JSON.parse(savedSettings)
        : {
            visible: true,
            collapsible: panel.collapsible,
            width: panel.width
          };

      if (savedCollapsed === 'true' || (!savedCollapsed && panel.defaultCollapsed)) {
        initialCollapsed.add(panel.id);
      }
    });

    setPanelSettings(initialSettings);
    setCollapsedPanels(initialCollapsed);
  }, [config.panels]);

  const togglePanelCollapse = (panelId: string) => {
    setCollapsedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(panelId)) {
        newSet.delete(panelId);
        localStorage.setItem(`panel-collapsed-${panelId}`, 'false');
      } else {
        newSet.add(panelId);
        localStorage.setItem(`panel-collapsed-${panelId}`, 'true');
      }
      return newSet;
    });
  };

  const handlePanelSettingsChange = (panelId: string, settings: Partial<PanelSettings>) => {
    setPanelSettings(prev => {
      const newSettings = { ...prev[panelId], ...settings };
      localStorage.setItem(`panel-settings-${panelId}`, JSON.stringify(newSettings));
      return { ...prev, [panelId]: newSettings };
    });
  };

  const getPanelStyle = (panel: any) => {
    const isCollapsed = collapsedPanels.has(panel.id);
    const settings = panelSettings[panel.id];
    
    // Handle fillOnCollapseOf logic
    if (panel.fillOnCollapseOf) {
      const targetPanelCollapsed = collapsedPanels.has(panel.fillOnCollapseOf);
      return {
        flex: targetPanelCollapsed ? '1' : '1',
        minWidth: targetPanelCollapsed ? '100%' : 'auto'
      };
    }

    return {
      width: isCollapsed ? '0' : (settings?.width || panel.width || 'auto'),
      minWidth: isCollapsed ? '0' : (panel.minWidth || 'auto')
    };
  };

  return (
    <div className={`flex w-full h-full ${config.layoutDirection === 'column' ? 'flex-col' : 'flex-row'} ${className}`}>
      {config.panels.map(panel => {
        const settings = panelSettings[panel.id];
        if (!settings?.visible) return null;

        return (
          <FlexGridPanel
            key={panel.id}
            config={panel}
            isCollapsed={collapsedPanels.has(panel.id)}
            onToggleCollapse={() => togglePanelCollapse(panel.id)}
            onSettingsChange={(newSettings) => handlePanelSettingsChange(panel.id, newSettings)}
            style={getPanelStyle(panel)}
          />
        );
      })}
    </div>
  );
};

export default FlexGridLayout;
