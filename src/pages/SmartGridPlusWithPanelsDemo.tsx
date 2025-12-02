import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartGridPlusWithPanels, RowPanelConfig } from '@/components/SmartGrid/SmartGridPlusWithPanels';
import { GridColumnConfig } from '@/types/smartgrid';
import { PanelConfig } from '@/types/dynamicPanel';
import { useToast } from '@/hooks/use-toast';

// Mock data for orders
const initialOrdersData = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerName: 'Acme Corp',
    status: 'Pending',
    totalAmount: 5000,
    orderDate: '2024-01-15',
    productType: 'Electronics',
    priority: 'High',
    notes: 'Urgent delivery required',
    shippingAddress: '123 Main St, City, State 12345',
    paymentMethod: 'Credit Card',
    deliveryDate: '2024-01-20'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerName: 'Tech Solutions Inc',
    status: 'Processing',
    totalAmount: 12000,
    orderDate: '2024-01-16',
    productType: 'Software',
    priority: 'Medium',
    notes: 'License keys to be sent via email',
    shippingAddress: 'N/A - Digital Product',
    paymentMethod: 'Wire Transfer',
    deliveryDate: '2024-01-18'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerName: 'Global Industries',
    status: 'Shipped',
    totalAmount: 8500,
    orderDate: '2024-01-10',
    productType: 'Hardware',
    priority: 'Low',
    notes: 'Standard shipping',
    shippingAddress: '456 Industrial Blvd, City, State 54321',
    paymentMethod: 'Purchase Order',
    deliveryDate: '2024-01-25'
  }
];

export default function SmartGridPlusWithPanelsDemo() {
  const [data, setData] = useState(initialOrdersData);
  const { toast } = useToast();

  // Define grid columns
  const columns: GridColumnConfig[] = [
    {
      key: 'orderNumber',
      label: 'Order #',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 120,
      editable: true
    },
    {
      key: 'customerName',
      label: 'Customer',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 180,
      editable: true
    },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      sortable: true,
      filterable: true,
      width: 120,
      editable: true,
      statusMap: {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Shipped': 'bg-green-100 text-green-800',
        'Delivered': 'bg-purple-100 text-purple-800',
        'Cancelled': 'bg-red-100 text-red-800'
      }
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 120,
      editable: true
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      type: 'Date',
      sortable: true,
      filterable: true,
      width: 120,
      editable: true
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'ActionButton',
      width: 100,
      editable: false
    }
  ];

  // Configure different panels based on order type
  const rowPanelConfig: RowPanelConfig = {
    getPanelConfig: (row: any, rowIndex: number) => {
      // Different panel configurations based on product type
      if (row.productType === 'Electronics') {
        return {
          priority: {
            id: 'priority',
            label: 'Priority',
            fieldType: 'select',
            value: row.priority || 'Medium',
            mandatory: true,
            visible: true,
            editable: true,
            order: 1,
            width: 'half',
            options: [
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' }
            ]
          },
          productType: {
            id: 'productType',
            label: 'Product Type',
            fieldType: 'text',
            value: row.productType || '',
            mandatory: true,
            visible: true,
            editable: false,
            order: 2,
            width: 'half'
          },
          shippingAddress: {
            id: 'shippingAddress',
            label: 'Shipping Address',
            fieldType: 'textarea',
            value: row.shippingAddress || '',
            mandatory: true,
            visible: true,
            editable: true,
            order: 3,
            width: 'full'
          },
          paymentMethod: {
            id: 'paymentMethod',
            label: 'Payment Method',
            fieldType: 'select',
            value: row.paymentMethod || 'Credit Card',
            mandatory: true,
            visible: true,
            editable: true,
            order: 4,
            width: 'half',
            options: [
              { label: 'Credit Card', value: 'Credit Card' },
              { label: 'Wire Transfer', value: 'Wire Transfer' },
              { label: 'Purchase Order', value: 'Purchase Order' },
              { label: 'PayPal', value: 'PayPal' }
            ]
          },
          deliveryDate: {
            id: 'deliveryDate',
            label: 'Expected Delivery',
            fieldType: 'date',
            value: row.deliveryDate || '',
            mandatory: true,
            visible: true,
            editable: true,
            order: 5,
            width: 'half'
          },
          notes: {
            id: 'notes',
            label: 'Order Notes',
            fieldType: 'textarea',
            value: row.notes || '',
            mandatory: false,
            visible: true,
            editable: true,
            order: 6,
            width: 'full'
          }
        };
      } else if (row.productType === 'Software') {
        return {
          priority: {
            id: 'priority',
            label: 'Priority',
            fieldType: 'select',
            value: row.priority || 'Medium',
            mandatory: true,
            visible: true,
            editable: true,
            order: 1,
            width: 'third',
            options: [
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' }
            ]
          },
          productType: {
            id: 'productType',
            label: 'Product Type',
            fieldType: 'text',
            value: row.productType || '',
            mandatory: true,
            visible: true,
            editable: false,
            order: 2,
            width: 'third'
          },
          deliveryMethod: {
            id: 'deliveryMethod',
            label: 'Delivery Method',
            fieldType: 'select',
            value: 'Email',
            mandatory: true,
            visible: true,
            editable: true,
            order: 3,
            width: 'third',
            options: [
              { label: 'Email', value: 'Email' },
              { label: 'Download Link', value: 'Download Link' },
              { label: 'USB Drive', value: 'USB Drive' }
            ]
          },
          licenseType: {
            id: 'licenseType',
            label: 'License Type',
            fieldType: 'select',
            value: 'Enterprise',
            mandatory: true,
            visible: true,
            editable: true,
            order: 4,
            width: 'half',
            options: [
              { label: 'Single User', value: 'Single User' },
              { label: 'Multi User', value: 'Multi User' },
              { label: 'Enterprise', value: 'Enterprise' }
            ]
          },
          activationDate: {
            id: 'activationDate',
            label: 'Activation Date',
            fieldType: 'date',
            value: row.deliveryDate || '',
            mandatory: true,
            visible: true,
            editable: true,
            order: 5,
            width: 'half'
          },
          notes: {
            id: 'notes',
            label: 'License Notes',
            fieldType: 'textarea',
            value: row.notes || '',
            mandatory: false,
            visible: true,
            editable: true,
            order: 6,
            width: 'full'
          }
        };
      } else {
        // Default panel for Hardware and others
        return {
          priority: {
            id: 'priority',
            label: 'Priority',
            fieldType: 'select',
            value: row.priority || 'Medium',
            mandatory: true,
            visible: true,
            editable: true,
            order: 1,
            width: 'third',
            options: [
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' }
            ]
          },
          productType: {
            id: 'productType',
            label: 'Product Type',
            fieldType: 'text',
            value: row.productType || '',
            mandatory: true,
            visible: true,
            editable: false,
            order: 2,
            width: 'third'
          },
          quantity: {
            id: 'quantity',
            label: 'Quantity',
            fieldType: 'text',
            value: '10',
            mandatory: true,
            visible: true,
            editable: true,
            order: 3,
            width: 'third',
            inputType: 'number'
          },
          shippingAddress: {
            id: 'shippingAddress',
            label: 'Shipping Address',
            fieldType: 'textarea',
            value: row.shippingAddress || '',
            mandatory: true,
            visible: true,
            editable: true,
            order: 4,
            width: 'full'
          },
          deliveryDate: {
            id: 'deliveryDate',
            label: 'Expected Delivery',
            fieldType: 'date',
            value: row.deliveryDate || '',
            mandatory: true,
            visible: true,
            editable: true,
            order: 5,
            width: 'half'
          },
          trackingNumber: {
            id: 'trackingNumber',
            label: 'Tracking Number',
            fieldType: 'text',
            value: 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            mandatory: false,
            visible: true,
            editable: true,
            order: 6,
            width: 'half'
          },
          notes: {
            id: 'notes',
            label: 'Shipping Notes',
            fieldType: 'textarea',
            value: row.notes || '',
            mandatory: false,
            visible: true,
            editable: true,
            order: 7,
            width: 'full'
          }
        };
      }
    },
    panelTitle: (row: any, rowIndex: number) => {
      return `${row.orderNumber} - ${row.productType} Details`;
    },
    onPanelDataChange: (rowIndex: number, updatedData: Record<string, any>) => {
      console.log(`Panel data changed for row ${rowIndex}:`, updatedData);
      // Update the main grid data with panel changes
      setData(prevData => {
        const newData = [...prevData];
        newData[rowIndex] = {
          ...newData[rowIndex],
          ...updatedData
        };
        return newData;
      });
    }
  };

  const handleAddRow = async (newRow: any) => {
    console.log('Adding new row:', newRow);
    toast({
      title: 'Row Added',
      description: `Order ${newRow.orderNumber} has been added.`
    });
  };

  const handleEditRow = async (updatedRow: any, rowIndex: number) => {
    console.log('Editing row:', rowIndex, updatedRow);
    toast({
      title: 'Row Updated',
      description: `Order ${updatedRow.orderNumber} has been updated.`
    });
  };

  const handleDeleteRow = async (row: any, rowIndex: number) => {
    console.log('Deleting row:', rowIndex, row);
    toast({
      title: 'Row Deleted',
      description: `Order ${row.orderNumber} has been deleted.`
    });
  };

  const defaultRowValues = {
    orderNumber: '',
    customerName: '',
    status: 'Pending',
    totalAmount: 0,
    orderDate: new Date().toISOString().split('T')[0],
    productType: 'Electronics',
    priority: 'Medium',
    notes: '',
    shippingAddress: '',
    paymentMethod: 'Credit Card',
    deliveryDate: ''
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">SmartGrid Plus with Panels Demo</h1>
        <p className="text-muted-foreground">
          Each row has a nested panel with different fields based on product type. Expand rows to see detailed forms.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders with Dynamic Panels</CardTitle>
        </CardHeader>
        <CardContent>
          <SmartGridPlusWithPanels
            columns={columns}
            data={data}
            onAddRow={handleAddRow}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            defaultRowValues={defaultRowValues}
            inlineRowEditing={true}
            inlineRowAddition={true}
            rowPanelConfig={rowPanelConfig}
            gridTitle="Order Management"
            paginationMode="pagination"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Each row has a collapsible panel with different fields</li>
              <li>Electronics orders show shipping and payment details</li>
              <li>Software orders show license type and activation details</li>
              <li>Hardware orders show quantity and tracking information</li>
              <li>Panel data changes are synchronized with the main grid</li>
              <li>Inline row editing and addition supported</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Try it:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Click the expand icon on any row to see its detailed panel</li>
              <li>Notice how different product types show different fields</li>
              <li>Edit values in the panels and see them reflected in the grid</li>
              <li>Double-click rows to edit inline</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
