
import React, { useState } from 'react';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { DynamicPanel } from '@/components/DynamicPanel';
import { SmartGrid } from '@/components/SmartGrid';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { LayoutConfig } from '@/components/FlexGridLayout/types';
import { PanelConfig } from '@/types/dynamicPanel';
import { GridColumnConfig } from '@/types/smartgrid';

// Trip Execution form configuration matching image-2
const tripExecutionPanelConfig: PanelConfig = {
  'trip-id': {
    id: 'trip-id',
    label: 'Trip ID',
    fieldType: 'text',
    value: 'TRIP00000001',
    mandatory: true,
    visible: true,
    editable: false,
    order: 1
  },
  'customer-id': {
    id: 'customer-id',
    label: 'Customer ID',
    fieldType: 'text',
    value: 'CUS0009173',
    mandatory: true,
    visible: true,
    editable: false,
    order: 2
  },
  'price': {
    id: 'price',
    label: 'Price',
    fieldType: 'currency',
    value: '45595.00',
    mandatory: true,
    visible: true,
    editable: true,
    order: 3
  },
  'rail-info': {
    id: 'rail-info',
    label: 'Rail Information',
    fieldType: 'text',
    value: 'Railtrax NV - 46798333',
    mandatory: true,
    visible: true,
    editable: false,
    order: 4
  },
  'origin': {
    id: 'origin',
    label: 'Origin',
    fieldType: 'text',
    value: '53-202705, Voila',
    mandatory: true,
    visible: true,
    editable: true,
    order: 5
  },
  'destination': {
    id: 'destination',
    label: 'Destination',
    fieldType: 'text',
    value: '53-21925-3, Curtici',
    mandatory: true,
    visible: true,
    editable: true,
    order: 6
  },
  'trip-type': {
    id: 'trip-type',
    label: 'Trip Type',
    fieldType: 'radio',
    value: 'one-way',
    mandatory: true,
    visible: true,
    editable: true,
    order: 7,
    options: [
      { label: 'One Way', value: 'one-way' },
      { label: 'Round Trip', value: 'round-trip' }
    ]
  },
  'train-no': {
    id: 'train-no',
    label: 'Train No.',
    fieldType: 'text',
    value: '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 8,
    placeholder: 'Enter Train No.'
  },
  'cluster': {
    id: 'cluster',
    label: 'Cluster',
    fieldType: 'select',
    value: '10000406',
    mandatory: false,
    visible: true,
    editable: true,
    order: 9,
    options: [
      { label: '10000406', value: '10000406' },
      { label: '10000407', value: '10000407' },
      { label: '10000408', value: '10000408' }
    ]
  },
  'supplier-ref': {
    id: 'supplier-ref',
    label: 'Supplier Ref. No.',
    fieldType: 'text',
    value: '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 10,
    placeholder: 'Enter Supplier Ref. No.'
  },
  'qc-user': {
    id: 'qc-user',
    label: 'QC Userdefined 1',
    fieldType: 'select',
    value: 'QC',
    mandatory: false,
    visible: true,
    editable: true,
    order: 11,
    options: [
      { label: 'QC', value: 'QC' },
      { label: 'QA', value: 'QA' },
      { label: 'Other', value: 'Other' }
    ]
  },
  'remarks': {
    id: 'remarks',
    label: 'Remarks 1',
    fieldType: 'textarea',
    value: '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 12,
    placeholder: 'Enter Remarks'
  }
};

// Activities & Consignment grid configuration matching image-3
const activitiesGridColumns: GridColumnConfig[] = [
  {
    key: 'leg',
    label: 'Leg',
    type: 'Text',
    sortable: true,
    filterable: true
  },
  {
    key: 'behaviour',
    label: 'Behaviour',
    type: 'Badge',
    statusMap: {
      'Pick': 'bg-blue-100 text-blue-800',
      'Drvy': 'bg-green-100 text-green-800',
      'CHA-Import': 'bg-cyan-100 text-cyan-800',
      'PUD': 'bg-emerald-100 text-emerald-800',
      'GTIN': 'bg-pink-100 text-pink-800',
      'GTOUT': 'bg-orange-100 text-orange-800',
      'LHTA': 'bg-purple-100 text-purple-800'
    }
  },
  {
    key: 'location',
    label: 'Location',
    type: 'Text',
    filterable: true
  },
  {
    key: 'plannedActual',
    label: 'Planned/Actual',
    type: 'Text',
    sortable: true
  },
  {
    key: 'consignment',
    label: 'Consignment',
    type: 'Text'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'Badge',
    statusMap: {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-gray-100 text-gray-800'
    }
  },
  {
    key: 'action',
    label: 'Action',
    type: 'Text'
  }
];

const activitiesGridData = [
  {
    leg: 'Leg: 1',
    behaviour: 'Pick',
    location: 'CHN-MUM',
    plannedActual: '20/20',
    consignment: '',
    status: 'completed',
    action: ''
  },
  {
    leg: 'Leg: 2',
    behaviour: 'Drvy',
    location: 'CHN-DEL',
    plannedActual: '20/20',
    consignment: '',
    status: 'completed',
    action: ''
  },
  {
    leg: 'Leg: 3',
    behaviour: 'CHA-Import',
    location: 'DEL-CHN',
    plannedActual: '20/20',
    consignment: '',
    status: 'completed',
    action: ''
  },
  {
    leg: 'Leg: 4',
    behaviour: 'PUD',
    location: 'CHN-HYD',
    plannedActual: '20/20',
    consignment: '',
    status: 'completed',
    action: ''
  },
  {
    leg: 'Leg: 5',
    behaviour: 'GTIN',
    location: 'BLR-HYD',
    plannedActual: '---',
    consignment: '',
    status: 'pending',
    action: ''
  },
  {
    leg: 'Leg: 6',
    behaviour: 'GTOUT',
    location: 'CHN-MUM',
    plannedActual: '---',
    consignment: '',
    status: 'pending',
    action: ''
  },
  {
    leg: 'Leg: 7',
    behaviour: 'LHTA',
    location: 'MUM-DEL',
    plannedActual: '---',
    consignment: '',
    status: 'pending',
    action: ''
  }
];

// Customer Orders and Resources sections
const CustomerOrdersSection = () => (
  <div className="grid grid-cols-2 gap-8 p-4">
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-sm font-medium">📦</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Customer Orders</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Customer Order</span>
          <span className="font-medium">100</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Weight / Volume</span>
          <span className="font-medium">100 TON / 100 CBM</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
          <span className="text-pink-600 text-sm font-medium">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">No. of Resource</span>
          <span className="font-medium">4</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Cost</span>
          <span className="font-medium">USD 400</span>
        </div>
      </div>
    </div>
  </div>
);

// Footer Actions Component matching image-4
const TripExecutionFooterActions = () => (
  <div className="flex items-center justify-between p-4 bg-white border-t">
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
        Cancel
      </Button>
    </div>
    
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Button variant="outline" size="sm" className="pr-8">
          Save Draft
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
        Confirm Trip
      </Button>
    </div>
  </div>
);

const TripExecution = () => {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    sections: {
      top: {
        id: 'top',
        visible: false,
        height: '0px',
        collapsible: false,
        collapsed: true
      },
      left: {
        id: 'left',
        visible: true,
        width: '350px',
        collapsible: true,
        collapsed: false,
        minWidth: '0',
        title: 'Trip Details',
        content: (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Released</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Draft Bill Raised</span>
            </div>
            <DynamicPanel
              panelId="trip-execution-panel"
              panelTitle="Trip Execution Details"
              panelConfig={tripExecutionPanelConfig}
              initialData={{}}
              onDataChange={(data) => console.log('Trip execution data changed:', data)}
            />
          </div>
        )
      },
      center: {
        id: 'center',
        visible: true,
        width: 'calc(100% - 350px)',
        collapsible: false,
        title: 'Activities & Consignment',
        content: (
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <SmartGrid
                columns={activitiesGridColumns}
                data={activitiesGridData}
                gridTitle="Activities & Consignment"
                recordCount={activitiesGridData.length}
                showCreateButton={false}
                searchPlaceholder="Search activities..."
              />
            </div>
            <CustomerOrdersSection />
          </div>
        )
      },
      right: {
        id: 'right',
        visible: false,
        width: '0px',
        collapsible: true,
        collapsed: true,
        minWidth: '0'
      },
      bottom: {
        id: 'bottom',
        visible: true,
        height: 'auto',
        collapsible: false,
        title: 'Actions',
        content: <TripExecutionFooterActions />
      }
    }
  });

  const handleConfigChange = (newConfig: LayoutConfig) => {
    // Auto-adjust center width when left panel collapses/expands
    if (newConfig.sections.left.collapsed) {
      newConfig.sections.center.width = '100%';
    } else {
      newConfig.sections.center.width = 'calc(100% - 350px)';
    }
    
    setLayoutConfig(newConfig);
    // Save to localStorage
    localStorage.setItem('tripExecutionLayout', JSON.stringify(newConfig));
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('tripExecutionLayout');
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved);
        setLayoutConfig(parsedConfig);
      } catch (error) {
        console.warn('Error loading layout config from localStorage:', error);
      }
    }
  }, []);

  return (
    <div className="h-screen bg-gray-50">
      <FlexGridLayout
        config={layoutConfig}
        onConfigChange={handleConfigChange}
        className="h-full"
      />
    </div>
  );
};

export default TripExecution;
