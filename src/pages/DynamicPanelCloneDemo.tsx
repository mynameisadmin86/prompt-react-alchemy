import React from 'react';
import { DynamicPanelRHF } from '@/components/DynamicPanel/DynamicPanelRHF';
import { FieldConfig } from '@/types/dynamicPanel';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';

const DynamicPanelCloneDemo: React.FC = () => {
  const basicDetailsFields: FieldConfig[] = [
    {
      id: 'tripPlan',
      label: 'Trip Plan',
      fieldType: 'text',
      value: 'TR000000001',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'half',
      placeholder: 'Enter trip plan'
    },
    {
      id: 'customerName',
      label: 'Customer Name',
      fieldType: 'select',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 2,
      width: 'half',
      placeholder: 'Select...',
      options: [
        { label: 'Customer A', value: 'customer_a' },
        { label: 'Customer B', value: 'customer_b' },
        { label: 'Customer C', value: 'customer_c' }
      ]
    },
    {
      id: 'contractType',
      label: 'Contract Type',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3,
      width: 'half',
      placeholder: 'Select...',
      options: [
        { label: 'Fixed', value: 'fixed' },
        { label: 'Variable', value: 'variable' },
        { label: 'Hourly', value: 'hourly' }
      ]
    },
    {
      id: 'description',
      label: 'Description',
      fieldType: 'textarea',
      value: 'Here',
      mandatory: false,
      visible: true,
      editable: true,
      order: 4,
      width: 'full',
      placeholder: 'Enter description'
    },
    {
      id: 'priority',
      label: 'Priority',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      width: 'half',
      placeholder: 'Select...',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' }
      ]
    }
  ];

  const operationalDetailsFields: FieldConfig[] = [
    {
      id: 'plannedStartDate',
      label: 'Planned Start Date',
      fieldType: 'date',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'half',
      placeholder: 'dd/mm/yyyy'
    },
    {
      id: 'plannedStartTime',
      label: 'Planned Start Time',
      fieldType: 'time',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      width: 'half',
      placeholder: 'HH:mm'
    },
    {
      id: 'plannedEndDate',
      label: 'Planned End Date',
      fieldType: 'date',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3,
      width: 'half',
      placeholder: 'dd/mm/yyyy'
    },
    {
      id: 'plannedEndTime',
      label: 'Planned End Time',
      fieldType: 'time',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 4,
      width: 'half',
      placeholder: 'HH:mm'
    },
    {
      id: 'departurePoint',
      label: 'Departure Point',
      fieldType: 'search',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      width: 'half',
      placeholder: 'Search departure location...'
    },
    {
      id: 'arrivalPoint',
      label: 'Arrival Point',
      fieldType: 'search',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 6,
      width: 'half',
      placeholder: 'Search arrival location...'
    },
    {
      id: 'businessUnit',
      label: 'Business Unit',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 7,
      width: 'half',
      placeholder: 'Select...',
      options: [
        { label: 'Transport', value: 'transport' },
        { label: 'Logistics', value: 'logistics' },
        { label: 'Freight', value: 'freight' }
      ]
    },
    {
      id: 'taskType',
      label: 'Task Type',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 8,
      width: 'half',
      placeholder: 'Select...',
      options: [
        { label: 'Pickup', value: 'pickup' },
        { label: 'Delivery', value: 'delivery' },
        { label: 'Transfer', value: 'transfer' }
      ]
    }
  ];

  const billingDetailsFields: FieldConfig[] = [
    {
      id: 'costAmount',
      label: 'Cost Amount',
      fieldType: 'currency',
      value: '0.00',
      mandatory: false,
      visible: true,
      editable: true,
      order: 1,
      width: 'half',
      placeholder: '0.00'
    },
    {
      id: 'taxAmount',
      label: 'Tax Amount',
      fieldType: 'currency',
      value: '0.00',
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      width: 'half',
      placeholder: '0.00'
    },
    {
      id: 'discountAmount',
      label: 'Discount Amount',
      fieldType: 'currency',
      value: '0.00',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3,
      width: 'half',
      placeholder: '0.00'
    },
    {
      id: 'billingStatus',
      label: 'Billing Status',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 4,
      width: 'half',
      placeholder: 'Select...',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processed', value: 'processed' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' }
      ]
    },
    {
      id: 'paymentTerms',
      label: 'Payment Terms',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      width: 'half',
      placeholder: 'Select...',
      options: [
        { label: 'Net 30', value: 'net_30' },
        { label: 'Net 60', value: 'net_60' },
        { label: 'Due on Receipt', value: 'due_on_receipt' }
      ]
    },
    {
      id: 'invoiceDate',
      label: 'Invoice Date',
      fieldType: 'date',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 6,
      width: 'half',
      placeholder: 'dd/mm/yyyy'
    }
  ];

  const methods = useForm({
    defaultValues: {
      tripPlan: 'TR000000001',
      customerName: '',
      contractType: '',
      description: 'Here',
      priority: '',
      plannedStartDate: '',
      plannedStartTime: '',
      plannedEndDate: '',
      plannedEndTime: '',
      departurePoint: '',
      arrivalPoint: '',
      businessUnit: '',
      taskType: '',
      costAmount: '0.00',
      taxAmount: '0.00',
      discountAmount: '0.00',
      billingStatus: '',
      paymentTerms: '',
      invoiceDate: ''
    }
  });

  const { handleSubmit, watch } = methods;
  const formData = watch();

  const onSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dynamic Panel Configuration
          </h1>
          <p className="text-gray-600">
            Configure field visibility, ordering, and labels for each panel
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Basic Details Panel */}
              <DynamicPanelRHF
                panelId="basic-details"
                panelTitle="Basic Details"
                fields={basicDetailsFields}
                defaultValues={{
                  tripPlan: 'TR000000001',
                  customerName: '',
                  contractType: '',
                  description: 'Here',
                  priority: ''
                }}
              />

              {/* Operational Details Panel */}
              <DynamicPanelRHF
                panelId="operational-details"
                panelTitle="Operational Details"
                fields={operationalDetailsFields}
                defaultValues={{
                  plannedStartDate: '',
                  plannedStartTime: '',
                  plannedEndDate: '',
                  plannedEndTime: '',
                  departurePoint: '',
                  arrivalPoint: '',
                  businessUnit: '',
                  taskType: ''
                }}
              />

              {/* Billing Details Panel */}
              <DynamicPanelRHF
                panelId="billing-details"
                panelTitle="Billing Details"
                fields={billingDetailsFields}
                defaultValues={{
                  costAmount: '0.00',
                  taxAmount: '0.00',
                  discountAmount: '0.00',
                  billingStatus: '',
                  paymentTerms: '',
                  invoiceDate: ''
                }}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Configuration
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => methods.reset()}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </FormProvider>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Current Form Values (Live)</h3>
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DynamicPanelCloneDemo;