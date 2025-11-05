import React from 'react';
import { SmartGrid, SubRowConfig, GridColumnConfig } from '@/components/SmartGrid';

// Sample data with nested array
const sampleData = [
  {
    orderNumber: 'ORD-001',
    customer: 'ABC Pvt Ltd',
    orderDate: '2024-01-15',
    totalAmount: 5000,
    status: 'Confirmed',
    orderLines: [
      { itemCode: 'ITEM001', description: 'Cement Bag', quantity: 50, uom: 'Bags', unitPrice: 500, total: 25000 },
      { itemCode: 'ITEM002', description: 'Steel Rod', quantity: 10, uom: 'Tons', unitPrice: 5000, total: 50000 },
      { itemCode: 'ITEM003', description: 'Bricks', quantity: 1000, uom: 'Pieces', unitPrice: 5, total: 5000 }
    ]
  },
  {
    orderNumber: 'ORD-002',
    customer: 'XYZ Corporation',
    orderDate: '2024-01-16',
    totalAmount: 8500,
    status: 'Pending',
    orderLines: [
      { itemCode: 'ITEM004', description: 'Paint Bucket', quantity: 20, uom: 'Buckets', unitPrice: 250, total: 5000 },
      { itemCode: 'ITEM005', description: 'Wooden Planks', quantity: 50, uom: 'Pieces', unitPrice: 150, total: 7500 }
    ]
  },
  {
    orderNumber: 'ORD-003',
    customer: 'Global Traders',
    orderDate: '2024-01-17',
    totalAmount: 12000,
    status: 'Delivered',
    orderLines: [
      { itemCode: 'ITEM006', description: 'Tiles', quantity: 200, uom: 'Boxes', unitPrice: 60, total: 12000 }
    ]
  },
  {
    orderNumber: 'ORD-004',
    customer: 'BuildMax Solutions',
    orderDate: '2024-01-18',
    totalAmount: 15000,
    status: 'Confirmed',
    orderLines: [
      { itemCode: 'ITEM007', description: 'Electrical Wire', quantity: 500, uom: 'Meters', unitPrice: 10, total: 5000 },
      { itemCode: 'ITEM008', description: 'PVC Pipes', quantity: 100, uom: 'Pieces', unitPrice: 80, total: 8000 },
      { itemCode: 'ITEM009', description: 'Switches', quantity: 50, uom: 'Pieces', unitPrice: 40, total: 2000 }
    ]
  },
  {
    orderNumber: 'ORD-005',
    customer: 'Prime Construction',
    orderDate: '2024-01-19',
    totalAmount: 9500,
    status: 'Cancelled',
    orderLines: [
      { itemCode: 'ITEM010', description: 'Sand', quantity: 10, uom: 'Tons', unitPrice: 500, total: 5000 },
      { itemCode: 'ITEM011', description: 'Gravel', quantity: 8, uom: 'Tons', unitPrice: 562.5, total: 4500 }
    ]
  }
];

export default function SmartGridArraySubRowDemo() {
  // Main grid columns
  const mainColumns: GridColumnConfig[] = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 150
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 200
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      type: 'Date',
      sortable: true,
      filterable: true,
      width: 150
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 150
    },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      sortable: true,
      filterable: true,
      width: 120,
      statusMap: {
        'Confirmed': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Delivered': 'bg-blue-100 text-blue-800',
        'Cancelled': 'bg-red-100 text-red-800'
      }
    }
  ];

  // Sub-row configuration for order lines
  const subRowConfig: SubRowConfig = {
    key: 'orderLines',
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
        label: 'Qty',
        type: 'Text',
        width: 80
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
        type: 'Text',
        width: 120
      },
      {
        key: 'total',
        label: 'Total',
        type: 'Text',
        width: 120
      }
    ]
  };

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">SmartGrid Array Sub-Row Demo</h1>
        <p className="text-gray-600">
          This demo showcases expandable sub-rows that display nested array data from parent rows.
          Click the expand icon (▶) in any row to view order line items.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <SmartGrid
          columns={mainColumns}
          data={sampleData}
          subRowConfig={subRowConfig}
          gridTitle="Customer Orders"
          recordCount={sampleData.length}
          searchPlaceholder="Search orders..."
          clientSideSearch={true}
          paginationMode="pagination"
          customPageSize={10}
        />
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
          <li>Click expand icon (▶) to view order line items</li>
          <li>Multiple rows can be expanded simultaneously</li>
          <li>Smooth expand/collapse animations</li>
          <li>"Collapse All" button appears in toolbar when rows are expanded</li>
          <li>Sub-row table displays all order line details</li>
          <li>Indented styling with left border for visual hierarchy</li>
        </ul>
      </div>
    </div>
  );
}
