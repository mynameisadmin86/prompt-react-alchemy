import React from 'react';
import { SmartGrid, GridColumnConfig, SubRowConfig } from '@/components/SmartGrid';

// Sample data with nested order lines
const sampleData = [
  {
    id: 'ORD-001',
    orderNumber: 'ORD-001',
    customer: 'ABC Pvt Ltd',
    orderDate: '2024-01-15',
    totalAmount: 15750,
    status: 'Completed',
    orderLines: [
      { 
        itemCode: 'ITEM001', 
        description: 'Cement Bag 50kg', 
        quantity: 50, 
        uom: 'Bags',
        unitPrice: 250,
        amount: 12500
      },
      { 
        itemCode: 'ITEM002', 
        description: 'Steel Rod 12mm', 
        quantity: 10, 
        uom: 'Tons',
        unitPrice: 325,
        amount: 3250
      }
    ]
  },
  {
    id: 'ORD-002',
    orderNumber: 'ORD-002',
    customer: 'XYZ Construction',
    orderDate: '2024-01-16',
    totalAmount: 28900,
    status: 'In Progress',
    orderLines: [
      { 
        itemCode: 'ITEM003', 
        description: 'Concrete Mix', 
        quantity: 100, 
        uom: 'Bags',
        unitPrice: 180,
        amount: 18000
      },
      { 
        itemCode: 'ITEM004', 
        description: 'Bricks Red', 
        quantity: 5000, 
        uom: 'Pieces',
        unitPrice: 2,
        amount: 10000
      },
      { 
        itemCode: 'ITEM005', 
        description: 'Sand', 
        quantity: 3, 
        uom: 'Cubic Meter',
        unitPrice: 300,
        amount: 900
      }
    ]
  },
  {
    id: 'ORD-003',
    orderNumber: 'ORD-003',
    customer: 'BuildRight Ltd',
    orderDate: '2024-01-17',
    totalAmount: 45000,
    status: 'Pending',
    orderLines: [
      { 
        itemCode: 'ITEM006', 
        description: 'Plywood 18mm', 
        quantity: 25, 
        uom: 'Sheets',
        unitPrice: 800,
        amount: 20000
      },
      { 
        itemCode: 'ITEM007', 
        description: 'Paint White', 
        quantity: 50, 
        uom: 'Liters',
        unitPrice: 500,
        amount: 25000
      }
    ]
  },
  {
    id: 'ORD-004',
    orderNumber: 'ORD-004',
    customer: 'Prime Developers',
    orderDate: '2024-01-18',
    totalAmount: 0,
    status: 'Draft',
    orderLines: [] // Empty array to test no sub-rows case
  }
];

const SmartGridSubRowDemo = () => {
  // Main grid columns configuration
  const columns: GridColumnConfig[] = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      type: 'Text',
      width: 150,
      sortable: true,
      filterable: true
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'Text',
      width: 200,
      sortable: true,
      filterable: true
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      type: 'Date',
      width: 120,
      sortable: true,
      filterable: true
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      type: 'CurrencyWithSymbol',
      width: 150,
      sortable: true,
      filterable: true
    },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      width: 120,
      sortable: true,
      filterable: true,
      statusMap: {
        'Completed': 'bg-green-100 text-green-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Draft': 'bg-gray-100 text-gray-800'
      }
    }
  ];

  // Sub-row configuration for order lines
  const subRowConfig: SubRowConfig = {
    key: 'orderLines', // The property in parent row that contains the array
    expandable: true,
    columns: [
      {
        key: 'itemCode',
        label: 'Item Code',
        type: 'Text',
        width: 120
      },
      {
        key: 'description',
        label: 'Description',
        type: 'Text',
        width: 250
      },
      {
        key: 'quantity',
        label: 'Quantity',
        type: 'Text',
        width: 100
      },
      {
        key: 'uom',
        label: 'UOM',
        type: 'Text',
        width: 100
      },
      {
        key: 'unitPrice',
        label: 'Unit Price',
        type: 'CurrencyWithSymbol',
        width: 120
      },
      {
        key: 'amount',
        label: 'Amount',
        type: 'CurrencyWithSymbol',
        width: 120
      }
    ]
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          SmartGrid Sub-Row Expansion Demo
        </h1>
        <p className="text-gray-600">
          This demo showcases the expandable sub-rows feature that displays nested array data from parent rows.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Features:</h2>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Click the expand icon (▶) in the first column to show order line items</li>
            <li>Each order can have multiple line items displayed in a nested table</li>
            <li>The "Collapse All" button appears when rows are expanded</li>
            <li>Sub-rows have proper styling with indentation and borders</li>
            <li>Smooth animations for expand/collapse transitions</li>
            <li>Rows without array data (like ORD-004) won't show expand icon</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <SmartGrid
          columns={columns}
          data={sampleData}
          subRowConfig={subRowConfig}
          gridTitle="Order Management"
          recordCount={sampleData.length}
          searchPlaceholder="Search orders..."
          paginationMode="pagination"
          customPageSize={10}
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Implementation:</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`// Define sub-row configuration
const subRowConfig: SubRowConfig = {
  key: 'orderLines', // Array property in parent row
  expandable: true,
  columns: [
    { key: 'itemCode', label: 'Item Code', type: 'Text', width: 120 },
    { key: 'description', label: 'Description', type: 'Text', width: 250 },
    // ... more columns
  ]
};

// Use in SmartGrid
<SmartGrid
  columns={columns}
  data={data}
  subRowConfig={subRowConfig}
  // ... other props
/>`}
        </pre>
      </div>
    </div>
  );
};

export default SmartGridSubRowDemo;

