import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DynamicPanelRHF } from '@/components/DynamicPanelRHF';
import { PanelConfig, PanelSettings } from '@/types/dynamicPanel';

const DynamicPanelConfiguration: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Mock user panel configurations storage
  const [userConfigs, setUserConfigs] = useState<Record<string, PanelSettings>>({});

  // Mock functions for config persistence
  const getUserPanelConfig = async (userId: string, panelId: string): Promise<PanelSettings | null> => {
    const key = `${userId}-${panelId}`;
    return userConfigs[key] || null;
  };

  const saveUserPanelConfig = async (userId: string, panelId: string, settings: PanelSettings): Promise<void> => {
    const key = `${userId}-${panelId}`;
    setUserConfigs(prev => ({
      ...prev,
      [key]: settings
    }));
  };

  // Basic Details Panel Configuration
  const basicDetailsConfig: PanelConfig = {
    tripPlanNo: {
      id: 'tripPlanNo',
      label: 'Trip Plan No *',
      fieldType: 'text',
      value: 'TR000000001',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'full'
    },
    customerName: {
      id: 'customerName',
      label: 'Customer Name *',
      fieldType: 'search',
      value: 'Attribute 2',
      mandatory: true,
      visible: true,
      editable: true,
      order: 2,
      width: 'full',
      placeholder: 'Search...'
    },
    contractType: {
      id: 'contractType',
      label: 'Contract Type',
      fieldType: 'select',
      value: 'Attribute 3',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3,
      width: 'full',
      options: [
        { label: 'Select...', value: '' },
        { label: 'Attribute 3', value: 'attribute3' },
        { label: 'Other Contract', value: 'other' }
      ]
    },
    description: {
      id: 'description',
      label: 'Description',
      fieldType: 'textarea',
      value: 'Hold',
      mandatory: false,
      visible: true,
      editable: true,
      order: 4,
      width: 'full'
    },
    priority: {
      id: 'priority',
      label: 'Priority',
      fieldType: 'select',
      value: 'Attribute 4',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      width: 'full',
      options: [
        { label: 'Select...', value: '' },
        { label: 'Attribute 4', value: 'attribute4' },
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' }
      ]
    }
  };

  // Operational Details Panel Configuration
  const operationalDetailsConfig: PanelConfig = {
    plannedStartDate: {
      id: 'plannedStartDate',
      label: 'Planned Start Date *',
      fieldType: 'date',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'half'
    },
    plannedStartTime: {
      id: 'plannedStartTime',
      label: 'Planned Start Time *',
      fieldType: 'time',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 2,
      width: 'half'
    },
    plannedEndDate: {
      id: 'plannedEndDate',
      label: 'Planned End Date *',
      fieldType: 'date',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 3,
      width: 'half'
    },
    plannedEndTime: {
      id: 'plannedEndTime',
      label: 'Planned End Time *',
      fieldType: 'time',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 4,
      width: 'half'
    },
    quoteDepartureLocation: {
      id: 'quoteDepartureLocation',
      label: 'Quote Departure Location',
      fieldType: 'search',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      width: 'full',
      placeholder: 'Search departure location...'
    },
    arrivalPoint: {
      id: 'arrivalPoint',
      label: 'Arrival Point *',
      fieldType: 'search',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 6,
      width: 'full',
      placeholder: 'Search arrival point...'
    },
    businessUnit: {
      id: 'businessUnit',
      label: 'Business Unit',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 7,
      width: 'full',
      options: [
        { label: 'Select...', value: '' },
        { label: 'Unit A', value: 'unit-a' },
        { label: 'Unit B', value: 'unit-b' }
      ]
    },
    taskType: {
      id: 'taskType',
      label: 'Task Type',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 8,
      width: 'full',
      options: [
        { label: 'Select...', value: '' },
        { label: 'Type 1', value: 'type1' },
        { label: 'Type 2', value: 'type2' }
      ]
    }
  };

  // Billing Details Panel Configuration
  const billingDetailsConfig: PanelConfig = {
    tripAmount: {
      id: 'tripAmount',
      label: 'Trip Amount *',
      fieldType: 'currency',
      value: '0.00',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'full'
    },
    taxAmount: {
      id: 'taxAmount',
      label: 'Tax Amount',
      fieldType: 'currency',
      value: '0.00',
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      width: 'full'
    },
    discountAmount: {
      id: 'discountAmount',
      label: 'Discount Amount',
      fieldType: 'currency',
      value: '0.00',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3,
      width: 'full'
    },
    billingStatus: {
      id: 'billingStatus',
      label: 'Billing Status *',
      fieldType: 'select',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 4,
      width: 'full',
      options: [
        { label: 'Select...', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' }
      ]
    },
    paymentTerms: {
      id: 'paymentTerms',
      label: 'Payment Terms',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      width: 'full',
      options: [
        { label: 'Select...', value: '' },
        { label: 'Net 30', value: 'net30' },
        { label: 'Net 60', value: 'net60' },
        { label: 'Due on Receipt', value: 'due-on-receipt' }
      ]
    },
    invoiceDate: {
      id: 'invoiceDate',
      label: 'Invoice Date',
      fieldType: 'date',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 6,
      width: 'full'
    }
  };

  const handleDataChange = (panelId: string) => (data: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      [panelId]: data
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    alert('Form submitted successfully! Check console for data.');
  };

  const handleReset = () => {
    setFormData({});
    // You might want to trigger a reset on the panels as well
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dynamic Panel Configuration</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure field visibility, ordering, and labels for each panel
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleReset}>
                Reset Form
              </Button>
              <Button onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="outline">
                Manage Panels
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Basic Details and Operational Details */}
          <div className="col-span-8 space-y-6">
            {/* Basic Details Panel */}
            <DynamicPanelRHF
              panelId="basic-details"
              panelTitle="Basic Details"
              panelConfig={basicDetailsConfig}
              initialData={formData['basic-details'] || {}}
              onDataChange={handleDataChange('basic-details')}
              getUserPanelConfig={getUserPanelConfig}
              saveUserPanelConfig={saveUserPanelConfig}
              userId="user-1"
              panelWidth="full"
              collapsible={false}
            />

            {/* Operational Details Panel */}
            <DynamicPanelRHF
              panelId="operational-details"
              panelTitle="Operational Details"
              panelConfig={operationalDetailsConfig}
              initialData={formData['operational-details'] || {}}
              onDataChange={handleDataChange('operational-details')}
              getUserPanelConfig={getUserPanelConfig}
              saveUserPanelConfig={saveUserPanelConfig}
              userId="user-1"
              panelWidth="full"
              collapsible={false}
            />
          </div>

          {/* Right Column - Billing Details */}
          <div className="col-span-4">
            <DynamicPanelRHF
              panelId="billing-details"
              panelTitle="Billing Details"
              panelConfig={billingDetailsConfig}
              initialData={formData['billing-details'] || {}}
              onDataChange={handleDataChange('billing-details')}
              getUserPanelConfig={getUserPanelConfig}
              saveUserPanelConfig={saveUserPanelConfig}
              userId="user-1"
              panelWidth="full"
              collapsible={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPanelConfiguration;