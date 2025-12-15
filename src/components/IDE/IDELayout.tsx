import React, { useState } from 'react';
import { useIDEStore } from '@/stores/ideStore';
import { ComponentPalette } from './ComponentPalette';
import { CanvasArea } from './CanvasArea';
import { PropertiesPanel } from './PropertiesPanel';
import { PageManager } from './PageManager';
import { ComponentDefinition } from './ComponentRegistry';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Component, Settings2 } from 'lucide-react';

export const IDELayout: React.FC = () => {
  const { pages, currentPageId, selectedComponentId, setSelectedComponent } = useIDEStore();
  const [draggingComponent, setDraggingComponent] = useState<ComponentDefinition | null>(null);

  const currentPage = pages.find((p) => p.id === currentPageId);
  const selectedComponent = currentPage?.components.find((c) => c.id === selectedComponentId) || null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b border-border bg-card flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Component className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Visual IDE</h1>
        </div>
        {currentPage && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Editing:</span>
            <span className="font-medium text-foreground">{currentPage.name}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded">{currentPage.route}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar - Pages & Components */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Tabs defaultValue="pages" className="h-full flex flex-col">
              <TabsList className="w-full rounded-none border-b border-border bg-muted/30">
                <TabsTrigger value="pages" className="flex-1 gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  Pages
                </TabsTrigger>
                <TabsTrigger value="components" className="flex-1 gap-1">
                  <Component className="h-3.5 w-3.5" />
                  Components
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pages" className="flex-1 m-0 overflow-hidden">
                <PageManager />
              </TabsContent>
              <TabsContent value="components" className="flex-1 m-0 overflow-hidden">
                <ComponentPalette onDragStart={setDraggingComponent} />
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas */}
          <ResizablePanel defaultSize={55}>
            {currentPage ? (
              <CanvasArea
                pageId={currentPage.id}
                components={currentPage.components}
                onSelectComponent={setSelectedComponent}
                selectedComponentId={selectedComponentId}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-muted/20">
                <div className="text-center text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Page Selected</p>
                  <p className="text-sm mt-1">Create or select a page to start building</p>
                </div>
              </div>
            )}
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Sidebar - Properties */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full flex flex-col">
              <div className="h-10 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Properties</span>
              </div>
              <div className="flex-1 overflow-hidden">
                {currentPage && (
                  <PropertiesPanel pageId={currentPage.id} component={selectedComponent} />
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
