
export interface FieldConfig {
  id: string;
  label: string;
  fieldType: 'text' | 'select' | 'search' | 'currency' | 'date' | 'time' | 'textarea' | 'radio' | 'number' | 'currency-with-select' | 'search-with-icon' | 'dropdown-with-search' | 'summary-card';
  value: any;
  mandatory: boolean;
  visible: boolean;
  editable: boolean;
  order: number;
  width?: 'third' | 'half' | 'two-thirds' | 'full'; // Field width configuration
  options?: { label: string; value: string }[]; // For select and radio fields
  placeholder?: string;
  currencySymbol?: string; // For currency fields
  step?: number; // For number fields
  min?: number; // For number fields
  max?: number; // For number fields
  searchable?: boolean; // For dropdown fields
  summaryConfig?: { // For summary card fields
    mainValue?: string;
    subValue?: string;
    mainLabel?: string;
    subLabel?: string;
    backgroundColor?: string;
  };
}

export interface PanelConfig {
  [fieldId: string]: FieldConfig;
}

export interface PanelSettings {
  title: string;
  width?: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  collapsible?: boolean;
  showStatusIndicator?: boolean;
  showHeader?: boolean;
  fields: PanelConfig;
}

export interface DynamicPanelProps {
  panelId: string;
  panelTitle: string;
  panelConfig: PanelConfig;
  initialData?: Record<string, any>;
  onDataChange?: (updatedData: Record<string, any>) => void;
  onTitleChange?: (newTitle: string) => void;
  onWidthChange?: (newWidth: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12) => void;
  onCollapsibleChange?: (collapsible: boolean) => void;
  getUserPanelConfig?: (userId: string, panelId: string) => Promise<PanelSettings> | PanelSettings;
  saveUserPanelConfig?: (userId: string, panelId: string, settings: PanelSettings) => Promise<void> | void;
  userId?: string;
  panelWidth?: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  collapsible?: boolean;
  showPreview?: boolean;
}

export interface FieldVisibilityConfig {
  fieldId: string;
  visible: boolean;
  order: number;
  label: string;
}
