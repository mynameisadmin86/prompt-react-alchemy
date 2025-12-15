import React from 'react';
import { getComponentsByCategory, ComponentDefinition } from './ComponentRegistry';
import { cn } from '@/lib/utils';

interface ComponentPaletteProps {
  onDragStart: (component: ComponentDefinition) => void;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onDragStart }) => {
  const categorizedComponents = getComponentsByCategory();

  return (
    <div className="h-full overflow-y-auto p-4 bg-muted/30">
      <h3 className="text-sm font-semibold text-foreground mb-4">Components</h3>
      {Object.entries(categorizedComponents).map(([category, components]) => (
        <div key={category} className="mb-6">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {category}
          </h4>
          <div className="space-y-1">
            {components.map((comp) => (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('component', JSON.stringify(comp));
                  onDragStart(comp);
                }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md cursor-grab",
                  "bg-background border border-border",
                  "hover:bg-accent hover:border-accent-foreground/20",
                  "transition-colors duration-150",
                  "active:cursor-grabbing"
                )}
              >
                <comp.icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{comp.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
