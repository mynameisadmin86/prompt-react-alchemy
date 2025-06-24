
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import FlexGridPanel from './FlexGridPanel';
import { FlexGridLayoutConfig } from './types';

interface FlexGridLayoutProps {
  config: FlexGridLayoutConfig;
  className?: string;
}

const FlexGridLayout: React.FC<FlexGridLayoutProps> = ({ config, className }) => {
  const { layoutDirection, panels } = config;
  const [collapsedPanels, setCollapsedPanels] = useState<Set<string>>(new Set());

  // Initialize collapsed state from config
  useEffect(() => {
    const defaultCollapsed = new Set<string>();
    panels.forEach(panel => {
      if (panel.defaultCollapsed) {
        defaultCollapsed.add(panel.id);
      }
    });
    setCollapsedPanels(defaultCollapsed);
  }, [panels]);

  // Save collapsed state to localStorage
  useEffect(() => {
    const storageKey = 'flexGridLayout_collapsedPanels';
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(collapsedPanels)));
    } catch (error) {
      console.warn('Failed to save panel state to localStorage:', error);
    }
  }, [collapsedPanels]);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const storageKey = 'flexGridLayout_collapsedPanels';
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedCollapsed = JSON.parse(saved);
        setCollapsedPanels(new Set(savedCollapsed));
      }
    } catch (error) {
      console.warn('Failed to load panel state from localStorage:', error);
    }
  }, []);

  const handleToggleCollapse = (panelId: string) => {
    setCollapsedPanels(prev => {
      const next = new Set(prev);
      if (next.has(panelId)) {
        next.delete(panelId);
      } else {
        next.add(panelId);
      }
      return next;
    });
  };

  const getCalculatedStyle = (panel: any, index: number) => {
    const isCollapsed = collapsedPanels.has(panel.id);
    const style: React.CSSProperties = {};

    if (layoutDirection === 'row') {
      // Check if this panel should fill when another panel collapses
      if (panel.fillOnCollapseOf) {
        const targetPanelCollapsed = collapsedPanels.has(panel.fillOnCollapseOf);
        if (targetPanelCollapsed) {
          style.flex = '1';
          style.width = '100%';
        } else {
          style.width = panel.width || 'auto';
        }
      } else {
        if (isCollapsed) {
          style.width = panel.minWidth || '0px';
          style.minWidth = panel.minWidth || '0px';
        } else {
          style.width = panel.width || 'auto';
          style.minWidth = panel.minWidth || 'auto';
        }
      }
    } else {
      // Column layout
      if (isCollapsed) {
        style.height = '40px'; // Just header height
      } else {
        style.height = panel.height || 'auto';
      }
    }

    return style;
  };

  const visiblePanels = panels.filter(panel => panel.visible !== false);

  return (
    <div
      className={cn(
        "flex w-full h-full",
        layoutDirection === 'row' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {visiblePanels.map((panel, index) => (
        <FlexGridPanel
          key={panel.id}
          panel={panel}
          isCollapsed={collapsedPanels.has(panel.id)}
          onToggleCollapse={handleToggleCollapse}
          style={getCalculatedStyle(panel, index)}
          className={cn(
            index === visiblePanels.length - 1 && layoutDirection === 'row' && "border-r-0",
            panel.fillOnCollapseOf && "bg-gray-50"
          )}
        />
      ))}
    </div>
  );
};

export default FlexGridLayout;
