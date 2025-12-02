import React, { useState } from 'react';
import { SmartGridPlusWithNestedRows } from '@/components/SmartGrid/SmartGridPlusWithNestedRows';
import { GridColumnConfig } from '@/types/smartgrid';
import { toast } from 'sonner';

// Mock data for parent grid
const initialParentData = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customerName: 'Acme Corp',
    orderDate: '2024-01-15',
    totalAmount: 15000,
    status: 'In Progress',
    items: [
      { id: 1, productName: 'Widget A', quantity: 10, unitPrice: 500, total: 5000 },
      { id: 2, productName: 'Widget B', quantity: 20, unitPrice: 500, total: 10000 },
    ]
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customerName: 'TechStart Inc',
    orderDate: '2024-01-20',
    totalAmount: 8500,
    status: 'Completed',
    items: [
      { id: 3, productName: 'Gadget X', quantity: 5, unitPrice: 1000, total: 5000 },
      { id: 4, productName: 'Gadget Y', quantity: 7, unitPrice: 500, total: 3500 },
    ]
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    customerName: 'GlobalTech Ltd',
    orderDate: '2024-01-25',
    totalAmount: 22000,
    status: 'Pending',
    items: [
      { id: 5, productName: 'Device Pro', quantity: 4, unitPrice: 5000, total: 20000 },
      { id: 6, productName: 'Device Lite', quantity: 10, unitPrice: 200, total: 2000 },
    ]
  },
  {
    id: 4,
    orderNumber: 'ORD-004',
    customerName: 'Innovate Solutions',
    orderDate: '2024-02-01',
    totalAmount: 12500,
    status: 'In Progress',
    items: [
      { id: 7, productName: 'Tool Alpha', quantity: 25, unitPrice: 500, total: 12500 },
    ]
  },
];

// Parent grid columns
const parentColumns: GridColumnConfig[] = [
  {
    key: 'orderNumber',
    label: 'Order #',
    type: 'EditableText',
    sortable: true,
    filterable: true,
    width: 120,
    editable: true,
  },
  {
    key: 'customerName',
    label: 'Customer',
    type: 'EditableText',
    sortable: true,
    filterable: true,
    width: 200,
    editable: true,
  },
  {
    key: 'orderDate',
    label: 'Order Date',
    type: 'Date',
    sortable: true,
    filterable: true,
    width: 150,
    editable: true,
  },
  {
    key: 'totalAmount',
    label: 'Total Amount',
    type: 'Integer',
    sortable: true,
    filterable: true,
    width: 150,
    editable: true,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'Badge',
    sortable: true,
    filterable: true,
    width: 150,
    editable: true,
    options: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    statusMap: {
      'Pending': 'yellow',
      'In Progress': 'blue',
      'Completed': 'green',
      'Cancelled': 'red',
    },
  },
];

// Nested grid columns for order items
const nestedColumns: GridColumnConfig[] = [
  {
    key: 'productName',
    label: 'Product',
    type: 'EditableText',
    width: 200,
    editable: true,
  },
  {
    key: 'quantity',
    label: 'Quantity',
    type: 'Integer',
    width: 120,
    editable: true,
  },
  {
    key: 'unitPrice',
    label: 'Unit Price',
    type: 'Integer',
    width: 150,
    editable: true,
  },
  {
    key: 'total',
    label: 'Total',
    type: 'Integer',
    width: 150,
    editable: false,
  },
];

export default function SmartGridPlusWithNestedRowsDemo() {
  const [data, setData] = useState(initialParentData);

  // Handle parent row add
  const handleAddRow = async (newRow: any) => {
    console.log('Adding parent row:', newRow);
    const newId = Math.max(...data.map(d => d.id), 0) + 1;
    const rowWithId = { 
      ...newRow, 
      id: newId,
      items: [] // Initialize empty items array
    };
    setData([...data, rowWithId]);
    toast.success('Order added successfully');
  };

  // Handle parent row edit
  const handleEditRow = async (rowIndex: number, updatedRow: any) => {
    console.log('Editing parent row:', rowIndex, updatedRow);
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], ...updatedRow };
    setData(newData);
    toast.success('Order updated successfully');
  };

  // Handle parent row delete
  const handleDeleteRow = async (rowIndex: number) => {
    console.log('Deleting parent row:', rowIndex);
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
    toast.success('Order deleted successfully');
  };

  // Handle nested item edit
  const handleNestedEdit = (parentRowIndex: number, nestedRowIndex: number, updatedRow: any) => {
    console.log('Editing nested row:', parentRowIndex, nestedRowIndex, updatedRow);
    const newData = [...data];
    const parentRow = newData[parentRowIndex];
    if (parentRow.items && parentRow.items[nestedRowIndex]) {
      // Update the nested item
      parentRow.items[nestedRowIndex] = { 
        ...parentRow.items[nestedRowIndex], 
        ...updatedRow 
      };
      
      // Recalculate total if quantity or unitPrice changed
      if ('quantity' in updatedRow || 'unitPrice' in updatedRow) {
        const item = parentRow.items[nestedRowIndex];
        item.total = item.quantity * item.unitPrice;
      }
      
      // Recalculate parent total
      parentRow.totalAmount = parentRow.items.reduce((sum: number, item: any) => sum + item.total, 0);
      
      setData(newData);
      toast.success('Item updated successfully');
    }
  };

  // Default values for new parent rows
  const defaultRowValues = {
    orderNumber: '',
    customerName: '',
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    status: 'Pending',
    items: [],
  };

  // Validation rules
  const validationRules = {
    requiredFields: ['orderNumber', 'customerName', 'orderDate'],
    customValidationFn: (values: Record<string, any>) => {
      const errors: Record<string, string> = {};

      if (values.totalAmount && values.totalAmount < 0) {
        errors.totalAmount = 'Total amount must be greater than or equal to 0';
      }

      return errors;
    },
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            SmartGridPlus with Nested Rows Demo
          </h1>
          <p className="text-muted-foreground">
            A powerful grid combining inline editing, row addition/deletion, and nested grids for related data.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-2xl font-bold text-foreground">{data.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-2xl font-bold text-foreground">
              ${data.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {data.filter(o => o.status === 'Completed').length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">
              {data.filter(o => o.status === 'In Progress').length}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="bg-card border border-border rounded-lg p-6">
          <SmartGridPlusWithNestedRows
            columns={parentColumns}
            data={data}
            gridTitle="Orders with Line Items"
            inlineRowAddition={true}
            inlineRowEditing={true}
            onAddRow={handleAddRow}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            defaultRowValues={defaultRowValues}
            validationRules={validationRules}
            addRowButtonLabel="Add Order"
            paginationMode="pagination"
            nestedSectionConfig={{
              nestedDataKey: 'items',
              columns: nestedColumns,
              title: 'Order Items',
              showNestedRowCount: true,
              editableColumns: true,
              onInlineEdit: handleNestedEdit,
            }}
          />
        </div>

        {/* Instructions */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Click the "Add Order" button or use the empty row at the bottom to add new orders</li>
            <li>Double-click any cell to edit parent-level data (Order #, Customer, Date, Amount, Status)</li>
            <li>Click the chevron icon to expand/collapse nested order items</li>
            <li>All nested rows are expanded by default for immediate visibility</li>
            <li>Edit nested items inline - totals are automatically recalculated</li>
            <li>Use the action buttons to save or delete rows</li>
            <li>Supports sorting, filtering, and column management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
