import React from 'react';
import { useParams } from 'react-router-dom';
import { useIDEStore, ComponentInstance, ComponentStyle } from '@/stores/ideStore';
import { SmartGrid, SmartGridPlus, SmartGridWithGrouping, SmartGridWithNestedRows } from '@/components/SmartGrid';
import { DynamicPanel, SimpleDynamicPanel } from '@/components/DynamicPanel';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { SmartEquipmentCalendar } from '@/components/SmartEquipmentCalendar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, FileDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { icons } from 'lucide-react';

// Component renderers for actual components
const componentMap: Record<string, React.ComponentType<any>> = {
  SmartGrid,
  SmartGridPlus,
  SmartGridWithGrouping,
  SmartGridWithNestedRows,
  DynamicPanel,
  SimpleDynamicPanel,
  FlexGridLayout,
  SmartEquipmentCalendar,
  Badge: ({ text, variant }: { text: string; variant: string }) => (
    <Badge variant={variant as any}>{text}</Badge>
  ),
};

// Layout container types
const layoutTypes = ['Row', 'Column', 'Section', 'Card', 'Header', 'Footer', 'Sidebar'];

const IDEPreviewPage: React.FC = () => {
  const { '*': routePath } = useParams();
  const navigate = useNavigate();
  const { pages } = useIDEStore();

  const fullRoute = `/ide-preview/${routePath || ''}`;
  const page = pages.find((p) => p.route === fullRoute);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-4">The page "{fullRoute}" does not exist.</p>
          <Button onClick={() => navigate('/ide')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to IDE
          </Button>
        </div>
      </div>
    );
  }

  // Get root-level components (no parent)
  const getRootComponents = () => 
    page.components.filter(c => !c.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Get children of a parent
  const getChildren = (parentId: string) =>
    page.components.filter(c => c.parentId === parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Convert style object to CSS properties
  const styleToCSS = (style?: ComponentStyle): React.CSSProperties => {
    if (!style) return {};
    return {
      backgroundColor: style.backgroundColor,
      padding: style.padding,
      margin: style.margin,
      border: style.border,
      borderRadius: style.borderRadius,
      gap: style.gap,
      justifyContent: style.justifyContent,
      alignItems: style.alignItems,
      flexDirection: style.flexDirection as any,
      flexWrap: style.flexWrap as any,
      flex: style.flex,
      minHeight: style.minHeight,
      minWidth: style.minWidth,
      maxHeight: style.maxHeight,
      maxWidth: style.maxWidth,
      overflow: style.overflow,
    };
  };

  // Render a button from config
  const renderButton = (config: any, index: number) => {
    const IconComponent = config.iconName ? (icons as any)[config.iconName] : null;
    const variant = config.variant || 'default';
    
    return (
      <Button 
        key={index} 
        variant={variant as any} 
        size="sm"
        className={config.className}
        disabled={config.disabled}
      >
        {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
        {config.label}
      </Button>
    );
  };

  // Render component recursively
  const renderComponent = (instance: ComponentInstance): React.ReactNode => {
    const children = getChildren(instance.id);
    const baseStyle = styleToCSS(instance.style);

    // Layout containers
    if (instance.type === 'Row') {
      return (
        <div 
          key={instance.id} 
          className="flex flex-row"
          style={{ ...baseStyle, display: 'flex', flexDirection: 'row', width: instance.size.width, minHeight: instance.size.height }}
        >
          {children.map(renderComponent)}
        </div>
      );
    }

    if (instance.type === 'Column') {
      return (
        <div 
          key={instance.id} 
          className="flex flex-col"
          style={{ ...baseStyle, display: 'flex', flexDirection: 'column', width: instance.size.width, height: instance.size.height }}
        >
          {children.map(renderComponent)}
        </div>
      );
    }

    if (instance.type === 'Section') {
      return (
        <div 
          key={instance.id} 
          className="rounded-lg"
          style={{ ...baseStyle, width: instance.size.width, height: instance.size.height }}
        >
          {instance.config.title && (
            <h2 className="text-lg font-semibold mb-4 text-foreground">{instance.config.title}</h2>
          )}
          {children.map(renderComponent)}
        </div>
      );
    }

    if (instance.type === 'Card') {
      return (
        <Card 
          key={instance.id} 
          style={{ ...baseStyle, width: instance.size.width, height: instance.size.height }}
        >
          {instance.config.title && (
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{instance.config.title}</CardTitle>
            </CardHeader>
          )}
          <CardContent className={instance.config.title ? '' : 'pt-4'}>
            {children.map(renderComponent)}
          </CardContent>
        </Card>
      );
    }

    if (instance.type === 'Header') {
      return (
        <header 
          key={instance.id} 
          className="border-b border-border"
          style={{ ...baseStyle, width: instance.size.width }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {instance.config.title && (
                <h1 className="text-xl font-semibold text-foreground">{instance.config.title}</h1>
              )}
              {instance.config.subtitle && (
                <span className="text-sm text-muted-foreground">{instance.config.subtitle}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {children.map(renderComponent)}
            </div>
          </div>
        </header>
      );
    }

    if (instance.type === 'Footer') {
      return (
        <footer 
          key={instance.id} 
          className="border-t border-border bg-card"
          style={{ ...baseStyle, width: instance.size.width }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {instance.config.leftButtons?.map(renderButton)}
            </div>
            <div className="flex items-center gap-3">
              {instance.config.rightButtons?.map(renderButton)}
            </div>
          </div>
        </footer>
      );
    }

    if (instance.type === 'Sidebar') {
      return (
        <aside 
          key={instance.id} 
          className="border-r border-border"
          style={{ ...baseStyle, width: instance.size.width, height: instance.size.height }}
        >
          {children.map(renderComponent)}
        </aside>
      );
    }

    if (instance.type === 'Button') {
      const IconComponent = instance.config.iconName ? (icons as any)[instance.config.iconName] : null;
      return (
        <Button
          key={instance.id}
          variant={instance.config.variant || 'default'}
          size={instance.config.size || 'sm'}
          className={instance.config.className}
          style={baseStyle}
        >
          {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
          {instance.config.label}
        </Button>
      );
    }

    if (instance.type === 'ButtonGroup') {
      return (
        <div key={instance.id} className="flex items-center gap-2" style={baseStyle}>
          {instance.config.buttons?.map((btn: any, i: number) => renderButton(btn, i))}
        </div>
      );
    }

    if (instance.type === 'Text') {
      const Tag = instance.config.variant === 'heading' ? 'h2' : 
                  instance.config.variant === 'subheading' ? 'h3' : 'p';
      const className = instance.config.variant === 'heading' ? 'text-xl font-semibold text-foreground' :
                        instance.config.variant === 'subheading' ? 'text-base font-medium text-foreground' :
                        instance.config.variant === 'muted' ? 'text-sm text-muted-foreground' :
                        'text-sm text-foreground';
      return (
        <Tag key={instance.id} className={className} style={baseStyle}>
          {instance.config.content}
        </Tag>
      );
    }

    // Actual components (grids, panels, etc.)
    const Component = componentMap[instance.type];
    if (Component) {
      return (
        <div key={instance.id} style={{ width: instance.size.width, height: instance.size.height, ...baseStyle }}>
          <Component {...instance.config} />
        </div>
      );
    }

    return (
      <div key={instance.id} className="p-4 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">Unknown component: {instance.type}</p>
      </div>
    );
  };

  const rootComponents = getRootComponents();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-12 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate('/ide')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to IDE
        </Button>
        <div className="h-4 w-px bg-border" />
        <span className="font-medium text-foreground">{page.name}</span>
        <span className="text-xs text-muted-foreground">{page.route}</span>
      </header>
      <main className="flex-1 flex flex-col">
        {rootComponents.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            This page has no components. Add some in the IDE.
          </div>
        ) : (
          rootComponents.map(renderComponent)
        )}
      </main>
    </div>
  );
};

export default IDEPreviewPage;
