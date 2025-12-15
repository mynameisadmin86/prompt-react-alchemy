import React from 'react';
import { ComponentInstance, useIDEStore } from '@/stores/ideStore';
import { getComponentByType, isContainerComponent } from './ComponentRegistry';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComponentTreeProps {
  pageId: string;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
}

export const ComponentTree: React.FC<ComponentTreeProps> = ({
  pageId,
  selectedComponentId,
  onSelectComponent,
}) => {
  const { getChildComponents } = useIDEStore();
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderTreeNode = (component: ComponentInstance, depth: number = 0): React.ReactNode => {
    const definition = getComponentByType(component.type);
    if (!definition) return null;

    const Icon = definition.icon;
    const isContainer = isContainerComponent(component.type);
    const children = isContainer ? getChildComponents(pageId, component.id) : [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(component.id);
    const isSelected = selectedComponentId === component.id;

    return (
      <div key={component.id}>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded-md text-sm",
            isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
          )}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => onSelectComponent(component.id)}
        >
          <GripVertical className="h-3 w-3 text-muted-foreground/50 cursor-grab" />
          {hasChildren ? (
            <Button
              size="icon"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(component.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-4" />
          )}
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate flex-1">
            {component.config.title || component.config.label || definition.label}
          </span>
          {isContainer && (
            <span className="text-xs text-muted-foreground">
              ({children.length})
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootComponents = getChildComponents(pageId, null);

  return (
    <div className="py-2">
      {rootComponents.length === 0 ? (
        <p className="px-4 py-2 text-xs text-muted-foreground">
          No components yet
        </p>
      ) : (
        rootComponents.map(component => renderTreeNode(component, 0))
      )}
    </div>
  );
};
