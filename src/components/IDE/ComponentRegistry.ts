import { 
  Grid, Table, Calendar, FileText, Layout, LayoutGrid, Layers, FormInput, Badge,
  Columns, Rows, PanelTop, PanelBottom, Square, RectangleHorizontal, Navigation,
  Home, Menu, SidebarIcon, Footprints, ToggleLeft, Type, MousePointer
} from 'lucide-react';
import { ArrayItemSchema } from './ArrayFieldEditor';

export interface ComponentDefinition {
  type: string;
  label: string;
  category: string;
  icon: any;
  defaultConfig: Record<string, any>;
  configSchema: ConfigField[];
  isContainer?: boolean; // Can contain child components
  acceptsChildren?: string[]; // Types of children it accepts (empty = all)
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'json' | 'array' | 'color';
  options?: { label: string; value: any }[];
  defaultValue?: any;
  // For array type
  itemSchema?: ArrayItemSchema[];
  itemLabel?: string;
  defaultItem?: Record<string, any>;
}

// Style schema for all components
export const styleSchema: ConfigField[] = [
  { key: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '' },
  { key: 'padding', label: 'Padding', type: 'text', defaultValue: '' },
  { key: 'margin', label: 'Margin', type: 'text', defaultValue: '' },
  { key: 'border', label: 'Border', type: 'text', defaultValue: '' },
  { key: 'borderRadius', label: 'Border Radius', type: 'text', defaultValue: '' },
  { key: 'gap', label: 'Gap', type: 'text', defaultValue: '' },
];

// Column type options for grids
const columnTypeOptions = [
  { label: 'Text', value: 'Text' },
  { label: 'Editable Text', value: 'EditableText' },
  { label: 'Integer', value: 'Integer' },
  { label: 'Link', value: 'Link' },
  { label: 'Badge', value: 'Badge' },
  { label: 'Date', value: 'Date' },
  { label: 'DateTime', value: 'DateTime' },
  { label: 'DateTimeRange', value: 'DateTimeRange' },
  { label: 'Select', value: 'Select' },
  { label: 'Lazy Select', value: 'LazySelect' },
  { label: 'Checkbox', value: 'Checkbox' },
  { label: 'Action Button', value: 'ActionButton' },
];

// Schema for grid columns
const gridColumnSchema: ArrayItemSchema[] = [
  { key: 'key', label: 'Key', type: 'text', defaultValue: '' },
  { key: 'label', label: 'Label', type: 'text', defaultValue: '' },
  { key: 'type', label: 'Type', type: 'select', options: columnTypeOptions, defaultValue: 'Text' },
  { key: 'sortable', label: 'Sortable', type: 'boolean', defaultValue: true },
  { key: 'filterable', label: 'Filterable', type: 'boolean', defaultValue: true },
  { key: 'editable', label: 'Editable', type: 'boolean', defaultValue: false },
  { key: 'width', label: 'Width (px)', type: 'number', defaultValue: 150 },
];

// Field type options for panels
const fieldTypeOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Select', value: 'select' },
  { label: 'Lazy Select', value: 'lazyselect' },
  { label: 'Date', value: 'date' },
  { label: 'DateTime', value: 'datetime' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Radio', value: 'radio' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Search Text', value: 'searchtext' },
  { label: 'Switch', value: 'switch' },
];

// Schema for panel fields
const panelFieldSchema: ArrayItemSchema[] = [
  { key: 'id', label: 'Field ID', type: 'text', defaultValue: '' },
  { key: 'label', label: 'Label', type: 'text', defaultValue: '' },
  { key: 'fieldType', label: 'Field Type', type: 'select', options: fieldTypeOptions, defaultValue: 'text' },
  { key: 'mandatory', label: 'Mandatory', type: 'boolean', defaultValue: false },
  { key: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
  { key: 'editable', label: 'Editable', type: 'boolean', defaultValue: true },
  { key: 'width', label: 'Width', type: 'text', defaultValue: '50%' },
];

// Button schema
const buttonSchema: ArrayItemSchema[] = [
  { key: 'id', label: 'Button ID', type: 'text', defaultValue: '' },
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Button' },
  { key: 'variant', label: 'Variant', type: 'select', options: [
    { label: 'Default', value: 'default' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Outline', value: 'outline' },
    { label: 'Ghost', value: 'ghost' },
    { label: 'Destructive', value: 'destructive' },
    { label: 'Link', value: 'link' },
  ], defaultValue: 'default' },
  { key: 'size', label: 'Size', type: 'select', options: [
    { label: 'Default', value: 'default' },
    { label: 'Small', value: 'sm' },
    { label: 'Large', value: 'lg' },
  ], defaultValue: 'default' },
];

export const componentRegistry: ComponentDefinition[] = [
  // === LAYOUT COMPONENTS ===
  {
    type: 'PageLayout',
    label: 'Page Layout',
    category: 'Layout',
    icon: Layout,
    isContainer: true,
    defaultConfig: {
      showHeader: true,
      showFooter: true,
      showSidebar: false,
      sidebarPosition: 'left',
    },
    configSchema: [
      { key: 'showHeader', label: 'Show Header', type: 'boolean', defaultValue: true },
      { key: 'showFooter', label: 'Show Footer', type: 'boolean', defaultValue: true },
      { key: 'showSidebar', label: 'Show Sidebar', type: 'boolean', defaultValue: false },
      { key: 'sidebarPosition', label: 'Sidebar Position', type: 'select', options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ], defaultValue: 'left' },
    ],
  },
  {
    type: 'Row',
    label: 'Row (Horizontal)',
    category: 'Layout',
    icon: Columns,
    isContainer: true,
    defaultConfig: {
      gap: '16px',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      wrap: false,
    },
    configSchema: [
      { key: 'gap', label: 'Gap', type: 'text', defaultValue: '16px' },
      { key: 'justifyContent', label: 'Justify Content', type: 'select', options: [
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Space Between', value: 'space-between' },
        { label: 'Space Around', value: 'space-around' },
        { label: 'Space Evenly', value: 'space-evenly' },
      ], defaultValue: 'flex-start' },
      { key: 'alignItems', label: 'Align Items', type: 'select', options: [
        { label: 'Stretch', value: 'stretch' },
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
      ], defaultValue: 'stretch' },
      { key: 'wrap', label: 'Wrap', type: 'boolean', defaultValue: false },
    ],
  },
  {
    type: 'Column',
    label: 'Column (Vertical)',
    category: 'Layout',
    icon: Rows,
    isContainer: true,
    defaultConfig: {
      gap: '16px',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
    configSchema: [
      { key: 'gap', label: 'Gap', type: 'text', defaultValue: '16px' },
      { key: 'justifyContent', label: 'Justify Content', type: 'select', options: [
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Space Between', value: 'space-between' },
      ], defaultValue: 'flex-start' },
      { key: 'alignItems', label: 'Align Items', type: 'select', options: [
        { label: 'Stretch', value: 'stretch' },
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
      ], defaultValue: 'stretch' },
    ],
  },
  {
    type: 'Section',
    label: 'Section',
    category: 'Layout',
    icon: Square,
    isContainer: true,
    defaultConfig: {
      title: '',
      collapsible: false,
      collapsed: false,
      showBorder: true,
    },
    configSchema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: '' },
      { key: 'collapsible', label: 'Collapsible', type: 'boolean', defaultValue: false },
      { key: 'collapsed', label: 'Start Collapsed', type: 'boolean', defaultValue: false },
      { key: 'showBorder', label: 'Show Border', type: 'boolean', defaultValue: true },
    ],
  },
  {
    type: 'Card',
    label: 'Card/Panel',
    category: 'Layout',
    icon: RectangleHorizontal,
    isContainer: true,
    defaultConfig: {
      title: 'Card Title',
      showHeader: true,
      showFooter: false,
      elevated: true,
    },
    configSchema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Card Title' },
      { key: 'showHeader', label: 'Show Header', type: 'boolean', defaultValue: true },
      { key: 'showFooter', label: 'Show Footer', type: 'boolean', defaultValue: false },
      { key: 'elevated', label: 'Elevated (Shadow)', type: 'boolean', defaultValue: true },
    ],
  },
  
  // === HEADER/NAVIGATION ===
  {
    type: 'Header',
    label: 'Header',
    category: 'Navigation',
    icon: PanelTop,
    isContainer: true,
    defaultConfig: {
      title: 'App Title',
      showLogo: true,
      showSearch: true,
      showNotifications: true,
      showUserMenu: true,
    },
    configSchema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'App Title' },
      { key: 'showLogo', label: 'Show Logo', type: 'boolean', defaultValue: true },
      { key: 'showSearch', label: 'Show Search', type: 'boolean', defaultValue: true },
      { key: 'showNotifications', label: 'Show Notifications', type: 'boolean', defaultValue: true },
      { key: 'showUserMenu', label: 'Show User Menu', type: 'boolean', defaultValue: true },
    ],
  },
  {
    type: 'Breadcrumb',
    label: 'Breadcrumb',
    category: 'Navigation',
    icon: Navigation,
    defaultConfig: {
      items: [
        { label: 'Home', path: '/' },
        { label: 'Section', path: '/section' },
        { label: 'Current Page', path: '' },
      ],
      separator: '>',
    },
    configSchema: [
      { key: 'items', label: 'Items (JSON)', type: 'json', defaultValue: [] },
      { key: 'separator', label: 'Separator', type: 'text', defaultValue: '>' },
    ],
  },
  {
    type: 'Sidebar',
    label: 'Sidebar',
    category: 'Navigation',
    icon: SidebarIcon,
    isContainer: true,
    defaultConfig: {
      collapsed: false,
      position: 'left',
      width: '250px',
    },
    configSchema: [
      { key: 'collapsed', label: 'Collapsed', type: 'boolean', defaultValue: false },
      { key: 'position', label: 'Position', type: 'select', options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ], defaultValue: 'left' },
      { key: 'width', label: 'Width', type: 'text', defaultValue: '250px' },
    ],
  },
  {
    type: 'SidebarItem',
    label: 'Sidebar Item',
    category: 'Navigation',
    icon: Menu,
    defaultConfig: {
      label: 'Menu Item',
      icon: 'Home',
      path: '/',
      active: false,
    },
    configSchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Menu Item' },
      { key: 'icon', label: 'Icon Name', type: 'text', defaultValue: 'Home' },
      { key: 'path', label: 'Path', type: 'text', defaultValue: '/' },
      { key: 'active', label: 'Active', type: 'boolean', defaultValue: false },
    ],
  },

  // === FOOTER ===
  {
    type: 'Footer',
    label: 'Footer',
    category: 'Navigation',
    icon: PanelBottom,
    isContainer: true,
    defaultConfig: {
      sticky: true,
      showBorder: true,
      justifyContent: 'flex-end',
    },
    configSchema: [
      { key: 'sticky', label: 'Sticky', type: 'boolean', defaultValue: true },
      { key: 'showBorder', label: 'Show Border', type: 'boolean', defaultValue: true },
      { key: 'justifyContent', label: 'Button Alignment', type: 'select', options: [
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Space Between', value: 'space-between' },
      ], defaultValue: 'flex-end' },
    ],
  },
  {
    type: 'ButtonGroup',
    label: 'Button Group',
    category: 'UI Elements',
    icon: MousePointer,
    defaultConfig: {
      buttons: [
        { id: 'cancel', label: 'Cancel', variant: 'ghost' },
        { id: 'save', label: 'Save', variant: 'outline' },
        { id: 'submit', label: 'Submit', variant: 'default' },
      ],
      gap: '8px',
    },
    configSchema: [
      { key: 'gap', label: 'Gap', type: 'text', defaultValue: '8px' },
      {
        key: 'buttons',
        label: 'Buttons',
        type: 'array',
        itemSchema: buttonSchema,
        itemLabel: 'Button',
        defaultItem: { id: '', label: 'Button', variant: 'default', size: 'default' },
      },
    ],
  },

  // === DATA DISPLAY ===
  {
    type: 'SmartGrid',
    label: 'Smart Grid',
    category: 'Data Display',
    icon: Table,
    defaultConfig: {
      columns: [],
      data: [],
      showToolbar: true,
      enableFiltering: true,
      enableSorting: true,
    },
    configSchema: [
      { key: 'showToolbar', label: 'Show Toolbar', type: 'boolean', defaultValue: true },
      { key: 'enableFiltering', label: 'Enable Filtering', type: 'boolean', defaultValue: true },
      { key: 'enableSorting', label: 'Enable Sorting', type: 'boolean', defaultValue: true },
      { 
        key: 'columns', 
        label: 'Columns', 
        type: 'array', 
        itemSchema: gridColumnSchema,
        itemLabel: 'Column',
        defaultItem: { key: '', label: '', type: 'Text', sortable: true, filterable: true, editable: false },
      },
      { key: 'data', label: 'Data (JSON)', type: 'json', defaultValue: [] },
    ],
  },
  {
    type: 'SmartGridPlus',
    label: 'Smart Grid Plus',
    category: 'Data Display',
    icon: Grid,
    defaultConfig: {
      columns: [],
      data: [],
      showToolbar: true,
      inlineRowAddition: true,
      inlineRowEditing: true,
    },
    configSchema: [
      { key: 'showToolbar', label: 'Show Toolbar', type: 'boolean', defaultValue: true },
      { key: 'inlineRowAddition', label: 'Inline Row Addition', type: 'boolean', defaultValue: true },
      { key: 'inlineRowEditing', label: 'Inline Row Editing', type: 'boolean', defaultValue: true },
      { 
        key: 'columns', 
        label: 'Columns', 
        type: 'array', 
        itemSchema: gridColumnSchema,
        itemLabel: 'Column',
        defaultItem: { key: '', label: '', type: 'Text', sortable: true, filterable: true, editable: false },
      },
      { key: 'data', label: 'Data (JSON)', type: 'json', defaultValue: [] },
    ],
  },
  {
    type: 'SmartGridWithGrouping',
    label: 'Smart Grid with Grouping',
    category: 'Data Display',
    icon: Layers,
    defaultConfig: {
      columns: [],
      data: [],
      showGroupingDropdown: true,
      groupableColumns: [],
    },
    configSchema: [
      { key: 'showGroupingDropdown', label: 'Show Grouping Dropdown', type: 'boolean', defaultValue: true },
      { 
        key: 'columns', 
        label: 'Columns', 
        type: 'array', 
        itemSchema: gridColumnSchema,
        itemLabel: 'Column',
        defaultItem: { key: '', label: '', type: 'Text', sortable: true, filterable: true, editable: false },
      },
      { key: 'data', label: 'Data (JSON)', type: 'json', defaultValue: [] },
    ],
  },
  {
    type: 'SmartGridWithNestedRows',
    label: 'Smart Grid with Nested Rows',
    category: 'Data Display',
    icon: LayoutGrid,
    defaultConfig: {
      columns: [],
      data: [],
      nestedRowKey: 'children',
    },
    configSchema: [
      { key: 'nestedRowKey', label: 'Nested Row Key', type: 'text', defaultValue: 'children' },
      { 
        key: 'columns', 
        label: 'Columns', 
        type: 'array', 
        itemSchema: gridColumnSchema,
        itemLabel: 'Column',
        defaultItem: { key: '', label: '', type: 'Text', sortable: true, filterable: true, editable: false },
      },
      { key: 'data', label: 'Data (JSON)', type: 'json', defaultValue: [] },
    ],
  },

  // === FORMS ===
  {
    type: 'DynamicPanel',
    label: 'Dynamic Panel',
    category: 'Forms',
    icon: FormInput,
    defaultConfig: {
      panelId: 'panel-1',
      panelTitle: 'Dynamic Panel',
      panelConfig: {},
      columns: 2,
    },
    configSchema: [
      { key: 'panelId', label: 'Panel ID', type: 'text', defaultValue: 'panel-1' },
      { key: 'panelTitle', label: 'Panel Title', type: 'text', defaultValue: 'Dynamic Panel' },
      { key: 'columns', label: 'Columns', type: 'number', defaultValue: 2 },
      { 
        key: 'fields', 
        label: 'Fields', 
        type: 'array', 
        itemSchema: panelFieldSchema,
        itemLabel: 'Field',
        defaultItem: { id: '', label: '', fieldType: 'text', mandatory: false, visible: true, editable: true, width: '50%' },
      },
    ],
  },
  {
    type: 'SimpleDynamicPanel',
    label: 'Simple Dynamic Panel',
    category: 'Forms',
    icon: FileText,
    defaultConfig: {
      panelId: 'simple-panel-1',
      panelTitle: 'Simple Panel',
      fields: [],
    },
    configSchema: [
      { key: 'panelId', label: 'Panel ID', type: 'text', defaultValue: 'simple-panel-1' },
      { key: 'panelTitle', label: 'Panel Title', type: 'text', defaultValue: 'Simple Panel' },
      { 
        key: 'fields', 
        label: 'Fields', 
        type: 'array', 
        itemSchema: panelFieldSchema,
        itemLabel: 'Field',
        defaultItem: { id: '', label: '', fieldType: 'text', mandatory: false, visible: true, editable: true, width: '50%' },
      },
    ],
  },

  // === UI ELEMENTS ===
  {
    type: 'Button',
    label: 'Button',
    category: 'UI Elements',
    icon: MousePointer,
    defaultConfig: {
      label: 'Button',
      variant: 'default',
      size: 'default',
    },
    configSchema: [
      { key: 'label', label: 'Label', type: 'text', defaultValue: 'Button' },
      { key: 'variant', label: 'Variant', type: 'select', options: [
        { label: 'Default', value: 'default' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Destructive', value: 'destructive' },
        { label: 'Link', value: 'link' },
      ], defaultValue: 'default' },
      { key: 'size', label: 'Size', type: 'select', options: [
        { label: 'Default', value: 'default' },
        { label: 'Small', value: 'sm' },
        { label: 'Large', value: 'lg' },
      ], defaultValue: 'default' },
    ],
  },
  {
    type: 'Text',
    label: 'Text',
    category: 'UI Elements',
    icon: Type,
    defaultConfig: {
      content: 'Text content',
      variant: 'body',
    },
    configSchema: [
      { key: 'content', label: 'Content', type: 'text', defaultValue: 'Text content' },
      { key: 'variant', label: 'Variant', type: 'select', options: [
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Body', value: 'body' },
        { label: 'Small', value: 'small' },
        { label: 'Muted', value: 'muted' },
      ], defaultValue: 'body' },
    ],
  },
  {
    type: 'Badge',
    label: 'Badge',
    category: 'UI Elements',
    icon: Badge,
    defaultConfig: {
      text: 'Badge',
      variant: 'default',
    },
    configSchema: [
      { key: 'text', label: 'Text', type: 'text', defaultValue: 'Badge' },
      { key: 'variant', label: 'Variant', type: 'select', options: [
        { label: 'Default', value: 'default' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Destructive', value: 'destructive' },
        { label: 'Outline', value: 'outline' },
      ], defaultValue: 'default' },
    ],
  },

  // === CALENDAR ===
  {
    type: 'SmartEquipmentCalendar',
    label: 'Equipment Calendar',
    category: 'Calendar',
    icon: Calendar,
    defaultConfig: {
      equipment: [],
      events: [],
      viewType: 'week',
    },
    configSchema: [
      { key: 'viewType', label: 'View Type', type: 'select', options: [
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
      ], defaultValue: 'week' },
      { key: 'equipment', label: 'Equipment (JSON)', type: 'json', defaultValue: [] },
      { key: 'events', label: 'Events (JSON)', type: 'json', defaultValue: [] },
    ],
  },

  // === ADVANCED LAYOUT ===
  {
    type: 'FlexGridLayout',
    label: 'Flex Grid Layout',
    category: 'Layout',
    icon: Layout,
    isContainer: true,
    defaultConfig: {
      config: {
        top: { visible: true, height: '100px' },
        left: { visible: true, width: '200px' },
        center: { visible: true },
        right: { visible: true, width: '200px' },
        bottom: { visible: true, height: '100px' },
      },
    },
    configSchema: [
      { key: 'config', label: 'Layout Config (JSON)', type: 'json', defaultValue: {} },
    ],
  },
];

export const getComponentByType = (type: string): ComponentDefinition | undefined => {
  return componentRegistry.find((c) => c.type === type);
};

export const getComponentsByCategory = (): Record<string, ComponentDefinition[]> => {
  return componentRegistry.reduce((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = [];
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, ComponentDefinition[]>);
};

export const isContainerComponent = (type: string): boolean => {
  const def = getComponentByType(type);
  return def?.isContainer ?? false;
};
