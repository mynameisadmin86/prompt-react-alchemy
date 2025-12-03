import React, { useState } from 'react';
import { SmartGridPlusWithNestedRows } from '@/components/SmartGrid/SmartGridPlusWithNestedRows';
import { GridColumnConfig } from '@/types/smartgrid';
import { Card } from '@/components/ui/card';

// Mock data for orders with nested order items
const initialOrdersData = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    customer: 'Acme Corp',
    orderDate: '2024-01-15',
    status: 'Delivered',
    totalAmount: 15420.50,
    shippingAddress: '123 Main St, New York, NY 10001',
    contactPerson: 'John Smith',
    contactPhone: '+1-555-0101',
    deliveryNotes: 'Deliver to loading dock B, call before arrival',
    orderItems: [
      { id: 101, itemName: 'Widget A', quantity: 50, unitPrice: 125.50, total: 6275.00, status: 'Shipped' },
      { id: 102, itemName: 'Widget B', quantity: 30, unitPrice: 89.99, total: 2699.70, status: 'Shipped' },
      { id: 103, itemName: 'Widget C', quantity: 100, unitPrice: 64.458, total: 6445.80, status: 'Delivered' }
    ]
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    customer: 'Tech Solutions Inc',
    orderDate: '2024-01-18',
    status: 'Processing',
    totalAmount: 8950.00,
    shippingAddress: '456 Tech Park, San Francisco, CA 94105',
    contactPerson: 'Sarah Johnson',
    contactPhone: '+1-555-0202',
    deliveryNotes: 'Ring doorbell, signature required',
    orderItems: [
      { id: 201, itemName: 'Component X', quantity: 25, unitPrice: 150.00, total: 3750.00, status: 'Processing' },
      { id: 202, itemName: 'Component Y', quantity: 40, unitPrice: 130.00, total: 5200.00, status: 'Processing' }
    ]
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    customer: 'Global Enterprises',
    orderDate: '2024-01-20',
    status: 'Pending',
    totalAmount: 22500.00,
    shippingAddress: '789 Corporate Blvd, Chicago, IL 60601',
    contactPerson: 'Michael Chen',
    contactPhone: '+1-555-0303',
    deliveryNotes: 'Schedule delivery between 9 AM - 5 PM, weekdays only',
    orderItems: [
      { id: 301, itemName: 'Product Alpha', quantity: 150, unitPrice: 150.00, total: 22500.00, status: 'Pending' }
    ]
  }
];

const SmartGridPlusWithNestedRowsDemo = () => {
  const [ordersData, setOrdersData] = useState(initialOrdersData);

  // Order columns configuration
  const orderColumns: GridColumnConfig[] = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      type: 'EditableText',
      width: 150,
      sortable: true,
      filterable: true
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'EditableText',
      width: 200,
      sortable: true,
      filterable: true
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      type: 'Date',
      width: 130,
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
        'Delivered': 'bg-green-500 text-white',
        'Processing': 'bg-blue-500 text-white',
        'Pending': 'bg-yellow-500 text-white',
        'Cancelled': 'bg-red-500 text-white'
      }
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      type: 'CurrencyWithSymbol',
      width: 140,
      sortable: true,
      filterable: true
    },
    {
      key: 'shippingAddress',
      label: 'Shipping Address',
      type: 'EditableText',
      width: 250,
      sortable: true,
      filterable: true,
      subRow: true
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      type: 'EditableText',
      width: 180,
      sortable: true,
      filterable: true,
      subRow: true
    },
    {
      key: 'contactPhone',
      label: 'Contact Phone',
      type: 'EditableText',
      width: 150,
      sortable: true,
      filterable: true,
      subRow: true
    },
    {
      key: 'deliveryNotes',
      label: 'Delivery Notes',
      type: 'EditableText',
      width: 300,
      sortable: true,
      filterable: true,
      subRow: true
    }
  ];

  // Order items (nested) columns configuration
  const orderItemColumns: GridColumnConfig[] = [
    {
      key: 'itemName',
      label: 'Item Name',
      type: 'EditableText',
      width: 200,
      sortable: true
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'Integer',
      width: 100,
      sortable: true
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      type: 'CurrencyWithSymbol',
      width: 120,
      sortable: true
    },
    {
      key: 'total',
      label: 'Total',
      type: 'CurrencyWithSymbol',
      width: 120,
      sortable: true,
      editable: false
    },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      width: 120,
      sortable: true,
      statusMap: {
        'Delivered': 'bg-green-500 text-white',
        'Shipped': 'bg-blue-500 text-white',
        'Processing': 'bg-yellow-500 text-white',
        'Pending': 'bg-gray-500 text-white'
      }
    }
  ];

  // Handle parent order row addition
  const handleAddOrder = async (newOrder: any) => {
    console.log('Adding new order:', newOrder);
    const orderWithId = {
      ...newOrder,
      id: Math.max(...ordersData.map(o => o.id)) + 1,
      orderItems: []
    };
    setOrdersData(prev => [...prev, orderWithId]);
    return orderWithId;
  };

  // Handle parent order row editing
  const handleEditOrder = async (updatedOrder: any, rowIndex: number) => {
    console.log('Editing order:', { rowIndex, updatedOrder });
    setOrdersData(prev => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], ...updatedOrder };
      return updated;
    });
  };

  // Handle parent order row deletion
  const handleDeleteOrder = async (rowIndex: number) => {
    console.log('Deleting order at index:', rowIndex);
    setOrdersData(prev => prev.filter((_, idx) => idx !== rowIndex));
  };

  // Handle nested order item inline edit
  const handleOrderItemEdit = async (
    parentRowIndex: number,
    nestedRowIndex: number,
    updatedItem: any
  ) => {
    console.log('Editing order item:', { parentRowIndex, nestedRowIndex, updatedItem });
    
    setOrdersData(prev => {
      const updated = [...prev];
      const order = { ...updated[parentRowIndex] };
      const items = [...order.orderItems];
      
      // Merge the updated fields with existing item
      const existingItem = items[nestedRowIndex];
      const item = { ...existingItem, ...updatedItem };
      
      // Recalculate total if quantity or unitPrice changed
      if (item.quantity !== undefined && item.unitPrice !== undefined) {
        item.total = Number(item.quantity) * Number(item.unitPrice);
      }
      
      items[nestedRowIndex] = item;
      order.orderItems = items;
      
      // Recalculate order total
      order.totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);
      
      updated[parentRowIndex] = order;
      
      console.log('Updated order data:', updated[parentRowIndex]);
      return updated;
    });
  };

  // Handle adding new nested order item
  const handleAddOrderItem = async (
    parentRowIndex: number,
    newItem: any
  ) => {
    console.log('Adding new order item:', { parentRowIndex, newItem });
    setOrdersData(prev => {
      const updated = [...prev];
      const order = { ...updated[parentRowIndex] };
      const items = [...order.orderItems];
      
      // Generate new ID and calculate total
      const newItemWithId = {
        ...newItem,
        id: Math.max(...items.map(i => i.id), 0) + 1,
        total: (newItem.quantity || 0) * (newItem.unitPrice || 0)
      };
      
      items.push(newItemWithId);
      order.orderItems = items;
      
      // Recalculate order total
      order.totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);
      
      updated[parentRowIndex] = order;
      return updated;
    });
  };

  // Handle deleting nested order item
  const handleDeleteOrderItem = async (
    parentRowIndex: number,
    nestedRowIndex: number
  ) => {
    console.log('Deleting order item:', { parentRowIndex, nestedRowIndex });
    setOrdersData(prev => {
      const updated = [...prev];
      const order = { ...updated[parentRowIndex] };
      const items = [...order.orderItems];
      
      items.splice(nestedRowIndex, 1);
      order.orderItems = items;
      
      // Recalculate order total
      order.totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);
      
      updated[parentRowIndex] = order;
      return updated;
    });
  };

  // Default values for new order rows
  const defaultOrderValues = {
    orderNumber: '',
    customer: '',
    orderDate: '',
    status: '',
    totalAmount: '',
    shippingAddress: '',
    contactPerson: '',
    contactPhone: '',
    deliveryNotes: ''
  };

  // Default values for new order item rows
  const defaultOrderItemValues = {
    itemName: '',
    quantity: '',
    unitPrice: '',
    status: ''
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">SmartGridPlus with Nested Rows Demo</h1>
        <p className="text-muted-foreground">
          Enhanced grid with inline editing, row addition, and nested order items management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold">{ordersData.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Items</div>
          <div className="text-2xl font-bold">
            {ordersData.reduce((sum, order) => sum + order.orderItems.length, 0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold">
            ${ordersData.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending Orders</div>
          <div className="text-2xl font-bold">
            {ordersData.filter(o => o.status === 'Pending').length}
          </div>
        </Card>
      </div>

      {/* Orders Grid with Nested Items */}
      <Card className="p-6">
        <SmartGridPlusWithNestedRows
          columns={orderColumns}
          data={ordersData}
          onAddRow={handleAddOrder}
          onEditRow={handleEditOrder}
          onDeleteRow={handleDeleteOrder}
          defaultRowValues={defaultOrderValues}
          paginationMode="pagination"
          customPageSize={10}
          inlineRowEditing={true}
          nestedSectionConfig={{
            nestedDataKey: 'orderItems',
            columns: orderItemColumns,
            title: 'Order Items',
            showNestedRowCount: true,
            onInlineEdit: handleOrderItemEdit,
            onAddRow: handleAddOrderItem,
            onDeleteRow: handleDeleteOrderItem,
            defaultRowValues: defaultOrderItemValues
          }}
        />
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">Features Demonstrated:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ Inline row addition with default values (empty row at bottom)</li>
          <li>✓ Double-click any cell to edit parent order data</li>
          <li>✓ Nested order items grid (automatically expanded)</li>
          <li>✓ Edit nested items inline with automatic total calculation</li>
          <li>✓ Add, edit, and delete parent orders</li>
          <li>✓ Column sorting, filtering, and resizing</li>
          <li>✓ Row selection with checkboxes</li>
          <li>✓ Persistent grid preferences (column order, widths, visibility)</li>
        </ul>
      </Card>
    </div>
  );
};

export default SmartGridPlusWithNestedRowsDemo;
