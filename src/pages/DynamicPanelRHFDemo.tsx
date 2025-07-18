import React, { useState } from 'react';
import { DynamicPanelRHF } from '@/components/DynamicPanel';
import { PanelConfig, PanelSettings } from '@/types/dynamicPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const DynamicPanelRHFDemo = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Sample panel configuration
  const samplePanelConfig: PanelConfig = {
    customer: {
      id: 'customer',
      label: 'Customer Name',
      fieldType: 'text',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'half',
      placeholder: 'Enter customer name'
    },
    description: {
      id: 'description',
      label: 'Description',
      fieldType: 'textarea',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      width: 'full',
      placeholder: 'Enter description'
    },
    email: {
      id: 'email',
      label: 'Email Address',
      fieldType: 'text',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 3,
      width: 'half',
      placeholder: 'Enter email address'
    },
    priority: {
      id: 'priority',
      label: 'Priority Level',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 4,
      width: 'third',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' }
      ]
    },
    category: {
      id: 'category',
      label: 'Category',
      fieldType: 'radio',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      width: 'two-thirds',
      options: [
        { label: 'Support', value: 'support' },
        { label: 'Sales', value: 'sales' },
        { label: 'Technical', value: 'technical' }
      ]
    },
    dueDate: {
      id: 'dueDate',
      label: 'Due Date',
      fieldType: 'date',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 6,
      width: 'third'
    },
    estimatedTime: {
      id: 'estimatedTime',
      label: 'Estimated Time',
      fieldType: 'time',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 7,
      width: 'third'
    },
    budget: {
      id: 'budget',
      label: 'Budget',
      fieldType: 'currency',
      value: 0,
      mandatory: false,
      visible: true,
      editable: true,
      order: 8,
      width: 'third'
    },
    searchTerm: {
      id: 'searchTerm',
      label: 'Search Keywords',
      fieldType: 'search',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 9,
      width: 'half',
      placeholder: 'Search for related items'
    },
    totalValue: {
      id: 'totalValue',
      label: 'Total Project Value',
      fieldType: 'card',
      value: '€ 15,250.00',
      mandatory: false,
      visible: true,
      editable: false,
      order: 10,
      width: 'half',
      color: '#3B82F6',
      fieldColour: '#1E40AF'
    }
  };

  // Mock user panel configuration persistence
  const mockGetUserPanelConfig = async (userId: string, panelId: string): Promise<PanelSettings> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return saved settings or default
    const saved = localStorage.getItem(`panel-config-${userId}-${panelId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      title: 'Customer Information Panel (RHF)',
      width: 'full',
      collapsible: false,
      showStatusIndicator: true,
      showHeader: true,
      fields: samplePanelConfig
    };
  };

  const mockSaveUserPanelConfig = async (userId: string, panelId: string, settings: PanelSettings): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Save to localStorage
    localStorage.setItem(`panel-config-${userId}-${panelId}`, JSON.stringify(settings));
    
    toast({
      title: "Configuration Saved",
      description: "Panel configuration has been saved successfully.",
    });
  };

  const handleDataChange = (data: Record<string, any>) => {
    setFormData(data);
    console.log('Form data changed:', data);
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', formData);
    toast({
      title: "Form Submitted",
      description: `Form data: ${JSON.stringify(formData, null, 2)}`,
    });
  };

  const handleReset = () => {
    setFormData({});
    toast({
      title: "Form Reset",
      description: "All form fields have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dynamic Panel RHF Demo
          </h1>
          <p className="text-gray-600">
            A demonstration of the DynamicPanelRHF component using react-hook-form for data binding
          </p>
        </div>

        {/* Panel Demo */}
        <div className="grid grid-cols-12 gap-6">
          <DynamicPanelRHF
            panelId="demo-panel-rhf"
            panelTitle="Customer Information Panel (RHF)"
            panelConfig={samplePanelConfig}
            initialData={{
              customer: 'John Doe',
              email: 'john.doe@example.com',
              priority: 'medium',
              budget: 5000
            }}
            onDataChange={handleDataChange}
            getUserPanelConfig={mockGetUserPanelConfig}
            saveUserPanelConfig={mockSaveUserPanelConfig}
            userId="demo-user"
            panelWidth="full"
            collapsible={false}
          />
        </div>

        {/* Form Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Form Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Submit Form
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Form Data Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Form Data (React Hook Form)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(formData, null, 2) || '{}'}
            </pre>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle>DynamicPanelRHF Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Core Features</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• React Hook Form integration</li>
                  <li>• Real-time form validation</li>
                  <li>• Optimized re-rendering</li>
                  <li>• All original DynamicPanel features</li>
                  <li>• Field visibility management</li>
                  <li>• Panel configuration persistence</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Field Types</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Text inputs with validation</li>
                  <li>• Textarea for long content</li>
                  <li>• Select dropdowns</li>
                  <li>• Radio button groups</li>
                  <li>• Date and time pickers</li>
                  <li>• Currency inputs</li>
                  <li>• Search fields</li>
                  <li>• Card display fields</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicPanelRHFDemo;