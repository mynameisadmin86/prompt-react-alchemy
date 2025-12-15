import React, { useState } from 'react';
import { ComponentInstance, useIDEStore } from '@/stores/ideStore';
import { getComponentByType } from './ComponentRegistry';
import { cn } from '@/lib/utils';
import { Trash2, Move, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasAreaProps {
  pageId: string;
  components: ComponentInstance[];
  onSelectComponent: (id: string | null) => void;
  selectedComponentId: string | null;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  pageId,
  components,
  onSelectComponent,
  selectedComponentId,
}) => {
  const { addComponent, deleteComponent, updateComponent } = useIDEStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const componentData = e.dataTransfer.getData('component');
    if (componentData) {
      const component = JSON.parse(componentData);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      addComponent(pageId, {
        type: component.type,
        config: { ...component.defaultConfig },
        position: { x, y },
        size: { width: '100%', height: 'auto' },
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const renderComponentPreview = (instance: ComponentInstance) => {
    const definition = getComponentByType(instance.type);
    if (!definition) return null;

    const Icon = definition.icon;

    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-muted-foreground">
        <Icon className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium">{definition.label}</span>
        <span className="text-xs text-muted-foreground/70 mt-1">
          {Object.keys(instance.config).length} props configured
        </span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex-1 p-6 overflow-auto bg-background/50",
        "bg-[radial-gradient(circle,hsl(var(--border))_1px,transparent_1px)]",
        "bg-[length:20px_20px]",
        isDragOver && "ring-2 ring-primary ring-inset bg-primary/5"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => onSelectComponent(null)}
    >
      {components.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Drag components here</p>
            <p className="text-sm mt-1">Drop components from the palette to start building</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {components.map((instance) => (
            <div
              key={instance.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectComponent(instance.id);
              }}
              className={cn(
                "relative p-4 rounded-lg border-2 bg-card transition-all duration-150",
                selectedComponentId === instance.id
                  ? "border-primary shadow-lg"
                  : "border-border hover:border-primary/50"
              )}
              style={{ width: instance.size.width }}
            >
              {selectedComponentId === instance.id && (
                <div className="absolute -top-3 right-2 flex gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Move className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteComponent(pageId, instance.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {renderComponentPreview(instance)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
