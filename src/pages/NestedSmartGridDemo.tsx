import React from 'react';
import { NestedSmartGrid } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';

const NestedSmartGridDemo = () => {
  // Sample trip data with nested trip legs
  const tripData = {
    tripId: 'TRIP-001',
    vehicleNo: 'MH-01-AB-1234',
    driver: 'John Doe',
    status: 'In Transit',
    tripLegs: [
      {
        legNo: 1,
        from: 'Mumbai',
        to: 'Pune',
        distance: 150,
        eta: '2025-11-05 14:00',
        status: 'Completed'
      },
      {
        legNo: 2,
        from: 'Pune',
        to: 'Bangalore',
        distance: 850,
        eta: '2025-11-06 08:00',
        status: 'In Progress'
      },
      {
        legNo: 3,
        from: 'Bangalore',
        to: 'Chennai',
        distance: 350,
        eta: '2025-11-06 18:00',
        status: 'Pending'
      }
    ],
    orderLines: [
      {
        itemCode: 'ITEM001',
        description: 'Cement Bags 50kg',
        quantity: 100,
        uom: 'Bags',
        weight: 5000
      },
      {
        itemCode: 'ITEM002',
        description: 'Steel Rods 12mm',
        quantity: 50,
        uom: 'Bundles',
        weight: 2500
      },
      {
        itemCode: 'ITEM003',
        description: 'Sand (River)',
        quantity: 10,
        uom: 'Tons',
        weight: 10000
      }
    ]
  };

  const tripLegColumns: GridColumnConfig[] = [
    { key: 'legNo', label: 'Leg No', type: 'Text', width: 80 },
    { key: 'from', label: 'From', type: 'Text', width: 160 },
    { key: 'to', label: 'To', type: 'Text', width: 160 },
    { key: 'distance', label: 'Distance (KM)', type: 'Text', width: 120 },
    { key: 'eta', label: 'ETA', type: 'Text', width: 160 },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      width: 120,
      statusMap: {
        'Completed': 'bg-green-100 text-green-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Pending': 'bg-gray-100 text-gray-800'
      }
    }
  ];

  const orderLineColumns: GridColumnConfig[] = [
    { key: 'itemCode', label: 'Item Code', type: 'Text', width: 120 },
    { key: 'description', label: 'Description', type: 'Text', width: 250 },
    { key: 'quantity', label: 'Quantity', type: 'Text', width: 100 },
    { key: 'uom', label: 'UOM', type: 'Text', width: 100 },
    { key: 'weight', label: 'Weight (kg)', type: 'Text', width: 120 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Nested SmartGrid Demo</h1>
        <p className="text-muted-foreground">
          Demonstration of NestedSmartGrid component for displaying array-based nested data with expandable sections.
        </p>
      </div>

      {/* Trip Details Card */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Trip ID</p>
            <p className="font-medium">{tripData.tripId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vehicle No</p>
            <p className="font-medium">{tripData.vehicleNo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Driver</p>
            <p className="font-medium">{tripData.driver}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{tripData.status}</p>
          </div>
        </div>

        {/* Nested Trip Legs Grid */}
        <div className="space-y-4">
          <NestedSmartGrid
            rowData={tripData}
            nestedDataKey="tripLegs"
            nestedTitle="Trip Legs"
            nestedColumns={tripLegColumns}
            collapsible={true}
            initiallyExpanded={true}
          />

          {/* Nested Order Lines Grid */}
          <NestedSmartGrid
            rowData={tripData}
            nestedDataKey="orderLines"
            nestedTitle="Order Lines"
            nestedColumns={orderLineColumns}
            collapsible={true}
            initiallyExpanded={false}
          />
        </div>
      </div>

      {/* Independent Usage Example */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Independent Usage</h2>
        <p className="text-sm text-muted-foreground mb-4">
          NestedSmartGrid can also be used independently without collapsible behavior:
        </p>
        
        <NestedSmartGrid
          rowData={tripData}
          nestedDataKey="tripLegs"
          nestedTitle="All Trip Legs (Non-collapsible)"
          nestedColumns={tripLegColumns}
          collapsible={false}
        />
      </div>

      {/* Empty State Example */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Empty State Example</h2>
        <p className="text-sm text-muted-foreground mb-4">
          When nested data is empty:
        </p>
        
        <NestedSmartGrid
          rowData={{ emptyArray: [] }}
          nestedDataKey="emptyArray"
          nestedTitle="Empty Nested Data"
          nestedColumns={tripLegColumns}
          collapsible={true}
          initiallyExpanded={true}
        />
      </div>
    </div>
  );
};

export default NestedSmartGridDemo;
