
import { ReactNode, ComponentType } from 'react';

export interface FlexGridPanelConfig {
  id: string;
  title: string;
  visible?: boolean;
  collapsible?: boolean;
  draggable?: boolean;
  defaultCollapsed?: boolean;
  content: ReactNode | ComponentType;
  width?: string;
  height?: string;
  minWidth?: string;
  fillOnCollapseOf?: string;
}

export interface FlexGridLayoutConfig {
  layoutDirection: 'row' | 'column';
  panels: FlexGridPanelConfig[];
  className?: string;
}

export interface FlexGridPanelProps {
  panel: FlexGridPanelConfig;
  isCollapsed: boolean;
  onToggleCollapse: (panelId: string) => void;
  style?: React.CSSProperties;
  className?: string;
}
