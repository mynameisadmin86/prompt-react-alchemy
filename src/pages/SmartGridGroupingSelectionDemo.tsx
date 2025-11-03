import { useState } from 'react';
import { SmartGridWithGrouping, GridColumnConfig } from '@/components/SmartGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SmartGridGroupingSelectionDemo = () => {
  const { toast } = useToast();

  // Sample data - product inventory
  const sampleData = [
    { id: 1, productName: 'Laptop Pro 15"', category: 'Electronics', price: 1299.99, stock: 45, status: 'In Stock', supplier: 'TechCorp', location: 'Warehouse A' },
    { id: 2, productName: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 150, status: 'In Stock', supplier: 'PeriphPlus', location: 'Warehouse B' },
    { id: 3, productName: 'USB-C Hub', category: 'Accessories', price: 49.99, stock: 8, status: 'Low Stock', supplier: 'ConnectAll', location: 'Warehouse A' },
    { id: 4, productName: 'Monitor 27" 4K', category: 'Electronics', price: 549.99, stock: 0, status: 'Out of Stock', supplier: 'DisplayMax', location: 'Warehouse C' },
    { id: 5, productName: 'Mechanical Keyboard', category: 'Accessories', price: 159.99, stock: 32, status: 'In Stock', supplier: 'TypeMaster', location: 'Warehouse B' },
    { id: 6, productName: 'Webcam HD Pro', category: 'Electronics', price: 89.99, stock: 12, status: 'In Stock', supplier: 'VisionTech', location: 'Warehouse A' },
    { id: 7, productName: 'Standing Desk', category: 'Furniture', price: 399.99, stock: 5, status: 'Low Stock', supplier: 'ErgoSpace', location: 'Warehouse C' },
    { id: 8, productName: 'Office Chair', category: 'Furniture', price: 249.99, stock: 18, status: 'In Stock', supplier: 'ComfortSeating', location: 'Warehouse B' },
    { id: 9, productName: 'Desk Lamp LED', category: 'Accessories', price: 39.99, stock: 0, status: 'Out of Stock', supplier: 'BrightLight', location: 'Warehouse A' },
    { id: 10, productName: 'Laptop Stand', category: 'Accessories', price: 34.99, stock: 67, status: 'In Stock', supplier: 'ErgoSpace', location: 'Warehouse C' },
  ];

  // Grid columns configuration
  const columns: GridColumnConfig[] = [
    { key: 'productName', label: 'Product Name', type: 'Text', sortable: true, filterable: true, width: 200 },
    { key: 'category', label: 'Category', type: 'Badge', sortable: true, filterable: true, width: 120,
      statusMap: {
        'Electronics': 'bg-blue-100 text-blue-800',
        'Accessories': 'bg-green-100 text-green-800',
        'Furniture': 'bg-purple-100 text-purple-800',
      }
    },
    { key: 'price', label: 'Price', type: 'Text', sortable: true, filterable: true, width: 100 },
    { key: 'stock', label: 'Stock', type: 'Text', sortable: true, filterable: true, width: 80 },
    { key: 'status', label: 'Status', type: 'Badge', sortable: true, filterable: true, width: 120,
      statusMap: {
        'In Stock': 'bg-green-100 text-green-800',
        'Low Stock': 'bg-yellow-100 text-yellow-800',
        'Out of Stock': 'bg-red-100 text-red-800',
      }
    },
    { key: 'supplier', label: 'Supplier', type: 'Text', sortable: true, filterable: true, width: 150 },
    { key: 'location', label: 'Location', type: 'Text', sortable: true, filterable: true, width: 130 },
  ];

  // Default selected rows - pre-select rows at indices 0, 2, and 6 (Laptop, USB-C Hub, Standing Desk)
  const [defaultSelectedRows] = useState<Set<number>>(new Set([0, 2, 6]));
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set([1, 3, 7])); // IDs for initial selection
  const [selectedRows, setSelectedRows] = useState<Set<number>>(defaultSelectedRows);

  // Get selected products
  const selectedProducts = sampleData.filter(product => selectedRowIds.has(product.id));
  const totalValue = selectedProducts.reduce((sum, product) => sum + (product?.price || 0), 0);

  // Handle row click to toggle selection
  const handleRowClick = (row: typeof sampleData[0], index: number) => {
    // Don't allow selection of group headers
    if ((row as any).__isGroupHeader) {
      return;
    }

    const newSelectedRowIds = new Set(selectedRowIds);
    const newSelectedRows = new Set(selectedRows);
    
    if (newSelectedRowIds.has(row.id)) {
      // Deselect
      newSelectedRowIds.delete(row.id);
      // Find the actual index in original data
      const originalIndex = sampleData.findIndex(item => item.id === row.id);
      if (originalIndex !== -1) {
        newSelectedRows.delete(originalIndex);
      }
    } else {
      // Select
      newSelectedRowIds.add(row.id);
      // Find the actual index in original data
      const originalIndex = sampleData.findIndex(item => item.id === row.id);
      if (originalIndex !== -1) {
        newSelectedRows.add(originalIndex);
      }
    }
    
    setSelectedRowIds(newSelectedRowIds);
    setSelectedRows(newSelectedRows);
  };

  const handleProcessOrder = () => {
    toast({
      title: "Order Processed",
      description: `Successfully processed ${selectedProducts.length} items worth $${totalValue.toFixed(2)}`,
    });
  };

  const handleResetSelection = () => {
    setSelectedRowIds(new Set([1, 3, 7]));
    setSelectedRows(defaultSelectedRows);
    toast({
      title: "Selection Reset",
      description: "Selection has been reset to default products",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Layers className="h-8 w-8 text-primary" />
                SmartGrid Grouping + Selection Demo
              </h1>
              <p className="text-muted-foreground mt-1">
                Demonstrates SmartGridWithGrouping with pre-selected rows feature
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Feature Overview
            </CardTitle>
            <CardDescription>
              This demo showcases <strong>SmartGridWithGrouping</strong> with row selection. Group items by category, status, or location, 
              and click any row to select/deselect it. Three products are pre-selected by default.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Click on any data row to select or deselect it</li>
                  <li>Group headers are not selectable (clicking toggles group)</li>
                  <li>Selected rows are highlighted even when grouped</li>
                  <li>Selection persists across different grouping modes</li>
                  <li>Uses <code className="px-1 py-0.5 rounded bg-muted">selectedRows</code> prop with index mapping</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Default Selection:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <Badge variant="outline" className="mr-2">Index 0</Badge> Laptop Pro 15" ($1,299.99)
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <Badge variant="outline" className="mr-2">Index 2</Badge> USB-C Hub ($49.99)
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <Badge variant="outline" className="mr-2">Index 6</Badge> Standing Desk ($399.99)
                </div>
                <div className="pt-2 text-sm font-semibold">
                  Total: ${(1299.99 + 49.99 + 399.99).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selection Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Selection Summary</CardTitle>
            <CardDescription>Current selection details and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Items Selected</p>
                <p className="text-2xl font-bold">{selectedProducts.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Action</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleProcessOrder}
                    disabled={selectedProducts.length === 0}
                    size="sm"
                  >
                    Process Order
                  </Button>
                  <Button 
                    onClick={handleResetSelection}
                    variant="outline"
                    size="sm"
                  >
                    Reset Selection
                  </Button>
                </div>
              </div>
            </div>

            {selectedProducts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Selected Products:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map((product, idx) => (
                    <Badge key={idx} variant="secondary">
                      {product?.productName} - ${product?.price}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SmartGridWithGrouping */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory (Grouped)</CardTitle>
            <CardDescription>
              Use the dropdown in the toolbar to group by different fields. Click any row to select/deselect it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <style>{`
              ${Array.from(selectedRowIds).map((rowId) => {
                return `
                  tr[data-row-id="${rowId}"] {
                    background-color: hsl(var(--primary) / 0.1) !important;
                    border-left: 4px solid hsl(var(--primary)) !important;
                  }
                  tr[data-row-id="${rowId}"]:hover {
                    background-color: hsl(var(--primary) / 0.15) !important;
                  }
                `;
              }).join('\n')}
            `}</style>
            <SmartGridWithGrouping
              columns={columns}
              data={sampleData}
              groupableColumns={['category', 'status', 'location', 'supplier']}
              showGroupingDropdown={true}
              groupByField="category"
              selectedRows={selectedRows}
              onRowClick={handleRowClick}
              rowClassName={(row: any) => {
                return selectedRowIds.has(row.id) ? 'selected' : '';
              }}
              paginationMode="pagination"
              showCreateButton={false}
              searchPlaceholder="Search products..."
              clientSideSearch={true}
            />
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Example</CardTitle>
            <CardDescription>How to use selectedRows with SmartGridWithGrouping</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`// Track selected row indices (from original data, not grouped)
const [selectedRows, setSelectedRows] = useState<Set<number>>(
  new Set([0, 2, 6]) // Initial selected indices
);
const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(
  new Set([1, 3, 7]) // Initial selected product IDs
);

// Handle row click to toggle selection
const handleRowClick = (row: Product, index: number) => {
  // Don't allow selection of group headers
  if (row.__isGroupHeader) return;
  
  const newSelectedRowIds = new Set(selectedRowIds);
  const newSelectedRows = new Set(selectedRows);
  
  if (newSelectedRowIds.has(row.id)) {
    // Deselect
    newSelectedRowIds.delete(row.id);
    const originalIndex = data.findIndex(item => item.id === row.id);
    if (originalIndex !== -1) newSelectedRows.delete(originalIndex);
  } else {
    // Select
    newSelectedRowIds.add(row.id);
    const originalIndex = data.findIndex(item => item.id === row.id);
    if (originalIndex !== -1) newSelectedRows.add(originalIndex);
  }
  
  setSelectedRowIds(newSelectedRowIds);
  setSelectedRows(newSelectedRows);
};

// Use in SmartGridWithGrouping
<>
  <style>{\`
    \${Array.from(selectedRowIds).map((rowId) => \`
      tr[data-row-id="\${rowId}"] {
        background-color: hsl(var(--primary) / 0.1) !important;
        border-left: 4px solid hsl(var(--primary)) !important;
      }
    \`).join('\\n')}
  \`}</style>
  <SmartGridWithGrouping
    columns={columns}
    data={data}
    groupableColumns={['category', 'status', 'location']}
    showGroupingDropdown={true}
    selectedRows={selectedRows}
    onRowClick={handleRowClick}
    rowClassName={(row) => selectedRowIds.has(row.id) ? 'selected' : ''}
  />
</>`}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Understanding the selection mechanism with grouping</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Index Mapping</h4>
                <p className="text-muted-foreground">
                  SmartGridWithGrouping internally maps your <code className="px-1 py-0.5 rounded bg-muted">selectedRows</code> indices 
                  from the original data array to the grouped display data. This means you always work with indices from your original 
                  data, and the component handles the complexity of group headers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Group Headers</h4>
                <p className="text-muted-foreground">
                  Group header rows have a special <code className="px-1 py-0.5 rounded bg-muted">__isGroupHeader</code> property. 
                  These rows are excluded from selection and clicking them toggles group expansion instead.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Persistence</h4>
                <p className="text-muted-foreground">
                  Your selection state is based on the original data indices/IDs, so it persists correctly when you change grouping 
                  or expand/collapse groups. Selected items remain selected regardless of how you organize the view.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartGridGroupingSelectionDemo;