import React from 'react';
import { DynamicPanelRHF } from '@/components/DynamicPanel/DynamicPanelRHF';
import { FieldConfig } from '@/types/dynamicPanel';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';

const DynamicPanelRHFDemo: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      id: 'customer',
      label: 'Customer',
      fieldType: 'text',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'half',
      placeholder: 'Enter customer name'
    },
    {
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
    }
  ];

  const methods = useForm({
    defaultValues: {
      customer: '',
      description: ''
    }
  });

  const { handleSubmit, watch } = methods;

  const formData = watch();

  const onSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    alert(`Form Data:\nCustomer: ${data.customer}\nDescription: ${data.description}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dynamic Panel with React Hook Form Demo
          </h1>
          <p className="text-gray-600">
            This demo shows a dynamic panel component that uses react-hook-form for data binding.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <DynamicPanelRHF
                panelId="customer-panel"
                panelTitle="Customer Information"
                fields={fields}
                defaultValues={{
                  customer: '',
                  description: ''
                }}
                onSubmit={onSubmit}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Submit Form
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => methods.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </FormProvider>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Current Form Values (Live)</h3>
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DynamicPanelRHFDemo;