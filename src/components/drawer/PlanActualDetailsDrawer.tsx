import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SimpleDynamicPanel } from '@/components/DynamicPanel/SimpleDynamicPanel';
import { PanelFieldConfig } from '@/types/dynamicPanel';

interface PlanActualDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WagonItem {
  id: string;
  name: string;
  description: string;
  price: string;
  checked: boolean;
}

export const PlanActualDetailsDrawer: React.FC<PlanActualDetailsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [plannedData, setPlannedData] = useState({});
  const [actualsData, setActualsData] = useState({});

  const [selectedItems, setSelectedItems] = useState<WagonItem[]>([
    { id: 'WAG00000001', name: 'WAG00000001', description: 'Habbins', price: '€ 1395.00', checked: true },
    { id: 'WAG00000002', name: 'WAG00000002', description: 'Zaccs', price: '€ 1395.00', checked: false },
    { id: 'WAG00000003', name: 'WAG00000003', description: 'A Type Wagon', price: '€ 1395.00', checked: false },
    { id: 'WAG00000004', name: 'WAG00000004', description: 'Closed Wagon', price: '€ 1395.00', checked: false },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const toggleItemCheck = (id: string) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setSelectedItems(prev => prev.map(item => ({ ...item, checked: newValue })));
  };

  // Panel configurations for Planned tab (read-only display)
  const wagonPlannedConfig: PanelFieldConfig[] = [
    { fieldType: 'text', key: 'wagonType', label: 'Wagon Type', placeholder: 'Habbins' },
    { fieldType: 'text', key: 'wagonId', label: 'Wagon ID', placeholder: 'HAB3243' },
    { fieldType: 'text', key: 'wagonQuantity', label: 'Wagon Quantity', placeholder: '1 EA' },
    { fieldType: 'text', key: 'wagonTareWeight', label: 'Wagon Tare Weight', placeholder: '100 TON' },
    { fieldType: 'text', key: 'wagonGrossWeight', label: 'Wagon Gross Weight', placeholder: '100 TON' },
    { fieldType: 'text', key: 'wagonLength', label: 'Wagon Length', placeholder: '2139 M' },
    { fieldType: 'text', key: 'wagonSequence', label: 'Wagon Sequence', placeholder: '1A' },
  ];

  const containerPlannedConfig: PanelFieldConfig[] = [
    { fieldType: 'text', key: 'containerType', label: 'Container Type', placeholder: 'Container A' },
    { fieldType: 'text', key: 'containerId', label: 'Container ID', placeholder: 'CONT3243' },
    { fieldType: 'text', key: 'containerQuantity', label: 'Container Quantity', placeholder: '1 EA' },
    { fieldType: 'text', key: 'containerTareWeight', label: 'Container Tare Weight', placeholder: '100 TON' },
    { fieldType: 'text', key: 'containerLoadWeight', label: 'Container Load Weight', placeholder: '100 TON' },
  ];

  const productPlannedConfig: PanelFieldConfig[] = [
    { fieldType: 'text', key: 'hazardousGoods', label: 'Hazardous Goods', placeholder: 'Yes' },
    { fieldType: 'text', key: 'nhm', label: 'NHM', placeholder: '2WQ1E32R43' },
    { fieldType: 'text', key: 'productId', label: 'Product ID', placeholder: 'Wheat Muslin' },
    { fieldType: 'text', key: 'productQuantity', label: 'Product Quantity', placeholder: '100 TON' },
    { fieldType: 'text', key: 'classOfStores', label: 'Class of Stores', placeholder: 'Class A' },
    { fieldType: 'text', key: 'unCode', label: 'UN Code', placeholder: '2432' },
    { fieldType: 'text', key: 'dgClass', label: 'DG Class', placeholder: 'AAA' },
  ];

  const thuPlannedConfig: PanelFieldConfig[] = [
    { fieldType: 'text', key: 'thuId', label: 'THU ID', placeholder: 'THU329847' },
    { fieldType: 'text', key: 'thuQuantity', label: 'THU Quantity', placeholder: '5 EA' },
    { fieldType: 'text', key: 'thuTareWeight', label: 'THU Tare Weight', placeholder: '10 TON' },
    { fieldType: 'text', key: 'thuGrossWeight', label: 'THU Gross Weight', placeholder: '15 TON' },
  ];

  const journeyPlannedConfig: PanelFieldConfig[] = [
    { fieldType: 'text', key: 'departure', label: 'Departure', placeholder: 'Frankfurt Station Point A' },
    { fieldType: 'text', key: 'fromDateTime', label: 'From Date and Time', placeholder: '12-Mar-2025 08:00 AM' },
    { fieldType: 'text', key: 'arrival', label: 'Arrival', placeholder: 'Munich Station Point B' },
    { fieldType: 'text', key: 'toDateTime', label: 'To Date and Time', placeholder: '12-Mar-2025 06:00 PM' },
  ];

  const otherPlannedConfig: PanelFieldConfig[] = [
    { fieldType: 'textarea', key: 'remarks', label: 'Remarks', placeholder: 'Additional information' },
    { fieldType: 'text', key: 'referenceNumber', label: 'Reference Number', placeholder: 'REF123456' },
  ];

  // Panel configurations for Actuals tab (editable fields)
  const wagonActualsConfig: PanelFieldConfig[] = [
    { fieldType: 'select', key: 'wagonType', label: 'Wagon Type', options: [
      { label: 'Habbins', value: 'habbins' },
      { label: 'Zaccs', value: 'zaccs' },
      { label: 'A Type Wagon', value: 'a-type' },
    ]},
    { fieldType: 'search', key: 'wagonId', label: 'Wagon ID', placeholder: 'Search wagon...' },
    { fieldType: 'text', key: 'wagonQuantity', label: 'Wagon Quantity', placeholder: 'Enter quantity' },
    { fieldType: 'currency', key: 'wagonTareWeight', label: 'Wagon Tare Weight (TON)', placeholder: '0.00' },
    { fieldType: 'currency', key: 'wagonGrossWeight', label: 'Wagon Gross Weight (TON)', placeholder: '0.00' },
    { fieldType: 'text', key: 'wagonLength', label: 'Wagon Length (M)', placeholder: 'Enter length' },
    { fieldType: 'text', key: 'wagonSequence', label: 'Wagon Sequence', placeholder: 'Enter sequence' },
  ];

  const containerActualsConfig: PanelFieldConfig[] = [
    { fieldType: 'select', key: 'containerType', label: 'Container Type', options: [
      { label: 'Container A', value: 'container-a' },
      { label: 'Container B', value: 'container-b' },
      { label: 'Container C', value: 'container-c' },
    ]},
    { fieldType: 'search', key: 'containerId', label: 'Container ID', placeholder: 'Search container...' },
    { fieldType: 'text', key: 'containerQuantity', label: 'Container Quantity', placeholder: 'Enter quantity' },
    { fieldType: 'currency', key: 'containerTareWeight', label: 'Container Tare Weight (TON)', placeholder: '0.00' },
    { fieldType: 'currency', key: 'containerLoadWeight', label: 'Container Load Weight (TON)', placeholder: '0.00' },
  ];

  const productActualsConfig: PanelFieldConfig[] = [
    { fieldType: 'radio', key: 'hazardousGoods', label: 'Hazardous Goods', options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ]},
    { fieldType: 'search', key: 'nhm', label: 'NHM', placeholder: 'Search NHM code...' },
    { fieldType: 'search', key: 'productId', label: 'Product ID', placeholder: 'Search product...' },
    { fieldType: 'currency', key: 'productQuantity', label: 'Product Quantity (TON)', placeholder: '0.00' },
    { fieldType: 'select', key: 'classOfStores', label: 'Class of Stores', options: [
      { label: 'Class A', value: 'class-a' },
      { label: 'Class B', value: 'class-b' },
      { label: 'Class C', value: 'class-c' },
    ]},
    { fieldType: 'text', key: 'unCode', label: 'UN Code', placeholder: 'Enter UN code' },
    { fieldType: 'text', key: 'dgClass', label: 'DG Class', placeholder: 'Enter DG class' },
  ];

  const thuActualsConfig: PanelFieldConfig[] = [
    { fieldType: 'search', key: 'thuId', label: 'THU ID', placeholder: 'Search THU...' },
    { fieldType: 'text', key: 'thuQuantity', label: 'THU Quantity', placeholder: 'Enter quantity' },
    { fieldType: 'currency', key: 'thuTareWeight', label: 'THU Tare Weight (TON)', placeholder: '0.00' },
    { fieldType: 'currency', key: 'thuGrossWeight', label: 'THU Gross Weight (TON)', placeholder: '0.00' },
  ];

  const journeyActualsConfig: PanelFieldConfig[] = [
    { fieldType: 'search', key: 'departure', label: 'Departure', placeholder: 'Search departure point...' },
    { fieldType: 'date', key: 'fromDate', label: 'From Date', placeholder: 'Select date' },
    { fieldType: 'time', key: 'fromTime', label: 'From Time', placeholder: 'Select time' },
    { fieldType: 'search', key: 'arrival', label: 'Arrival', placeholder: 'Search arrival point...' },
    { fieldType: 'date', key: 'toDate', label: 'To Date', placeholder: 'Select date' },
    { fieldType: 'time', key: 'toTime', label: 'To Time', placeholder: 'Select time' },
  ];

  const otherActualsConfig: PanelFieldConfig[] = [
    { fieldType: 'textarea', key: 'remarks', label: 'Remarks', placeholder: 'Enter additional information...' },
    { fieldType: 'text', key: 'referenceNumber', label: 'Reference Number', placeholder: 'Enter reference number' },
  ];

  // Initial data for planned fields (read-only)
  const plannedInitialData = {
    wagonType: 'Habbins',
    wagonId: 'HAB3243',
    wagonQuantity: '1 EA',
    wagonTareWeight: '100 TON',
    wagonGrossWeight: '100 TON',
    wagonLength: '2139 M',
    wagonSequence: '1A',
    containerType: 'Container A',
    containerId: 'CONT3243',
    containerQuantity: '1 EA',
    containerTareWeight: '100 TON',
    containerLoadWeight: '100 TON',
    hazardousGoods: 'Yes',
    nhm: '2WQ1E32R43',
    productId: 'Wheat Muslin',
    productQuantity: '100 TON',
    classOfStores: 'Class A',
    unCode: '2432',
    dgClass: 'AAA',
    thuId: 'THU329847',
    thuQuantity: '5 EA',
    thuTareWeight: '10 TON',
    thuGrossWeight: '15 TON',
    departure: 'Frankfurt Station Point A',
    fromDateTime: '12-Mar-2025 08:00 AM',
    arrival: 'Munich Station Point B',
    toDateTime: '12-Mar-2025 06:00 PM',
    remarks: '',
    referenceNumber: 'REF123456',
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">Plan and Actual Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left Sidebar - Items List */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          {/* Select All */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={toggleSelectAll}
              />
              <Label htmlFor="select-all" className="font-medium cursor-pointer">
                All Item
              </Label>
              <div className="flex-1" />
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M9 3v18M15 3v18" />
                </svg>
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </Button>
              <Button size="icon" variant="default" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors cursor-pointer",
                  item.checked && "border-primary bg-accent"
                )}
              >
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItemCheck(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-blue-600">{item.name}</div>
                      <Button size="icon" variant="ghost" className="h-5 w-5 shrink-0">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
                    <div className="text-sm font-medium text-blue-600">{item.price}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <Button variant="outline" className="w-full h-12 border-dashed">
              --
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <Tabs defaultValue="actuals" className="flex-1 flex flex-col">
            <div className="border-b px-6 pt-4">
              <TabsList>
                <TabsTrigger value="planned">Planned</TabsTrigger>
                <TabsTrigger value="actuals">Actuals</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="planned" className="flex-1 m-0 overflow-y-auto p-6 space-y-4">
              <SimpleDynamicPanel
                title="Wagon Details"
                config={wagonPlannedConfig}
                initialData={plannedInitialData}
                onDataChange={(data) => setPlannedData({ ...plannedData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="Container Details"
                config={containerPlannedConfig}
                initialData={plannedInitialData}
                onDataChange={(data) => setPlannedData({ ...plannedData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="Product Details"
                config={productPlannedConfig}
                initialData={plannedInitialData}
                onDataChange={(data) => setPlannedData({ ...plannedData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="THU Details"
                config={thuPlannedConfig}
                initialData={plannedInitialData}
                onDataChange={(data) => setPlannedData({ ...plannedData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="Journey and Scheduling Details"
                config={journeyPlannedConfig}
                initialData={plannedInitialData}
                onDataChange={(data) => setPlannedData({ ...plannedData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="Other Details"
                config={otherPlannedConfig}
                initialData={plannedInitialData}
                onDataChange={(data) => setPlannedData({ ...plannedData, ...data })}
              />
            </TabsContent>

            <TabsContent value="actuals" className="flex-1 m-0 overflow-y-auto p-6 space-y-4">
              <SimpleDynamicPanel
                title="Wagon Details"
                config={wagonActualsConfig}
                onDataChange={(data) => setActualsData({ ...actualsData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="Container Details"
                config={containerActualsConfig}
                onDataChange={(data) => setActualsData({ ...actualsData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="Product Details"
                config={productActualsConfig}
                onDataChange={(data) => setActualsData({ ...actualsData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="THU Details"
                config={thuActualsConfig}
                onDataChange={(data) => setActualsData({ ...actualsData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="Journey and Scheduling Details"
                config={journeyActualsConfig}
                onDataChange={(data) => setActualsData({ ...actualsData, ...data })}
              />
              
              <SimpleDynamicPanel
                title="Other Details"
                config={otherActualsConfig}
                onDataChange={(data) => setActualsData({ ...actualsData, ...data })}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};
