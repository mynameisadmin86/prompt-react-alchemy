import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartGridPlusWithNestedPanel } from '@/components/SmartGrid/SmartGridPlusWithNestedPanel';
import { GridColumnConfig } from '@/types/smartgrid';
import { PanelConfig } from '@/types/dynamicPanel';
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react';

// Mock data for products
const initialProductData = [
  {
    id: 'PROD001',
    productName: 'Wireless Mouse',
    category: 'Electronics',
    price: 29.99,
    stock: 150,
    supplier: 'TechCorp',
    status: 'Active',
    lastUpdated: '2024-01-15',
    // Nested panel data
    details: {
      sku: 'WM-2024-001',
      weight: '0.15 kg',
      dimensions: '12x7x4 cm',
      warranty: '2 Years',
      manufacturer: 'TechCorp Industries',
      countryOfOrigin: 'USA',
      description: 'Ergonomic wireless mouse with precision tracking',
      notes: 'Bestseller item'
    }
  },
  {
    id: 'PROD002',
    productName: 'Mechanical Keyboard',
    category: 'Electronics',
    price: 89.99,
    stock: 75,
    supplier: 'KeyMaster',
    status: 'Active',
    lastUpdated: '2024-01-16',
    details: {
      sku: 'MK-2024-002',
      weight: '1.2 kg',
      dimensions: '45x15x4 cm',
      warranty: '3 Years',
      manufacturer: 'KeyMaster Ltd',
      countryOfOrigin: 'Germany',
      description: 'Premium mechanical keyboard with RGB backlight',
      notes: 'Limited edition'
    }
  },
  {
    id: 'PROD003',
    productName: 'USB-C Hub',
    category: 'Accessories',
    price: 45.50,
    stock: 200,
    supplier: 'ConnectPlus',
    status: 'Active',
    lastUpdated: '2024-01-17',
    details: {
      sku: 'UH-2024-003',
      weight: '0.08 kg',
      dimensions: '10x5x2 cm',
      warranty: '1 Year',
      manufacturer: 'ConnectPlus Co',
      countryOfOrigin: 'China',
      description: '7-in-1 USB-C hub with multiple ports',
      notes: 'High demand item'
    }
  },
  {
    id: 'PROD004',
    productName: 'Laptop Stand',
    category: 'Accessories',
    price: 34.99,
    stock: 120,
    supplier: 'ErgoDesk',
    status: 'Low Stock',
    lastUpdated: '2024-01-18',
    details: {
      sku: 'LS-2024-004',
      weight: '0.5 kg',
      dimensions: '28x20x2 cm',
      warranty: '2 Years',
      manufacturer: 'ErgoDesk Solutions',
      countryOfOrigin: 'Canada',
      description: 'Adjustable aluminum laptop stand',
      notes: 'Reorder soon'
    }
  }
];

// Grid columns configuration
const columns: GridColumnConfig[] = [
  {
    key: 'id',
    label: 'Product ID',
    type: 'Link',
    width: 120,
    sortable: true,
    filterable: true,
    mandatory: true,
    editable: false
  },
  {
    key: 'productName',
    label: 'Product Name',
    type: 'EditableText',
    width: 200,
    sortable: true,
    filterable: true,
    mandatory: true,
    editable: true
  },
  {
    key: 'category',
    label: 'Category',
    type: 'Select',
    width: 150,
    sortable: true,
    filterable: true,
    editable: true,
    options: ['Electronics', 'Accessories', 'Furniture', 'Office Supplies']
  },
  {
    key: 'price',
    label: 'Price',
    type: 'EditableText',
    width: 120,
    sortable: true,
    filterable: true,
    editable: true
  },
  {
    key: 'stock',
    label: 'Stock',
    type: 'EditableText',
    width: 100,
    sortable: true,
    filterable: true,
    editable: true
  },
  {
    key: 'supplier',
    label: 'Supplier',
    type: 'Text',
    width: 150,
    sortable: true,
    filterable: true,
    editable: true
  },
  {
    key: 'status',
    label: 'Status',
    type: 'Badge',
    width: 120,
    sortable: true,
    filterable: true,
    editable: true,
    statusMap: {
      'Active': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-yellow-100 text-yellow-800',
      'Out of Stock': 'bg-red-100 text-red-800',
      'Discontinued': 'bg-gray-100 text-gray-800'
    }
  },
  {
    key: 'lastUpdated',
    label: 'Last Updated',
    type: 'Date',
    width: 140,
    sortable: true,
    filterable: true,
    editable: false
  },
  {
    key: 'actions',
    label: 'Actions',
    type: 'ActionButton',
    width: 100,
    editable: false
  }
];

// Dynamic panel configuration for nested details
const createPanelConfig = (row: any): PanelConfig => ({
  sku: {
    id: 'sku',
    label: 'SKU',
    fieldType: 'text',
    value: row.details?.sku || '',
    mandatory: true,
    visible: true,
    editable: true,
    order: 1,
    width: 'half'
  },
  weight: {
    id: 'weight',
    label: 'Weight',
    fieldType: 'text',
    value: row.details?.weight || '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 2,
    width: 'half'
  },
  dimensions: {
    id: 'dimensions',
    label: 'Dimensions',
    fieldType: 'text',
    value: row.details?.dimensions || '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 3,
    width: 'half'
  },
  warranty: {
    id: 'warranty',
    label: 'Warranty Period',
    fieldType: 'text',
    value: row.details?.warranty || '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 4,
    width: 'half'
  },
  manufacturer: {
    id: 'manufacturer',
    label: 'Manufacturer',
    fieldType: 'text',
    value: row.details?.manufacturer || '',
    mandatory: true,
    visible: true,
    editable: true,
    order: 5,
    width: 'half'
  },
  countryOfOrigin: {
    id: 'countryOfOrigin',
    label: 'Country of Origin',
    fieldType: 'select',
    value: row.details?.countryOfOrigin || '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 6,
    width: 'half',
    options: [
      { label: 'USA', value: 'USA' },
      { label: 'Germany', value: 'Germany' },
      { label: 'China', value: 'China' },
      { label: 'Canada', value: 'Canada' },
      { label: 'Japan', value: 'Japan' }
    ]
  },
  description: {
    id: 'description',
    label: 'Description',
    fieldType: 'textarea',
    value: row.details?.description || '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 7,
    width: 'full'
  },
  notes: {
    id: 'notes',
    label: 'Internal Notes',
    fieldType: 'textarea',
    value: row.details?.notes || '',
    mandatory: false,
    visible: true,
    editable: true,
    order: 8,
    width: 'full'
  }
});

export default function SmartGridPlusWithNestedPanelDemo() {
  const [data, setData] = useState(initialProductData);

  // Handle adding a new product
  const handleAddRow = async (newRow: any) => {
    console.log('Adding new product:', newRow);
    // In a real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  // Handle editing a product
  const handleEditRow = async (updatedRow: any, rowIndex: number) => {
    console.log('Editing product:', { updatedRow, rowIndex });
    setData(prev => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], ...updatedRow };
      return updated;
    });
    // In a real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  // Handle deleting a product
  const handleDeleteRow = async (row: any, rowIndex: number) => {
    console.log('Deleting product:', { row, rowIndex });
    // In a real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  // Handle panel data changes
  const handlePanelDataChange = (updatedData: Record<string, any>, rowIndex: number, originalRow: any) => {
    console.log('Panel data changed:', { updatedData, rowIndex, originalRow });
    setData(prev => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        details: {
          ...updated[rowIndex].details,
          ...updatedData
        }
      };
      return updated;
    });
  };

  // Default values for new products
  const defaultRowValues = {
    id: `PROD${String(data.length + 1).padStart(3, '0')}`,
    productName: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
    supplier: '',
    status: 'Active',
    lastUpdated: new Date().toISOString().split('T')[0],
    details: {
      sku: '',
      weight: '',
      dimensions: '',
      warranty: '1 Year',
      manufacturer: '',
      countryOfOrigin: 'USA',
      description: '',
      notes: ''
    }
  };

  // Validation rules
  const validationRules = {
    requiredFields: ['productName', 'category', 'price', 'supplier'],
    maxLength: {
      productName: 100,
      supplier: 100
    },
    customValidationFn: (values: Record<string, any>) => {
      const errors: Record<string, string> = {};
      if (values.price && values.price < 0) {
        errors.price = 'Price cannot be negative';
      }
      if (values.stock && values.stock < 0) {
        errors.stock = 'Stock cannot be negative';
      }
      return errors;
    }
  };

  // Calculate summary statistics
  const totalProducts = data.length;
  const totalValue = data.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const lowStockItems = data.filter(item => item.stock < 100).length;
  const activeProducts = data.filter(item => item.status === 'Active').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground mt-1">
            Enhanced grid with inline editing and nested dynamic panels
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below 100 units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
      </div>

      {/* Smart Grid with Nested Panels */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <SmartGridPlusWithNestedPanel
            columns={columns}
            data={data}
            gridTitle="Products"
            inlineRowAddition={true}
            inlineRowEditing={true}
            onAddRow={handleAddRow}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            defaultRowValues={defaultRowValues}
            validationRules={validationRules}
            addRowButtonLabel="Add Product"
            addRowButtonPosition="top-left"
            paginationMode="pagination"
            nestedPanelConfig={{
              nestedDataKey: 'details',
              panelTitle: (row) => `${row.productName} - Detailed Information`,
              panelConfig: createPanelConfig,
              onPanelDataChange: handlePanelDataChange,
              userId: 'demo-user',
              panelWidth: 'full',
              collapsible: false
            }}
          />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Features Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Grid Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click "Add Product" to insert new rows</li>
                <li>Double-click any row to edit inline</li>
                <li>Use the trash icon to delete products</li>
                <li>Sort columns by clicking headers</li>
                <li>Filter data using column filters</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Nested Panel Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click chevron icon to expand row details</li>
                <li>Edit detailed product information in the panel</li>
                <li>Panel includes SKU, dimensions, warranty info</li>
                <li>Changes are automatically synced with main grid</li>
                <li>Validation works across grid and panel</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
