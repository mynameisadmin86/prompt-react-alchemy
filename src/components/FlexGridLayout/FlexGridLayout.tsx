
import React, { useState, useCallback } from 'react';
import { FlexGridPanel } from './FlexGridPanel';
import { FlexGridLayoutProps, PanelConfig } from './types';

export const FlexGridLayout: React.FC<FlexGridLayoutProps> = ({
  layoutDirection = 'column',
  panels: initialPanels,
  onPanelReorder,
  onPanelToggle,
  onPanelCollapse,
  className = '',
}) => {
  const [panels, setPanels] = useState<PanelConfig[]>(initialPanels);
  const [draggedPanel, setDraggedPanel] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, panelId: string) => {
    setDraggedPanel(panelId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', panelId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetPanelId: string) => {
    e.preventDefault();
    const draggedPanelId = e.dataTransfer.getData('text/plain');
    
    if (draggedPanelId === targetPanelId) return;

    const newPanels = [...panels];
    const draggedIndex = newPanels.findIndex(p => p.id === draggedPanelId);
    const targetIndex = newPanels.findIndex(p => p.id === targetPanelId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedPanel] = newPanels.splice(draggedIndex, 1);
      newPanels.splice(targetIndex, 0, draggedPanel);
      
      setPanels(newPanels);
      onPanelReorder?.(newPanels);
    }
    
    setDraggedPanel(null);
  }, [panels, onPanelReorder]);

  const handlePanelToggle = useCallback((panelId: string, visible: boolean) => {
    const newPanels = panels.map(panel => 
      panel.id === panelId ? { ...panel, visible } : panel
    );
    setPanels(newPanels);
    onPanelToggle?.(panelId, visible);
  }, [panels, onPanelToggle]);

  const handlePanelCollapse = useCallback((panelId: string, collapsed: boolean) => {
    const newPanels = panels.map(panel => 
      panel.id === panelId ? { ...panel, collapsed } : panel
    );
    setPanels(newPanels);
    onPanelCollapse?.(panelId, collapsed);
  }, [panels, onPanelCollapse]);

  const visiblePanels = panels.filter(panel => panel.visible);

  return (
    <div 
      className={`flex ${layoutDirection === 'row' ? 'flex-row' : 'flex-col'} gap-4 p-4 ${className}`}
    >
      {visiblePanels.map((panel) => (
        <FlexGridPanel
          key={panel.id}
          panel={panel}
          layoutDirection={layoutDirection}
          isDragging={draggedPanel === panel.id}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onToggle={handlePanelToggle}
          onCollapse={handlePanelCollapse}
        />
      ))}
    </div>
  );
};
