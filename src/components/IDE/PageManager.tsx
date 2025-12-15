import React, { useState } from 'react';
import { useIDEStore, IDEPage } from '@/stores/ideStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, FileCode, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { createSampleWorkOrderPage } from '@/utils/sampleWorkOrderPage';

export const PageManager: React.FC = () => {
  const navigate = useNavigate();
  const { pages, currentPageId, setCurrentPage, addPage, deletePage } = useIDEStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageRoute, setNewPageRoute] = useState('');

  const handleCreatePage = () => {
    if (newPageName && newPageRoute) {
      const route = newPageRoute.startsWith('/') ? newPageRoute : `/${newPageRoute}`;
      const id = addPage({
        name: newPageName,
        route: `/ide-preview${route}`,
        components: [],
      });
      setCurrentPage(id);
      setNewPageName('');
      setNewPageRoute('');
      setIsDialogOpen(false);
    }
  };

  const handlePreviewPage = (page: IDEPage) => {
    navigate(page.route);
  };

  const handleCreateSamplePage = () => {
    const pageId = createSampleWorkOrderPage();
    if (pageId) {
      setCurrentPage(pageId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Pages</h3>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={handleCreateSamplePage} title="Create Sample Work Order Page">
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setIsDialogOpen(true)} title="New Page">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {pages.length === 0 ? (
            <p className="text-xs text-muted-foreground p-2 text-center">
              No pages created yet
            </p>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className={cn(
                  "group flex items-center gap-2 p-2 rounded-md cursor-pointer",
                  "hover:bg-accent transition-colors duration-150",
                  currentPageId === page.id && "bg-accent"
                )}
                onClick={() => setCurrentPage(page.id)}
              >
                <FileCode className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{page.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{page.route}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewPage(page);
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(page.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Page Name</Label>
              <Input
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="e.g., Dashboard"
              />
            </div>
            <div className="space-y-2">
              <Label>Route Path</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/ide-preview/</span>
                <Input
                  value={newPageRoute}
                  onChange={(e) => setNewPageRoute(e.target.value)}
                  placeholder="e.g., dashboard"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePage} disabled={!newPageName || !newPageRoute}>
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
