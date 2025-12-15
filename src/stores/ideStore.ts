import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ComponentStyle {
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
  gap?: string;
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  flexWrap?: string;
  flex?: string;
  minHeight?: string;
  minWidth?: string;
  maxHeight?: string;
  maxWidth?: string;
  overflow?: string;
}

export interface ComponentInstance {
  id: string;
  type: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  size: { width: string; height: string };
  parentId?: string | null; // For nested components
  style?: ComponentStyle;
  order?: number; // For ordering within parent
}

export interface IDEPage {
  id: string;
  name: string;
  route: string;
  components: ComponentInstance[];
  createdAt: string;
  updatedAt: string;
  pageStyle?: ComponentStyle;
}

interface IDEState {
  pages: IDEPage[];
  currentPageId: string | null;
  selectedComponentId: string | null;
  addPage: (page: Omit<IDEPage, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePage: (id: string, updates: Partial<IDEPage>) => void;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string | null) => void;
  addComponent: (pageId: string, component: Omit<ComponentInstance, 'id'>) => void;
  updateComponent: (pageId: string, componentId: string, updates: Partial<ComponentInstance>) => void;
  deleteComponent: (pageId: string, componentId: string) => void;
  moveComponent: (pageId: string, componentId: string, newParentId: string | null, newOrder: number) => void;
  setSelectedComponent: (id: string | null) => void;
  getPageByRoute: (route: string) => IDEPage | undefined;
  getChildComponents: (pageId: string, parentId: string | null) => ComponentInstance[];
  reorderComponents: (pageId: string, parentId: string | null, orderedIds: string[]) => void;
}

export const useIDEStore = create<IDEState>()(
  persist(
    (set, get) => ({
      pages: [],
      currentPageId: null,
      selectedComponentId: null,

      addPage: (page) => {
        const id = `page-${Date.now()}`;
        const newPage: IDEPage = {
          ...page,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ pages: [...state.pages, newPage] }));
        return id;
      },

      updatePage: (id, updates) => {
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deletePage: (id) => {
        set((state) => ({
          pages: state.pages.filter((p) => p.id !== id),
          currentPageId: state.currentPageId === id ? null : state.currentPageId,
        }));
      },

      setCurrentPage: (id) => set({ currentPageId: id, selectedComponentId: null }),

      addComponent: (pageId, component) => {
        const id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const state = get();
        const page = state.pages.find(p => p.id === pageId);
        const siblings = page?.components.filter(c => c.parentId === component.parentId) || [];
        const order = siblings.length;
        
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? { 
                  ...p, 
                  components: [...p.components, { ...component, id, order }], 
                  updatedAt: new Date().toISOString() 
                }
              : p
          ),
        }));
      },

      updateComponent: (pageId, componentId, updates) => {
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  components: p.components.map((c) => (c.id === componentId ? { ...c, ...updates } : c)),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      deleteComponent: (pageId, componentId) => {
        // Also delete all children recursively
        const deleteRecursive = (components: ComponentInstance[], idToDelete: string): ComponentInstance[] => {
          const childIds = components.filter(c => c.parentId === idToDelete).map(c => c.id);
          let remaining = components.filter(c => c.id !== idToDelete);
          childIds.forEach(childId => {
            remaining = deleteRecursive(remaining, childId);
          });
          return remaining;
        };

        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? { ...p, components: deleteRecursive(p.components, componentId), updatedAt: new Date().toISOString() }
              : p
          ),
          selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId,
        }));
      },

      moveComponent: (pageId, componentId, newParentId, newOrder) => {
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  components: p.components.map((c) => 
                    c.id === componentId 
                      ? { ...c, parentId: newParentId, order: newOrder } 
                      : c
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      setSelectedComponent: (id) => set({ selectedComponentId: id }),

      getPageByRoute: (route) => get().pages.find((p) => p.route === route),

      getChildComponents: (pageId, parentId) => {
        const page = get().pages.find(p => p.id === pageId);
        if (!page) return [];
        return page.components
          .filter(c => c.parentId === parentId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      },

      reorderComponents: (pageId, parentId, orderedIds) => {
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  components: p.components.map((c) => {
                    if (c.parentId === parentId) {
                      const newOrder = orderedIds.indexOf(c.id);
                      return newOrder >= 0 ? { ...c, order: newOrder } : c;
                    }
                    return c;
                  }),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },
    }),
    { name: 'ide-pages-storage' }
  )
);
