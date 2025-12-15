import React, { useState } from 'react';
import { ComponentInstance, useIDEStore } from '@/stores/ideStore';
import { getComponentByType, isContainerComponent } from './ComponentRegistry';
import { cn } from '@/lib/utils';
import { Trash2, Move, Settings, Plus, ChevronDown, ChevronRight } from 'lucide-react';
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
  const { addComponent, deleteComponent, getChildComponents } = useIDEStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverParentId, setDragOverParentId] = useState<string | null>(null);
  const [collapsedContainers, setCollapsedContainers] = useState<Set<string>>(new Set());

  const handleDrop = (e: React.DragEvent, parentId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragOverParentId(null);

    const componentData = e.dataTransfer.getData('component');
    if (componentData) {
      const component = JSON.parse(componentData);
      addComponent(pageId, {
        type: component.type,
        config: { ...component.defaultConfig },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 'auto' },
        parentId,
        style: {},
      });
    }
  };

  const handleDragOver = (e: React.DragEvent, parentId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (parentId === null) {
      setIsDragOver(true);
    } else {
      setDragOverParentId(parentId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverParentId(null);
  };

  const toggleContainerCollapse = (id: string) => {
    setCollapsedContainers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getContainerStyle = (instance: ComponentInstance): React.CSSProperties => {
    const style: React.CSSProperties = {};
    const config = instance.config;
    const customStyle = instance.style || {};

    if (instance.type === 'Row') {
      style.display = 'flex';
      style.flexDirection = 'row';
      style.gap = config.gap || '16px';
      style.justifyContent = config.justifyContent || 'flex-start';
      style.alignItems = config.alignItems || 'stretch';
      style.flexWrap = config.wrap ? 'wrap' : 'nowrap';
    } else if (instance.type === 'Column') {
      style.display = 'flex';
      style.flexDirection = 'column';
      style.gap = config.gap || '16px';
      style.justifyContent = config.justifyContent || 'flex-start';
      style.alignItems = config.alignItems || 'stretch';
    } else if (instance.type === 'Footer') {
      style.display = 'flex';
      style.justifyContent = config.justifyContent || 'flex-end';
      style.gap = '8px';
      style.padding = '12px 16px';
      if (config.showBorder) {
        style.borderTop = '1px solid hsl(var(--border))';
      }
    } else if (instance.type === 'Header') {
      style.display = 'flex';
      style.alignItems = 'center';
      style.justifyContent = 'space-between';
      style.padding = '12px 16px';
      style.borderBottom = '1px solid hsl(var(--border))';
    }

    // Apply custom styles
    if (customStyle.backgroundColor) style.backgroundColor = customStyle.backgroundColor;
    if (customStyle.padding) style.padding = customStyle.padding;
    if (customStyle.margin) style.margin = customStyle.margin;
    if (customStyle.border) style.border = customStyle.border;
    if (customStyle.borderRadius) style.borderRadius = customStyle.borderRadius;
    if (customStyle.gap) style.gap = customStyle.gap;

    return style;
  };

  const renderComponentPreview = (instance: ComponentInstance, depth: number = 0): React.ReactNode => {
    const definition = getComponentByType(instance.type);
    if (!definition) return null;

    const Icon = definition.icon;
    const isContainer = isContainerComponent(instance.type);
    const children = isContainer ? getChildComponents(pageId, instance.id) : [];
    const isCollapsed = collapsedContainers.has(instance.id);
    const isDropTarget = dragOverParentId === instance.id;

    // Card/Section specific rendering
    if (instance.type === 'Card' || instance.type === 'Section') {
      const config = instance.config;
      return (
        <div 
          className={cn(
            "rounded-lg overflow-hidden",
            instance.type === 'Card' && config.elevated && "shadow-md",
            config.showBorder !== false && "border border-border"
          )}
          style={getContainerStyle(instance)}
        >
          {(config.title || config.showHeader) && (
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-2">
                {config.collapsible && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleContainerCollapse(instance.id);
                    }}
                  >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                )}
                <span className="font-medium text-sm">{config.title || definition.label}</span>
              </div>
            </div>
          )}
          {!isCollapsed && (
            <div 
              className={cn(
                "p-4 min-h-[60px]",
                isDropTarget && "bg-primary/10 ring-2 ring-primary ring-inset"
              )}
              onDrop={(e) => handleDrop(e, instance.id)}
              onDragOver={(e) => handleDragOver(e, instance.id)}
              onDragLeave={handleDragLeave}
            >
              {children.length > 0 ? (
                <div className="space-y-3">
                  {children.map(child => renderComponent(child, depth + 1))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs border-2 border-dashed border-border rounded p-4">
                  <Plus className="h-4 w-4 mr-1" /> Drop components here
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Button Group rendering
    if (instance.type === 'ButtonGroup') {
      const buttons = instance.config.buttons || [];
      return (
        <div className="flex gap-2" style={{ gap: instance.config.gap }}>
          {buttons.map((btn: any, idx: number) => (
            <Button key={idx} variant={btn.variant as any} size={btn.size as any}>
              {btn.label}
            </Button>
          ))}
        </div>
      );
    }

    // Button rendering
    if (instance.type === 'Button') {
      return (
        <Button variant={instance.config.variant as any} size={instance.config.size as any}>
          {instance.config.label}
        </Button>
      );
    }

    // Text rendering
    if (instance.type === 'Text') {
      const variant = instance.config.variant;
      const content = instance.config.content;
      const className = cn(
        variant === 'h1' && 'text-3xl font-bold',
        variant === 'h2' && 'text-2xl font-semibold',
        variant === 'h3' && 'text-xl font-medium',
        variant === 'body' && 'text-base',
        variant === 'small' && 'text-sm',
        variant === 'muted' && 'text-sm text-muted-foreground',
      );
      return <p className={className}>{content}</p>;
    }

    // Container rendering (Row, Column, etc.)
    if (isContainer) {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            {children.length > 0 && (
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleContainerCollapse(instance.id);
                }}
              >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">{definition.label}</span>
            {instance.config.title && (
              <span className="text-xs text-foreground">: {instance.config.title}</span>
            )}
          </div>
          {!isCollapsed && (
            <div 
              className={cn(
                "min-h-[40px] rounded border-2 border-dashed border-border p-2",
                isDropTarget && "border-primary bg-primary/5"
              )}
              style={getContainerStyle(instance)}
              onDrop={(e) => handleDrop(e, instance.id)}
              onDragOver={(e) => handleDragOver(e, instance.id)}
              onDragLeave={handleDragLeave}
            >
              {children.length > 0 ? (
                children.map(child => (
                  <div key={child.id} style={{ flex: child.size.width === '100%' ? '1' : 'none', width: child.size.width !== '100%' ? child.size.width : undefined }}>
                    {renderComponent(child, depth + 1)}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Drop here
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Default component preview
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[80px] text-muted-foreground">
        <Icon className="h-6 w-6 mb-1" />
        <span className="text-xs font-medium">{definition.label}</span>
        <span className="text-xs text-muted-foreground/70">
          {Object.keys(instance.config).length} props
        </span>
      </div>
    );
  };

  const renderComponent = (instance: ComponentInstance, depth: number = 0): React.ReactNode => {
    const definition = getComponentByType(instance.type);
    if (!definition) return null;

    const isSelected = selectedComponentId === instance.id;
    const isContainer = isContainerComponent(instance.type);

    return (
      <div
        key={instance.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent(instance.id);
        }}
        className={cn(
          "relative rounded-lg border-2 bg-card transition-all duration-150",
          isSelected ? "border-primary shadow-lg" : "border-transparent hover:border-primary/30",
          depth > 0 && "ml-0"
        )}
        style={{ 
          width: instance.size.width,
          ...(!isContainer ? { padding: '12px' } : { padding: '8px' }),
        }}
      >
        {isSelected && (
          <div className="absolute -top-3 right-2 flex gap-1 z-10">
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <Move className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 bg-background"
              onClick={(e) => e.stopPropagation()}
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
        {renderComponentPreview(instance, depth)}
      </div>
    );
  };

  // Get root-level components (no parent)
  const rootComponents = getChildComponents(pageId, null);

  return (
    <div
      className={cn(
        "flex-1 p-6 overflow-auto bg-background/50",
        "bg-[radial-gradient(circle,hsl(var(--border))_1px,transparent_1px)]",
        "bg-[length:20px_20px]",
        isDragOver && "ring-2 ring-primary ring-inset bg-primary/5"
      )}
      onDrop={(e) => handleDrop(e, null)}
      onDragOver={(e) => handleDragOver(e, null)}
      onDragLeave={handleDragLeave}
      onClick={() => onSelectComponent(null)}
    >
      {rootComponents.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Drag components here</p>
            <p className="text-sm mt-1">Start with a layout component (Row, Column, Section) to organize your page</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {rootComponents.map((instance) => renderComponent(instance, 0))}
        </div>
      )}
    </div>
  );
};
