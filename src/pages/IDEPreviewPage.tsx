import React from 'react';
import { useParams } from 'react-router-dom';
import { useIDEStore } from '@/stores/ideStore';
import { getComponentByType } from '@/components/IDE/ComponentRegistry';
import { SmartGrid, SmartGridPlus, SmartGridWithGrouping, SmartGridWithNestedRows } from '@/components/SmartGrid';
import { DynamicPanel, SimpleDynamicPanel } from '@/components/DynamicPanel';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { SmartEquipmentCalendar } from '@/components/SmartEquipmentCalendar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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

  const renderComponent = (instance: any) => {
    const Component = componentMap[instance.type];
    if (!Component) {
      return (
        <div key={instance.id} className="p-4 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Unknown component: {instance.type}</p>
        </div>
      );
    }

    return (
      <div key={instance.id} style={{ width: instance.size.width, height: instance.size.height }}>
        <Component {...instance.config} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-12 border-b border-border bg-card flex items-center px-4 gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/ide')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to IDE
        </Button>
        <div className="h-4 w-px bg-border" />
        <span className="font-medium text-foreground">{page.name}</span>
        <span className="text-xs text-muted-foreground">{page.route}</span>
      </header>
      <main className="p-6 space-y-4">
        {page.components.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            This page has no components. Add some in the IDE.
          </div>
        ) : (
          page.components.map(renderComponent)
        )}
      </main>
    </div>
  );
};

export default IDEPreviewPage;
