
export interface FieldConfig {
  id: string;
  label: string;
  fieldType: 'text' | 'select' | 'search' | 'currency' | 'date' | 'time' | 'textarea';
  value: any;
  mandatory: boolean;
  visible: boolean;
  editable: boolean;
  order: number;
  options?: { label: string; value: string }[]; // For select fields
  placeholder?: string;
}

export interface PanelConfig {
  [fieldId: string]: FieldConfig;
}

export interface DynamicPanelProps {
  panelId: string;
  panelTitle: string;
  panelConfig: PanelConfig;
  initialData?: Record<string, any>;
  onDataChange?: (updatedData: Record<string, any>) => void;
  getUserPanelConfig?: (userId: string, panelId: string) => Promise<PanelConfig> | PanelConfig;
  saveUserPanelConfig?: (userId: string, panelId: string, config: PanelConfig) => Promise<void> | void;
  userId?: string;
  panelWidth?: 'full' | 'half' | 'third';
  showPreview?: boolean;
}

export interface FieldVisibilityConfig {
  fieldId: string;
  visible: boolean;
  order: number;
  label: string;
}
