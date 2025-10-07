import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicPanel, type DynamicPanelRef } from '@/components/DynamicPanel';
import type { PanelConfig } from '@/types/dynamicPanel';
import { useProductStore } from '@/datastore/productStore';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save, RotateCcw } from 'lucide-react';

const ProductManagementZustand = () => {
  const navigate = useNavigate();
  const panelRef = useRef<DynamicPanelRef>(null);
  
  const { 
    product, 
    loading, 
    error, 
    validationResult,
    updateField,
    updateMultipleFields,
    setValidationResult,
    saveProduct,
    reset
  } = useProductStore();

  useEffect(() => {
    // Initialize with empty product
    reset();
  }, [reset]);

  const handleFieldChange = (fieldId: string, value: any) => {
    updateField(fieldId as keyof typeof product, value);
  };

  const handleValidateAndSave = async () => {
    if (!panelRef.current) return;

    // Trigger panel validation
    const validation = panelRef.current.doValidation();
    setValidationResult(validation);

    if (!validation.isValid) {
      toast({
        title: "Validation Failed",
        description: `Please fix ${validation.mandatoryFieldsEmpty.length} error(s)`,
        variant: "destructive"
      });
      return;
    }

    try {
      await saveProduct();
      toast({
        title: "Success",
        description: "Product saved successfully!",
        variant: "default"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    reset();
    toast({
      title: "Reset",
      description: "Form has been reset",
      variant: "default"
    });
  };

  const productPanelConfig: PanelConfig = {
    id: 'product-details',
    title: 'Product Information',
    icon: 'Package',
    collapsible: true,
    defaultCollapsed: false,
    width: 12,
    hideHeader: false,
    fields: [
      {
        id: 'name',
        label: 'Product Name',
        fieldType: 'text',
        value: product.name || '',
        mandatory: true,
        visible: true,
        editable: true,
        width: 6,
        onValueChange: (value) => handleFieldChange('name', value)
      },
      {
        id: 'category',
        label: 'Category',
        fieldType: 'select',
        value: product.category || '',
        mandatory: true,
        visible: true,
        editable: true,
        width: 6,
        options: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Food', value: 'food' },
          { label: 'Books', value: 'books' }
        ],
        onValueChange: (value) => handleFieldChange('category', value)
      },
      {
        id: 'price',
        label: 'Price',
        fieldType: 'currency',
        value: product.price || 0,
        mandatory: true,
        visible: true,
        editable: true,
        width: 6,
        onValueChange: (value) => handleFieldChange('price', value)
      },
      {
        id: 'stock',
        label: 'Stock Quantity',
        fieldType: 'text',
        value: product.stock?.toString() || '0',
        mandatory: true,
        visible: true,
        editable: true,
        width: 6,
        onValueChange: (value) => handleFieldChange('stock', parseInt(value) || 0)
      },
      {
        id: 'status',
        label: 'Status',
        fieldType: 'select',
        value: product.status || 'active',
        mandatory: true,
        visible: true,
        editable: true,
        width: 6,
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ],
        onValueChange: (value) => handleFieldChange('status', value)
      },
      {
        id: 'description',
        label: 'Description',
        fieldType: 'textarea',
        value: product.description || '',
        mandatory: false,
        visible: true,
        editable: true,
        width: 12,
        onValueChange: (value) => handleFieldChange('description', value)
      }
    ]
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground mt-1">
            Simple example with DynamicPanel, Zustand, API & Validation
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleValidateAndSave}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!validationResult.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="list-disc list-inside mt-2">
              {validationResult.mandatoryFieldsEmpty.map((field) => (
                <li key={field}>{field} is required</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-12 gap-4">
        <DynamicPanel
          ref={panelRef}
          panelConfig={productPanelConfig}
          onDataChange={(data) => updateMultipleFields(data)}
          isPreviewMode={false}
        />
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Current Product Data (Zustand Store)</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(product, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ProductManagementZustand;
