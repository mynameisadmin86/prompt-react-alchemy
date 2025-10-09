import React, { useState, useCallback, useMemo } from 'react';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { DynamicPanel } from '@/components/DynamicPanel';
import { SmartGrid } from '@/components/SmartGrid';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, Euro, MapPin } from 'lucide-react';
import { LayoutConfig } from '@/components/FlexGridLayout/types';
import { PanelConfig } from '@/types/dynamicPanel';
import { GridColumnConfig } from '@/types/smartgrid';
import { useTripExecutionStore } from '@/stores/tripExecutionStore';
import { TripStatusBadge } from '@/components/TripExecution/TripStatusBadge';
import { SummaryCardsGrid } from '@/components/TripExecution/SummaryCardsGrid';

// Smart Grid configuration for Activities & Consignment
const activitiesColumns: GridColumnConfig[] = [
  {
    key: 'leg',
    label: 'Leg',
    type: 'Text',
    width: 100,
    sortable: true,
    filterable: true,
    editable: false
  },
  {
    key: 'behaviour',
    label: 'Behaviour',
    type: 'Badge',
    width: 130,
    sortable: true,
    filterable: true,
    editable: false,
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
    width: 120,
    sortable: true,
    filterable: true,
    editable: false
  },
  {
    key: 'plannedActual',
    label: 'Planned/Actual',
    type: 'Text',
    width: 140,
    sortable: true,
    filterable: true,
    editable: false
  },
  {
    key: 'consignment',
    label: 'Consignment',
    type: 'Text',
    width: 150,
    sortable: false,
    filterable: false,
    editable: false
  },
  {
    key: 'status',
    label: 'Status',
    type: 'Badge',
    width: 110,
    sortable: true,
    filterable: true,
    editable: false,
    statusMap: {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-gray-100 text-gray-800'
    }
  },
  {
    key: 'action',
    label: 'Action',
    type: 'Text',
    width: 100,
    sortable: false,
    filterable: false,
    editable: false
  },
  {
    key: 'actualDateTime',
    label: 'Actual date and time',
    type: 'Date',
    width: 180,
    sortable: true,
    filterable: true,
    editable: true,
    subRow: true
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
    action: '',
    actualDateTime: '2024-01-15T10:30:00'
  },
  {
    leg: 'Leg: 2',
    behaviour: 'Drvy',
    location: 'CHN-DEL',
    plannedActual: '20/20',
    consignment: '',
    status: 'completed',
    action: '',
    actualDateTime: '2024-01-16T14:15:00'
  },
  {
    leg: 'Leg: 3',
    behaviour: 'CHA-Import',
    location: 'DEL-CHN',
    plannedActual: '20/20',
    consignment: '',
    status: 'completed',
    action: '',
    actualDateTime: '2024-01-17T08:45:00'
  },
  {
    leg: 'Leg: 4',
    behaviour: 'PUD',
    location: 'CHN-HYD',
    plannedActual: '20/20',
    consignment: '',
    status: 'completed',
    action: '',
    actualDateTime: '2024-01-18T16:20:00'
  },
  {
    leg: 'Leg: 5',
    behaviour: 'GTIN',
    location: 'BLR-HYD',
    plannedActual: '---',
    consignment: '',
    status: 'pending',
    action: '',
    actualDateTime: ''
  },
  {
    leg: 'Leg: 6',
    behaviour: 'GTOUT',
    location: 'CHN-MUM',
    plannedActual: '---',
    consignment: '',
    status: 'pending',
    action: '',
    actualDateTime: ''
  },
  {
    leg: 'Leg: 7',
    behaviour: 'LHTA',
    location: 'MUM-DEL',
    plannedActual: '---',
    consignment: '',
    status: 'pending',
    action: '',
    actualDateTime: ''
  }
];

// Non-editable trip information component
const TripInfoSection = () => (
  <div className="space-y-4 mb-6">
    <TripStatusBadge status="Released" />
    
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="text-xs text-muted-foreground">Customer ID</div>
          <div className="text-sm font-medium">CUS0009173</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 text-muted-foreground flex items-center justify-center">🚂</div>
        <div>
          <div className="text-xs text-muted-foreground">Rail Company</div>
          <div className="text-sm font-medium">Railtrax NV - 46798333</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Euro className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="text-xs text-muted-foreground">Price</div>
          <div className="text-sm font-medium">€ 45595.00</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 text-muted-foreground flex items-center justify-center">🚆</div>
        <div>
          <div className="text-xs text-muted-foreground">Transport Mode</div>
          <div className="text-sm font-medium">Rail</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="text-xs text-muted-foreground">From</div>
          <div className="text-sm font-medium">53-202705, Voila</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-destructive" />
        <div>
          <div className="text-xs text-muted-foreground">To</div>
          <div className="text-sm font-medium">53-21925-3, Curtici</div>
        </div>
      </div>
    </div>
  </div>
);

const TripExecutionFooterActions = ({ onSaveDraft, onConfirmTrip }: { onSaveDraft: () => void; onConfirmTrip: () => void }) => (
  <div className="flex items-center justify-between p-4 bg-background border-t">
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
        Cancel
      </Button>
    </div>
    
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Button variant="outline" size="sm" className="pr-8" onClick={onSaveDraft}>
          Save Draft
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={onConfirmTrip}>
        Confirm Trip
      </Button>
    </div>
  </div>
);

const TripExecutionZustand = () => {
  const { tripData, setSectionData, getSectionData } = useTripExecutionStore();
  
  // Trip execution panel configuration
  const tripExecutionPanelConfig: PanelConfig = useMemo(() => ({
    'trip-type': {
      id: 'trip-type',
      label: 'Trip Type',
      fieldType: 'radio',
      value: 'One Way',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
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
      order: 2,
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
      order: 3,
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
      order: 4,
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
      order: 5,
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
      order: 6,
      placeholder: 'Enter Remarks'
    }
  }), []);

  // Callback for handling data changes
  const handleOperationalDataChange = useCallback((data: Record<string, any>) => {
    Object.entries(data).forEach(([field, value]) => {
      setSectionData('operationalDetails', field, value);
    });
  }, [setSectionData]);

  // Action handlers
  const handleSaveDraft = useCallback(() => {
    console.log('Saving draft:', tripData);
    // Add your save logic here
  }, [tripData]);

  const handleConfirmTrip = useCallback(() => {
    console.log('Confirming trip:', tripData);
    // Add your confirmation logic here
  }, [tripData]);

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
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">TRIP00000001</h2>
            <TripInfoSection />
            <DynamicPanel
              panelId="trip-execution-panel"
              panelTitle="Trip Details"
              panelConfig={tripExecutionPanelConfig}
              initialData={{
                'trip-type': 'One Way',
                'cluster': '10000406',
                'oc-userdefined-1': 'GC'
              }}
              onDataChange={handleOperationalDataChange}
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
            <div className="flex-1 p-4">
              <SmartGrid
                columns={activitiesColumns}
                data={activitiesGridData}
                gridTitle="Activities & Consignment"
                recordCount={7}
                searchPlaceholder="Search activities..."
                showCreateButton={false}
                editableColumns={false}
                paginationMode="pagination"
              />
            </div>
            <div className="p-4">
              <SummaryCardsGrid />
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
        content: <TripExecutionFooterActions onSaveDraft={handleSaveDraft} onConfirmTrip={handleConfirmTrip} />
      }
    }
  });

  const handleConfigChange = useCallback((newConfig: LayoutConfig) => {
    // Auto-adjust center width when left panel collapses/expands
    if (newConfig.sections.left.collapsed) {
      newConfig.sections.center.width = '100%';
    } else {
      newConfig.sections.center.width = 'calc(100% - 400px)';
    }
    
    setLayoutConfig(newConfig);
  }, []);

  return (
    <div className="h-screen bg-background">
      <FlexGridLayout
        config={layoutConfig}
        onConfigChange={handleConfigChange}
        className="h-full"
      />
    </div>
  );
};

export default TripExecutionZustand;
