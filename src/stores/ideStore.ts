import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ComponentInstance {
  id: string;
  type: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  size: { width: string; height: string };
}

export interface IDEPage {
  id: string;
  name: string;
  route: string;
  components: ComponentInstance[];
  createdAt: string;
  updatedAt: string;
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
  setSelectedComponent: (id: string | null) => void;
  getPageByRoute: (route: string) => IDEPage | undefined;
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
        const id = `comp-${Date.now()}`;
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? { ...p, components: [...p.components, { ...component, id }], updatedAt: new Date().toISOString() }
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
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === pageId
              ? { ...p, components: p.components.filter((c) => c.id !== componentId), updatedAt: new Date().toISOString() }
              : p
          ),
          selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId,
        }));
      },

      setSelectedComponent: (id) => set({ selectedComponentId: id }),

      getPageByRoute: (route) => get().pages.find((p) => p.route === route),
    }),
    { name: 'ide-pages-storage' }
  )
);
