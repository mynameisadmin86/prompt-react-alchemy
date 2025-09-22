import React, { useState } from 'react';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { DynamicPanel } from '@/components/DynamicPanel';
import { SmartGrid } from '@/components/SmartGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Package, CheckCircle, Edit } from 'lucide-react';
import { LayoutConfig } from '@/components/FlexGridLayout/types';
import { PanelConfig } from '@/types/dynamicPanel';
import { GridColumnConfig } from '@/types/smartgrid';

// Trip Details Panel Configuration
const tripDetailsPanelConfig: PanelConfig = {
  'trip-id': {
    id: 'trip-id',
    label: 'Trip ID',
    fieldType: 'text',
    value: 'TRIP00000001',
    mandatory: false,
    visible: true,
    editable: false,
    order: 1
  },
  'customer-id': {
    id: 'customer-id',
    label: 'Customer ID',
    fieldType: 'text',
    value: 'CUS0009173',
    mandatory: false,
    visible: true,
    editable: false,
    order: 2
  },
  'rail-info': {
    id: 'rail-info',
    label: 'Rail Info',
    fieldType: 'text',
    value: 'Railtrax NV - 46798333',
    mandatory: false,
    visible: true,
    editable: false,
    order: 3
  },
  'amount': {
    id: 'amount',
    label: 'Amount',
    fieldType: 'currency',
    value: '45595.00',
    mandatory: false,
    visible: true,
    editable: false,
    order: 4
  },
  'mode': {
    id: 'mode',
    label: 'Mode',
    fieldType: 'text',
    value: 'Rail',
    mandatory: false,
    visible: true,
    editable: false,
    order: 5
  },
  'from-location': {
    id: 'from-location',
    label: 'From',
    fieldType: 'text',
    value: '53-202705, Voila',
    mandatory: false,
    visible: true,
    editable: false,
    order: 6
  },
  'to-location': {
    id: 'to-location',
    label: 'To',
    fieldType: 'text',
    value: '53-21925-3, Curtici',
    mandatory: false,
    visible: true,
    editable: false,
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
    order: 9,
    placeholder: 'Enter train number'
  },
  'cluster': {
    id: 'cluster',
    label: 'Cluster',
    fieldType: 'select',
    value: '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 10,
    options: [
      { label: '10000406', value: '10000406' }
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
    order: 11,
    placeholder: 'Enter supplier reference'
  },
  'qc-userdefined': {
    id: 'qc-userdefined',
    label: 'QC Userdefined 1',
    fieldType: 'text',
    value: '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 12,
    placeholder: 'Enter QC user defined value'
  },
  'remarks': {
    id: 'remarks',
    label: 'Remarks 1',
    fieldType: 'textarea',
    value: '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 13,
    placeholder: 'Enter remarks'
  }
};

// Activities & Consignment Grid Configuration
const activitiesColumns: GridColumnConfig[] = [
  {
    key: 'sno',
    label: 'S. No.',
    type: 'Text',
    width: 80,
    sortable: false
  },
  {
    key: 'behaviour',
    label: 'Behaviour',
    type: 'Badge',
    width: 120,
    statusMap: {
      'pickup': 'bg-blue-100 text-blue-800',
      'delivery': 'bg-green-100 text-green-800',
      'transit': 'bg-yellow-100 text-yellow-800'
    }
  },
  {
    key: 'location',
    label: 'Location',
    type: 'Text',
    width: 150,
    filterable: true
  },
  {
    key: 'plannedActual',
    label: 'Planned/Actual',
    type: 'Text',
    width: 150
  },
  {
    key: 'consignment',
    label: 'Consignment',
    type: 'Text',
    width: 150,
    filterable: true
  },
  {
    key: 'status',
    label: 'Status',
    type: 'Badge',
    width: 120,
    statusMap: {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
  },
  {
    key: 'action',
    label: 'Action',
    type: 'Link',
    width: 100,
    onClick: (rowData) => console.log('Action clicked:', rowData)
  }
];

// Sample data for activities
const activitiesData = [
  {
    sno: 1,
    behaviour: 'pickup',
    location: 'Berlin (BER)',
    plannedActual: 'Planned: 12:00\nActual: 12:15',
    consignment: 'CON001',
    status: 'completed',
    action: 'Edit'
  },
  {
    sno: 2,
    behaviour: 'transit',
    location: 'Frankfurt (FRA)',
    plannedActual: 'Planned: 18:00\nActual: -',
    consignment: 'CON001',
    status: 'in-progress',
    action: 'Edit'
  },
  {
    sno: 3,
    behaviour: 'delivery',
    location: 'Curtici (CUR)',
    plannedActual: 'Planned: 06:00\nActual: -',
    consignment: 'CON001',
    status: 'pending',
    action: 'Edit'
  }
];

// Summary Cards Data
const summaryCardsData = [
  {
    title: 'Customer Orders',
    values: ['Total: 100', 'Weight/Volume: 100 TON / 100 CBM']
  },
  {
    title: 'Resources',
    values: ['No. of Resource: 4', 'Total Cost: USD 400']
  },
  {
    title: 'VAS',
    values: ['Total VAS: 5', 'Total Consumables: 5']
  },
  {
    title: 'Incidents',
    values: ['Total: 3', 'Closed: 3']
  },
  {
    title: 'Jobs',
    values: ['Total: 5', 'Completed: 3']
  },
  {
    title: 'Supplier Billing',
    values: ['Requested: USD 400', 'Approved: USD 100']
  }
];

// Trip Status Badge Component
const TripStatusBadge = () => (
  <div className="flex items-center gap-2 mb-4">
    <Badge variant="secondary" className="bg-green-100 text-green-800">
      Released
    </Badge>
    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
      Draft Bill Raised
    </Badge>
  </div>
);

// Summary Cards Grid Component
const SummaryCardsGrid = () => (
  <div className="grid grid-cols-3 gap-4 p-4">
    {summaryCardsData.map((card, index) => (
      <Card key={index} className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {card.values.map((value, valueIndex) => (
            <div key={valueIndex} className="text-sm text-muted-foreground mb-1">
              {value}
            </div>
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
);

// Footer Actions Component
const TripExecutionFooterActions = () => (
  <div className="flex items-center justify-between p-4 bg-background border-t">
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
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
      <Button size="sm" className="bg-green-600 hover:bg-green-700">
        Confirm Trip
      </Button>
    </div>
  </div>
);

const TripExecutionPage = () => {
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
          <div className="h-full overflow-auto">
            <TripStatusBadge />
            <DynamicPanel
              panelId="trip-details-panel"
              panelTitle="Trip Information"
              panelConfig={tripDetailsPanelConfig}
              initialData={{}}
              onDataChange={(data) => console.log('Trip details changed:', data)}
            />
          </div>
        )
      },
      center: {
        id: 'center',
        visible: true,
        width: 'calc(100% - 350px)',
        collapsible: false,
        title: 'Trip Management',
        content: (
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <SmartGrid
                columns={activitiesColumns}
                data={activitiesData}
                gridTitle="Activities & Consignment"
                recordCount={activitiesData.length}
                showCreateButton={true}
                searchPlaceholder="Search activities..."
              />
            </div>
            <div className="border-t">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Summary Cards</h3>
                <SummaryCardsGrid />
              </div>
            </div>
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
    localStorage.setItem('tripExecutionPage', JSON.stringify(newConfig));
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('tripExecutionPage');
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
    <div className="h-screen bg-muted/20">
      <FlexGridLayout
        config={layoutConfig}
        onConfigChange={handleConfigChange}
        className="h-full"
      />
    </div>
  );
};

export default TripExecutionPage;