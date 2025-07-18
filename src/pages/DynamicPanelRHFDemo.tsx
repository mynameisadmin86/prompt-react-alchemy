import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DynamicPanelRHF } from '@/components/DynamicPanel/DynamicPanelRHF';
import { PanelConfig } from '@/types/dynamicPanel';

const DynamicPanelRHFDemo = () => {
  const [formData, setFormData] = useState({});

  // Master form that controls all panels
  const masterForm = useForm({
    defaultValues: {
      panel1: {},
      panel2: {},
      panel3: {}
    },
    mode: 'onChange'
  });

  const { watch, handleSubmit } = masterForm;
  const watchedData = watch();

  // Sample panel configurations
  const panel1Config: PanelConfig = {
    customerName: {
      id: 'customerName',
      label: 'Customer Name',
      fieldType: 'select',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 0,
      options: [
        { label: 'DB Cargo', value: 'db-cargo' },
        { label: 'ABC Rail Goods', value: 'abc-rail' },
        { label: 'Wave Cargo', value: 'wave-cargo' }
      ],
      width: 'half'
    },
    description: {
      id: 'description',
      label: 'Description',
      fieldType: 'textarea',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 1,
      placeholder: 'Enter trip description...',
      width: 'half'
    },
    tripPlanNo: {
      id: 'tripPlanNo',
      label: 'Trip Plan No',
      fieldType: 'text',
      value: 'TRIP00000001',
      mandatory: true,
      visible: true,
      editable: false,
      order: 2,
      width: 'half'
    },
    priority: {
      id: 'priority',
      label: 'Priority',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3,
      options: [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' }
      ],
      width: 'half'
    }
  };

  const panel2Config: PanelConfig = {
    originCity: {
      id: 'originCity',
      label: 'Origin City',
      fieldType: 'text',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 0,
      width: 'half'
    },
    destinationCity: {
      id: 'destinationCity',
      label: 'Destination City',
      fieldType: 'text',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'half'
    },
    departureDate: {
      id: 'departureDate',
      label: 'Departure Date',
      fieldType: 'date',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 2,
      width: 'half'
    },
    arrivalDate: {
      id: 'arrivalDate',
      label: 'Arrival Date',
      fieldType: 'date',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 3,
      width: 'half'
    }
  };

  const panel3Config: PanelConfig = {
    cargoType: {
      id: 'cargoType',
      label: 'Cargo Type',
      fieldType: 'select',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 0,
      options: [
        { label: 'Container', value: 'container' },
        { label: 'Bulk', value: 'bulk' },
        { label: 'Liquid', value: 'liquid' }
      ],
      width: 'half'
    },
    weight: {
      id: 'weight',
      label: 'Weight (kg)',
      fieldType: 'text',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      width: 'half'
    },
    specialInstructions: {
      id: 'specialInstructions',
      label: 'Special Instructions',
      fieldType: 'textarea',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      placeholder: 'Enter any special handling instructions...',
      width: 'full'
    }
  };

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setFormData(data);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dynamic Panel RHF Demo</h1>
        <p className="text-gray-600">
          Demonstration of DynamicPanelRHF component using pure react-hook-form data binding
        </p>
      </div>

      <FormProvider {...masterForm}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <DynamicPanelRHF
              panelId="trip-details"
              panelOrder={1}
              startingTabIndex={1}
              panelTitle="Trip Details"
              panelConfig={panel1Config}
              initialData={{}}
              panelWidth="full"
              collapsible={false}
              showPreview={false}
            />

            <DynamicPanelRHF
              panelId="route-info"
              panelOrder={2}
              startingTabIndex={10}
              panelTitle="Route Information"
              panelConfig={panel2Config}
              initialData={{}}
              panelWidth="half"
              collapsible={true}
              showPreview={false}
            />

            <DynamicPanelRHF
              panelId="cargo-details"
              panelOrder={3}
              startingTabIndex={20}
              panelTitle="Cargo Details"
              panelConfig={panel3Config}
              initialData={{}}
              panelWidth="half"
              collapsible={true}
              showPreview={false}
            />
          </div>

          <div className="flex gap-4 justify-center">
            <Button type="submit" className="min-w-32">
              Submit Form
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => masterForm.reset()}
              className="min-w-32"
            >
              Reset Form
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Debug section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Form Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(watchedData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submitted Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicPanelRHFDemo;