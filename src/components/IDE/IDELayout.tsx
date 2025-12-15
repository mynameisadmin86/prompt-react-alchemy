import React, { useState } from 'react';
import { useIDEStore } from '@/stores/ideStore';
import { ComponentPalette } from './ComponentPalette';
import { CanvasArea } from './CanvasArea';
import { PropertiesPanel } from './PropertiesPanel';
import { PageManager } from './PageManager';
import { ComponentTree } from './ComponentTree';
import { ComponentDefinition } from './ComponentRegistry';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Component, Settings2, TreePine, Eye, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
        <div className="flex items-center gap-4">
          {currentPage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Editing:</span>
              <span className="font-medium text-foreground">{currentPage.name}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded">{currentPage.route}</span>
            </div>
          )}
          {currentPage && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/ide-preview${currentPage.route}`} target="_blank">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to={`/ide-preview${currentPage.route}`} target="_blank">
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar - Pages, Components & Tree */}
          <ResizablePanel defaultSize={22} minSize={18} maxSize={35}>
            <Tabs defaultValue="components" className="h-full flex flex-col">
              <TabsList className="w-full rounded-none border-b border-border bg-muted/30 grid grid-cols-3">
                <TabsTrigger value="pages" className="gap-1 text-xs">
                  <Layers className="h-3 w-3" />
                  Pages
                </TabsTrigger>
                <TabsTrigger value="components" className="gap-1 text-xs">
                  <Component className="h-3 w-3" />
                  Palette
                </TabsTrigger>
                <TabsTrigger value="tree" className="gap-1 text-xs">
                  <TreePine className="h-3 w-3" />
                  Tree
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pages" className="flex-1 m-0 overflow-hidden">
                <PageManager />
              </TabsContent>
              <TabsContent value="components" className="flex-1 m-0 overflow-hidden">
                <ComponentPalette onDragStart={setDraggingComponent} />
              </TabsContent>
              <TabsContent value="tree" className="flex-1 m-0 overflow-auto">
                {currentPage && (
                  <ComponentTree 
                    pageId={currentPage.id}
                    selectedComponentId={selectedComponentId}
                    onSelectComponent={setSelectedComponent}
                  />
                )}
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas */}
          <ResizablePanel defaultSize={53}>
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
