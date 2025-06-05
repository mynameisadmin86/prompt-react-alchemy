
export interface Column<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  mandatory?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'select';
  options?: Array<{ label: string; value: any }>;
  render?: (value: any, row: T) => React.ReactNode;
  validator?: (value: any) => boolean | string;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  column: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface GridPreferences {
  columnOrder: string[];
  hiddenColumns: string[];
  columnWidths: Record<string, number>;
  columnHeaders: Record<string, string>;
  sort?: SortConfig;
  filters: FilterConfig[];
  pageSize?: number;
}

export interface SmartGridProps<T = any> {
  // Data
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  
  // Features
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  reorderable?: boolean;
  resizable?: boolean;
  exportable?: boolean;
  bulkUpload?: boolean;
  
  // Pagination
  pagination?: boolean;
  infiniteScroll?: boolean;
  pageSize?: number;
  totalCount?: number;
  
  // Preferences
  persistPreferences?: boolean;
  preferencesKey?: string;
  
  // API Hooks
  onDataFetch?: (params: { page?: number; limit?: number; sort?: SortConfig; filters?: FilterConfig[] }) => Promise<{ data: T[]; total?: number }>;
  onUpdate?: (id: any, field: string, value: any) => Promise<boolean>;
  onBulkUpdate?: (updates: Array<{ id: any; data: Partial<T> }>) => Promise<boolean>;
  onPreferenceSave?: (preferences: GridPreferences) => Promise<void>;
  onPreferenceLoad?: () => Promise<GridPreferences | null>;
  
  // Events
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  
  // Styling
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  loading?: boolean;
  emptyMessage?: string;
}

export interface CellEditProps {
  value: any;
  column: Column;
  onSave: (value: any) => void;
  onCancel: () => void;
}
