
import React, { ComponentType } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlexGridPanelProps } from './types';

const FlexGridPanel: React.FC<FlexGridPanelProps> = ({
  panel,
  isCollapsed,
  onToggleCollapse,
  style,
  className
}) => {
  const {
    id,
    title,
    collapsible = false,
    content,
  } = panel;

  const handleToggleCollapse = () => {
    if (collapsible) {
      onToggleCollapse(id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleCollapse();
    }
  };

  return (
    <div
      className={cn(
        "bg-white border-r shadow-sm transition-all duration-300 relative",
        isCollapsed && "overflow-hidden",
        className
      )}
      style={style}
    >
      {/* Panel Header */}
      <div className="flex justify-between items-center text-sm font-medium bg-gray-50 px-3 py-2 border-b">
        <span className="truncate">{title}</span>
        {collapsible && (
          <button
            onClick={handleToggleCollapse}
            onKeyDown={handleKeyDown}
            className="p-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={!isCollapsed}
            aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${title} panel`}
            tabIndex={0}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Panel Content */}
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"
      )}>
        <div className="p-4">
          {typeof content === 'function' ? React.createElement(content as ComponentType) : content}
        </div>
      </div>
    </div>
  );
};

export default FlexGridPanel;
