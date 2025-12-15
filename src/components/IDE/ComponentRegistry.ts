import { Grid, Table, Calendar, FileText, Layout, LayoutGrid, Layers, FormInput, Badge } from 'lucide-react';

export interface ComponentDefinition {
  type: string;
  label: string;
  category: string;
  icon: any;
  defaultConfig: Record<string, any>;
  configSchema: ConfigField[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'json' | 'array';
  options?: { label: string; value: any }[];
  defaultValue?: any;
}

export const componentRegistry: ComponentDefinition[] = [
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
      { key: 'columns', label: 'Columns (JSON)', type: 'json', defaultValue: [] },
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
      { key: 'columns', label: 'Columns (JSON)', type: 'json', defaultValue: [] },
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
      { key: 'columns', label: 'Columns (JSON)', type: 'json', defaultValue: [] },
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
      { key: 'columns', label: 'Columns (JSON)', type: 'json', defaultValue: [] },
      { key: 'data', label: 'Data (JSON)', type: 'json', defaultValue: [] },
    ],
  },
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
      { key: 'panelConfig', label: 'Panel Config (JSON)', type: 'json', defaultValue: {} },
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
      { key: 'fields', label: 'Fields (JSON)', type: 'json', defaultValue: [] },
    ],
  },
  {
    type: 'FlexGridLayout',
    label: 'Flex Grid Layout',
    category: 'Layout',
    icon: Layout,
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
