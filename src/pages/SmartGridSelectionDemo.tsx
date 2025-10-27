import { useState } from 'react';
import { SmartGrid, GridColumnConfig } from '@/components/SmartGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SmartGridSelectionDemo = () => {
  const { toast } = useToast();

  // Sample data - product inventory
  const sampleData = [
    { id: 1, productName: 'Laptop Pro 15"', category: 'Electronics', price: 1299.99, stock: 45, status: 'In Stock', supplier: 'TechCorp' },
    { id: 2, productName: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 150, status: 'In Stock', supplier: 'PeriphPlus' },
    { id: 3, productName: 'USB-C Hub', category: 'Accessories', price: 49.99, stock: 8, status: 'Low Stock', supplier: 'ConnectAll' },
    { id: 4, productName: 'Monitor 27" 4K', category: 'Electronics', price: 549.99, stock: 0, status: 'Out of Stock', supplier: 'DisplayMax' },
    { id: 5, productName: 'Mechanical Keyboard', category: 'Accessories', price: 159.99, stock: 32, status: 'In Stock', supplier: 'TypeMaster' },
    { id: 6, productName: 'Webcam HD Pro', category: 'Electronics', price: 89.99, stock: 12, status: 'In Stock', supplier: 'VisionTech' },
    { id: 7, productName: 'Standing Desk', category: 'Furniture', price: 399.99, stock: 5, status: 'Low Stock', supplier: 'ErgoSpace' },
    { id: 8, productName: 'Office Chair', category: 'Furniture', price: 249.99, stock: 18, status: 'In Stock', supplier: 'ComfortSeating' },
    { id: 9, productName: 'Desk Lamp LED', category: 'Accessories', price: 39.99, stock: 0, status: 'Out of Stock', supplier: 'BrightLight' },
    { id: 10, productName: 'Laptop Stand', category: 'Accessories', price: 34.99, stock: 67, status: 'In Stock', supplier: 'ErgoSpace' },
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
  ];

  // Default selected rows - pre-select rows with indices 0, 2, and 6 (Laptop, USB-C Hub, Standing Desk)
  const [defaultSelectedRows] = useState<Set<number>>(new Set([0, 2, 6]));
  const [selectedRows, setSelectedRows] = useState<Set<number>>(defaultSelectedRows);

  // Get selected products
  const selectedProducts = Array.from(selectedRows)
    .map(index => sampleData[index])
    .filter(Boolean);

  const totalValue = selectedProducts.reduce((sum, product) => sum + (product?.price || 0), 0);

  const handleSelectionChange = (newSelection: Set<number>) => {
    setSelectedRows(newSelection);
  };

  const handleProcessOrder = () => {
    toast({
      title: "Order Processed",
      description: `Successfully processed ${selectedProducts.length} items worth $${totalValue.toFixed(2)}`,
    });
  };

  const handleResetSelection = () => {
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
              <h1 className="text-3xl font-bold">SmartGrid Selection Demo</h1>
              <p className="text-muted-foreground mt-1">
                Demonstrates default selected rows feature with row selection controls
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
              This demo showcases the <code className="px-1.5 py-0.5 rounded bg-muted">defaultSelectedRows</code> prop that allows you to pre-select rows on initial load. 
              Users can still change the selection by checking/unchecking rows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Pass <code className="px-1 py-0.5 rounded bg-muted">defaultSelectedRows</code> prop to SmartGrid</li>
                  <li>Selected rows are highlighted on initial load</li>
                  <li>Users can change selection by clicking checkboxes</li>
                  <li>Selection state is managed via <code className="px-1 py-0.5 rounded bg-muted">onSelectionChange</code></li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Default Selection:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <Badge variant="outline" className="mr-2">Row 0</Badge> Laptop Pro 15"
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <Badge variant="outline" className="mr-2">Row 2</Badge> USB-C Hub
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <Badge variant="outline" className="mr-2">Row 6</Badge> Standing Desk
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

        {/* SmartGrid */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>
              Select products to add to your order. Three items are pre-selected by default.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SmartGrid
              columns={columns}
              data={sampleData}
              defaultSelectedRows={defaultSelectedRows}
              selectedRows={selectedRows}
              onSelectionChange={handleSelectionChange}
              paginationMode="pagination"
              showCreateButton={false}
              searchPlaceholder="Search products..."
            />
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Example</CardTitle>
            <CardDescription>How to use the defaultSelectedRows feature</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`// Define default selected rows (row indices)
const [defaultSelectedRows] = useState<Set<number>>(
  new Set([0, 2, 6])
);

// Track current selection
const [selectedRows, setSelectedRows] = useState<Set<number>>(
  defaultSelectedRows
);

// Handle selection changes
const handleSelectionChange = (newSelection: Set<number>) => {
  setSelectedRows(newSelection);
};

// Use in SmartGrid
<SmartGrid
  columns={columns}
  data={data}
  defaultSelectedRows={defaultSelectedRows}
  selectedRows={selectedRows}
  onSelectionChange={handleSelectionChange}
/>`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartGridSelectionDemo;
