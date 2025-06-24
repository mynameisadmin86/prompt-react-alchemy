
import { ReactNode, ComponentType } from 'react';

export interface PanelConfig {
  id: string;
  title: string;
  visible: boolean;
  collapsible: boolean;
  draggable: boolean;
  defaultCollapsed?: boolean;
  content: ReactNode | ComponentType;
  width?: string;
  height?: string;
  collapsed?: boolean;
}

export interface FlexGridLayoutProps {
  layoutDirection?: 'row' | 'column';
  panels: PanelConfig[];
  onPanelReorder?: (panels: PanelConfig[]) => void;
  onPanelToggle?: (panelId: string, visible: boolean) => void;
  onPanelCollapse?: (panelId: string, collapsed: boolean) => void;
  className?: string;
}
