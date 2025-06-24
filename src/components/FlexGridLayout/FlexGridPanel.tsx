
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelConfig } from './types';

interface FlexGridPanelProps {
  panel: PanelConfig;
  layoutDirection: 'row' | 'column';
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, panelId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, panelId: string) => void;
  onToggle: (panelId: string, visible: boolean) => void;
  onCollapse: (panelId: string, collapsed: boolean) => void;
}

export const FlexGridPanel: React.FC<FlexGridPanelProps> = ({
  panel,
  layoutDirection,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onToggle,
  onCollapse,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(panel.defaultCollapsed || false);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse(panel.id, newCollapsed);
  };

  const handleToggleVisibility = () => {
    onToggle(panel.id, !panel.visible);
  };

  const panelStyle = {
    width: layoutDirection === 'row' ? panel.width : undefined,
    height: layoutDirection === 'column' ? panel.height : undefined,
  };

  const renderContent = () => {
    if (typeof panel.content === 'function') {
      const ContentComponent = panel.content;
      return <ContentComponent />;
    }
    return panel.content;
  };

  return (
    <div
      className={`
        border rounded bg-white shadow-sm transition-all duration-300
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isCollapsed ? 'min-h-[60px]' : ''}
      `}
      style={panelStyle}
      draggable={panel.draggable}
      onDragStart={(e) => panel.draggable && onDragStart(e, panel.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, panel.id)}
    >
      {/* Panel Header */}
      <div className="flex justify-between items-center bg-gray-50 px-3 py-2 text-sm font-medium border-b">
        <div className="flex items-center gap-2">
          {panel.draggable && (
            <div 
              className="cursor-move p-1 rounded hover:bg-gray-100"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>
          )}
          <span className="text-gray-700">{panel.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-100"
            onClick={handleToggleVisibility}
            title={panel.visible ? "Hide panel" : "Show panel"}
          >
            {panel.visible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>
          
          {panel.collapsible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={handleCollapse}
              title={isCollapsed ? "Expand panel" : "Collapse panel"}
            >
              {isCollapsed ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronUp className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Panel Content */}
      <div 
        className={`
          p-2 transition-all duration-300 overflow-hidden
          ${isCollapsed ? 'max-h-0 p-0' : 'max-h-full'}
        `}
      >
        {!isCollapsed && renderContent()}
      </div>
    </div>
  );
};
