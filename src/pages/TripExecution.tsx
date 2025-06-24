
import React, { useState } from 'react';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { DynamicPanel } from '@/components/DynamicPanel';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { LayoutConfig } from '@/components/FlexGridLayout/types';
import { PanelConfig } from '@/types/dynamicPanel';

// Trip Execution form configuration matching the uploaded image
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
  'rail-company': {
    id: 'rail-company',
    label: 'Rail Company',
    fieldType: 'text',
    value: 'Railtrax NV - 46798333',
    mandatory: true,
    visible: true,
    editable: false,
    order: 4
  },
  'transport-mode': {
    id: 'transport-mode',
    label: 'Transport Mode',
    fieldType: 'text',
    value: 'Rail',
    mandatory: true,
    visible: true,
    editable: false,
    order: 5
  },
  'from-location': {
    id: 'from-location',
    label: 'From',
    fieldType: 'text',
    value: '53-202705, Voila',
    mandatory: true,
    visible: true,
    editable: true,
    order: 6
  },
  'to-location': {
    id: 'to-location',
    label: 'To',
    fieldType: 'text',
    value: '53-21925-3, Curtici',
    mandatory: true,
    visible: true,
    editable: true,
    order: 7
  },
  'trip-type': {
    id: 'trip-type',
    label: 'Trip Type',
    fieldType: 'radio',
    value: 'One Way',
    mandatory: true,
    visible: true,
    editable: true,
    order: 8,
    options: [
      { label: 'One Way', value: 'One Way' },
      { label: 'Round Trip', value: 'Round Trip' }
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
    order: 9,
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
    order: 10,
    options: [
      { label: '10000406', value: '10000406' },
      { label: '10000407', value: '10000407' },
      { label: '10000408', value: '10000408' }
    ]
  },
  'supplier-ref-no': {
    id: 'supplier-ref-no',
    label: 'Supplier Ref. No.',
    fieldType: 'text',
    value: '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 11,
    placeholder: 'Enter Supplier Ref. No.'
  },
  'oc-userdefined-1': {
    id: 'oc-userdefined-1',
    label: 'OC Userdefined 1',
    fieldType: 'select',
    value: 'GC',
    mandatory: false,
    visible: true,
    editable: true,
    order: 12,
    options: [
      { label: 'GC', value: 'GC' },
      { label: 'FC', value: 'FC' },
      { label: 'LC', value: 'LC' }
    ]
  },
  'remarks-1': {
    id: 'remarks-1',
    label: 'Remarks 1',
    fieldType: 'textarea',
    value: '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 13,
    placeholder: 'Enter Remarks'
  }
};

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

// Footer Actions Component
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
        width: '400px',
        collapsible: true,
        collapsed: false,
        minWidth: '40px',
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
              initialData={{
                'trip-id': 'TRIP00000001',
                'customer-id': 'CUS0009173',
                'price': '45595.00',
                'rail-company': 'Railtrax NV - 46798333',
                'transport-mode': 'Rail',
                'from-location': '53-202705, Voila',
                'to-location': '53-21925-3, Curtici',
                'trip-type': 'One Way',
                'cluster': '10000406',
                'oc-userdefined-1': 'GC'
              }}
              onDataChange={(data) => console.log('Trip execution data changed:', data)}
            />
          </div>
        )
      },
      center: {
        id: 'center',
        visible: true,
        width: 'calc(100% - 400px)',
        collapsible: false,
        content: (
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Activities & Consignment</h2>
              </div>
              <div className="p-4">
                <div className="bg-white rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leg</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Behaviour</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planned/Actual</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {activitiesGridData.map((row, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm">{row.leg}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                                row.behaviour === 'Pick' ? 'bg-blue-100 text-blue-800' :
                                row.behaviour === 'Drvy' ? 'bg-green-100 text-green-800' :
                                row.behaviour === 'CHA-Import' ? 'bg-cyan-100 text-cyan-800' :
                                row.behaviour === 'PUD' ? 'bg-emerald-100 text-emerald-800' :
                                row.behaviour === 'GTIN' ? 'bg-pink-100 text-pink-800' :
                                row.behaviour === 'GTOUT' ? 'bg-orange-100 text-orange-800' :
                                row.behaviour === 'LHTA' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {row.behaviour}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{row.location}</td>
                            <td className="px-4 py-3 text-sm">{row.plannedActual}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                                row.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {row.status === 'completed' ? 'Completed' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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
        content: <TripExecutionFooterActions />
      }
    }
  });

  const handleConfigChange = (newConfig: LayoutConfig) => {
    // Auto-adjust center width when left panel collapses/expands
    if (newConfig.sections.left.collapsed) {
      newConfig.sections.center.width = '100%';
    } else {
      newConfig.sections.center.width = 'calc(100% - 400px)';
    }
    
    setLayoutConfig(newConfig);
  };

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
