import React, { useState } from 'react';
import { SimpleDynamicPanel } from '@/components/DynamicPanel/SimpleDynamicPanel';
import { PanelFieldConfig } from '@/types/dynamicPanel';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SimpleDynamicPanelDemo = () => {
  const [formData, setFormData] = useState({});

  const panelConfig: PanelFieldConfig[] = [
    {
      fieldType: 'text',
      key: 'tripNumber',
      label: 'Trip Number',
      placeholder: 'Enter trip number...',
      onChange: (value) => console.log('Trip Number changed:', value)
    },
    {
      fieldType: 'lazyselect',
      key: 'customer',
      label: 'Customer',
      fetchOptions: async ({ searchTerm, offset, limit }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock customer data
        const allCustomers = [
          { label: 'DB Cargo AG', value: 'db-cargo-ag' },
          { label: 'ABC Rail Goods Ltd', value: 'abc-rail-ltd' },
          { label: 'Wave Cargo Solutions', value: 'wave-cargo-sol' },
          { label: 'European Transport Co', value: 'european-transport' },
          { label: 'Global Freight Systems', value: 'global-freight' },
          { label: 'Metro Rail Services', value: 'metro-rail' },
          { label: 'Continental Logistics', value: 'continental-log' },
          { label: 'Express Railway Corp', value: 'express-railway' },
          { label: 'Prime Shipping Inc', value: 'prime-shipping' },
          { label: 'United Cargo Group', value: 'united-cargo' },
          { label: 'Swift Transport Ltd', value: 'swift-transport' },
          { label: 'Rapid Rail Solutions', value: 'rapid-rail' },
        ];
        
        // Filter by search term
        const filtered = searchTerm 
          ? allCustomers.filter(customer => 
              customer.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : allCustomers;
        
        // Paginate results
        const results = filtered.slice(offset, offset + limit);
        
        return results;
      },
      onChange: (selected) => console.log('Customer changed:', selected),
      onClick: () => console.log('Customer dropdown clicked')
    },
    {
      fieldType: 'select',
      key: 'priority',
      label: 'Priority',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' }
      ],
      onChange: (value) => console.log('Priority changed:', value)
    },
    {
      fieldType: 'date',
      key: 'startDate',
      label: 'Start Date',
      onChange: (value) => console.log('Start Date changed:', value)
    },
    {
      fieldType: 'time',
      key: 'startTime',
      label: 'Start Time',
      onChange: (value) => console.log('Start Time changed:', value)
    },
    {
      fieldType: 'currency',
      key: 'totalAmount',
      label: 'Total Amount',
      placeholder: '0.00',
      onChange: (value) => console.log('Total Amount changed:', value)
    },
    {
      fieldType: 'search',
      key: 'location',
      label: 'Location',
      placeholder: 'Search location...',
      onChange: (value) => console.log('Location search:', value)
    },
    {
      fieldType: 'textarea',
      key: 'description',
      label: 'Description',
      placeholder: 'Enter description...',
      onChange: (value) => console.log('Description changed:', value)
    },
    {
      fieldType: 'radio',
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ],
      onChange: (value) => console.log('Status changed:', value)
    },
    {
      fieldType: 'inputdropdown',
      key: 'quantity',
      label: 'Quantity',
      placeholder: 'Enter value',
      options: [
        { label: 'KG', value: 'kg' },
        { label: 'TON', value: 'ton' },
        { label: 'LBS', value: 'lbs' }
      ],
      onChange: (value) => console.log('Quantity changed:', value)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-600">
                Simple Dynamic Panel Demo
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Simple Dynamic Panel Demo</h1>
          <p className="text-gray-600 mt-1">
            Simplified configuration using PanelFieldConfig[] array format
          </p>
        </div>

        {/* Demo Panel */}
        <SimpleDynamicPanel
          title="Trip Planning Form"
          config={panelConfig}
          onDataChange={(data) => {
            setFormData(data);
            console.log('Form data updated:', data);
          }}
          className="max-w-4xl"
        />

        {/* Debug Data Display */}
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl">
          <h3 className="text-lg font-semibold mb-4">Current Form Data</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

        {/* Usage Example */}
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl">
          <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto whitespace-pre-wrap">
{`const panelConfig: PanelFieldConfig[] = [
  {
    fieldType: 'text',
    key: 'tripNumber',
    label: 'Trip Number'
  },
  {
    fieldType: 'lazyselect',
    key: 'customer',
    label: 'Customer',
    fetchOptions: async ({ searchTerm, offset, limit }) => {
      const res = await fetch(
        \`/api/customers?search=\${searchTerm}&offset=\${offset}&limit=\${limit}\`
      );
      const data = await res.json();
      return data.items.map((item: any) => ({
        label: item.customerName,
        value: item.customerId
      }));
    },
    onChange: (val) => console.log('Customer changed:', val),
    onClick: () => console.log('Customer dropdown clicked')
  }
];

<SimpleDynamicPanel
  title="Trip Planning Form"
  config={panelConfig}
  onDataChange={(data) => console.log('Form data:', data)}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SimpleDynamicPanelDemo;