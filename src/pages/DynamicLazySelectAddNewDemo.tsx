import React, { useState } from 'react';
import { DynamicLazySelect } from '@/components/DynamicPanel/DynamicLazySelect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Mock data for products
const mockProducts = [
  { id: 'P001', name: 'Laptop Pro X1' },
  { id: 'P002', name: 'Wireless Mouse' },
  { id: 'P003', name: 'USB-C Hub' },
  { id: 'P004', name: 'Mechanical Keyboard' },
  { id: 'P005', name: '27" Monitor' },
  { id: 'P006', name: 'Webcam HD' },
  { id: 'P007', name: 'Headphones' },
  { id: 'P008', name: 'Laptop Stand' },
];

// Mock data for categories
const mockCategories = [
  { id: 'CAT01', name: 'Electronics' },
  { id: 'CAT02', name: 'Accessories' },
  { id: 'CAT03', name: 'Peripherals' },
  { id: 'CAT04', name: 'Software' },
];

// Simulated server-side storage for newly added items
let dynamicProducts = [...mockProducts];
let dynamicCategories = [...mockCategories];

export default function DynamicLazySelectAddNewDemo() {
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedMultiProducts, setSelectedMultiProducts] = useState<string[] | undefined>();

  // Fetch products with search
  const fetchProducts = async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    let filtered = dynamicProducts;
    if (searchTerm) {
      filtered = dynamicProducts.filter(p => 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.slice(offset, offset + limit);
  };

  // Fetch categories with search
  const fetchCategories = async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = dynamicCategories;
    if (searchTerm) {
      filtered = dynamicCategories.filter(c => 
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.slice(offset, offset + limit);
  };

  // Handle adding new product
  const handleAddNewProduct = async (newValue: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    const newProduct = {
      id: `P${String(dynamicProducts.length + 1).padStart(3, '0')}`,
      name: newValue,
    };
    
    dynamicProducts = [...dynamicProducts, newProduct];
    toast.success(`Product "${newValue}" added successfully!`, {
      description: `ID: ${newProduct.id}`,
    });
  };

  // Handle adding new category
  const handleAddNewCategory = async (newValue: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCategory = {
      id: `CAT${String(dynamicCategories.length + 1).padStart(2, '0')}`,
      name: newValue,
    };
    
    dynamicCategories = [...dynamicCategories, newCategory];
    toast.success(`Category "${newValue}" added successfully!`, {
      description: `ID: ${newCategory.id}`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">DynamicLazySelect - Add New Item Demo</h1>
        <p className="text-muted-foreground mt-2">
          Demonstrates the <code className="bg-muted px-1.5 py-0.5 rounded text-sm">allowAddNew</code> feature 
          that lets users add items not in the list directly from the dropdown.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Select with Add New */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Single Select with Add New</CardTitle>
            <CardDescription>
              Type a product name that doesn't exist and click "Add" or press Enter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Product</label>
              <DynamicLazySelect
                fetchOptions={fetchProducts}
                value={selectedProduct}
                onChange={(val) => setSelectedProduct(val as string | undefined)}
                placeholder="Search or add product..."
                allowAddNew={true}
                onAddNew={handleAddNewProduct}
              />
            </div>
            {selectedProduct && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <span className="font-medium">Selected:</span> {selectedProduct}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Select with Add New */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Select with Add New</CardTitle>
            <CardDescription>
              Add new categories on-the-fly while selecting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Category</label>
              <DynamicLazySelect
                fetchOptions={fetchCategories}
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val as string | undefined)}
                placeholder="Search or add category..."
                allowAddNew={true}
                onAddNew={handleAddNewCategory}
              />
            </div>
            {selectedCategory && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <span className="font-medium">Selected:</span> {selectedCategory}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Multi-Select with Add New */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Multi-Select with Add New</CardTitle>
            <CardDescription>
              Select multiple products and add new ones as needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Products</label>
              <DynamicLazySelect
                fetchOptions={fetchProducts}
                value={selectedMultiProducts}
                onChange={(val) => setSelectedMultiProducts(val as string[] | undefined)}
                placeholder="Search or add products..."
                multiSelect={true}
                allowAddNew={true}
                onAddNew={handleAddNewProduct}
              />
            </div>
            {selectedMultiProducts && selectedMultiProducts.length > 0 && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <span className="font-medium">Selected ({selectedMultiProducts.length}):</span>
                <ul className="mt-2 space-y-1">
                  {selectedMultiProducts.map((p, i) => (
                    <li key={i} className="text-muted-foreground">• {p}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Without Add New (Default) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Standard DynamicLazySelect (No Add New)</CardTitle>
            <CardDescription>
              For comparison - standard behavior without the add new feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium mb-2 block">Select Product</label>
              <DynamicLazySelect
                fetchOptions={fetchProducts}
                value={undefined}
                onChange={() => {}}
                placeholder="Search products..."
                allowAddNew={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Code Example */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`<DynamicLazySelect
  fetchOptions={fetchProducts}
  value={selectedProduct}
  onChange={setSelectedProduct}
  placeholder="Search or add product..."
  allowAddNew={true}
  onAddNew={async (newValue) => {
    // Send to server
    await api.createProduct({ name: newValue });
    toast.success(\`Product "\${newValue}" added!\`);
  }}
/>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}