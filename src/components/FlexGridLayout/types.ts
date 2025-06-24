
import { ReactNode, ComponentType } from 'react';

export interface PanelConfig {
  id: string;
  title: string;
  collapsible: boolean;
  defaultCollapsed: boolean;
  width?: string;
  minWidth?: string;
  hasPullHandle?: boolean;
  hasConfigGear?: boolean;
  fillOnCollapseOf?: string;
  content: ReactNode | ComponentType;
}

export interface LayoutConfig {
  layoutDirection: 'row' | 'column';
  panels: PanelConfig[];
}

export interface PanelSettings {
  visible: boolean;
  collapsible: boolean;
  width?: string;
}
