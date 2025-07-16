import React, { useState } from 'react';
import { DynamicPanel } from '@/components/DynamicPanel/DynamicPanel';
import { PanelConfig, PanelSettings } from '@/types/dynamicPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const BillingDemo = () => {
  const [billingData, setBillingData] = useState({
    contractPrice: { main: '€ 1200.00', sub: '' },
    netAmount: { main: '€ 5580.00', sub: '' },
    billingType: 'Wagon',
    unitPrice: 1395.00,
    billingQty: 4,
    tariff: 'TAR000750 - Tariff Description',
    tariffType: 'Rate Per Block Train',
    remarks: ''
  });

  const billingPanelConfig: PanelConfig = {
    summary: {
      id: 'summary',
      label: 'Price Summary',
      fieldType: 'summary-card',
      value: {
        main: '€ 1200.00',
        sub: '€ 5580.00'
      },
      mandatory: false,
      visible: true,
      editable: false,
      order: 1,
      width: 'full',
      summaryConfig: {
        mainLabel: 'Contract Price',
        subLabel: 'Net Amount',
        backgroundColor: 'bg-gradient-to-r from-emerald-50 to-blue-50'
      }
    },
    billingType: {
      id: 'billingType',
      label: 'Billing Type',
      fieldType: 'dropdown-with-search',
      value: 'Wagon',
      mandatory: true,
      visible: true,
      editable: true,
      order: 2,
      width: 'full',
      options: [
        { label: 'Wagon', value: 'Wagon' },
        { label: 'Container', value: 'Container' },
        { label: 'Bulk', value: 'Bulk' },
        { label: 'Express', value: 'Express' }
      ],
      placeholder: 'Select billing type'
    },
    unitPrice: {
      id: 'unitPrice',
      label: 'Unit Price',
      fieldType: 'currency-with-select',
      value: 1395.00,
      mandatory: true,
      visible: true,
      editable: true,
      order: 3,
      width: 'half',
      currencySymbol: '€',
      step: 0.01,
      placeholder: '0.00'
    },
    billingQty: {
      id: 'billingQty',
      label: 'Billing Qty.',
      fieldType: 'number',
      value: 4,
      mandatory: true,
      visible: true,
      editable: true,
      order: 4,
      width: 'half',
      min: 1,
      step: 1,
      placeholder: 'Enter quantity'
    },
    tariff: {
      id: 'tariff',
      label: 'Tariff',
      fieldType: 'search-with-icon',
      value: 'TAR000750 - Tariff Description',
      mandatory: true,
      visible: true,
      editable: true,
      order: 5,
      width: 'full',
      placeholder: 'Search tariff code'
    },
    tariffType: {
      id: 'tariffType',
      label: 'Tariff Type',
      fieldType: 'dropdown-with-search',
      value: 'Rate Per Block Train',
      mandatory: true,
      visible: true,
      editable: true,
      order: 6,
      width: 'full',
      options: [
        { label: 'Rate Per Block Train', value: 'Rate Per Block Train' },
        { label: 'Rate Per Wagon', value: 'Rate Per Wagon' },
        { label: 'Rate Per Container', value: 'Rate Per Container' },
        { label: 'Fixed Rate', value: 'Fixed Rate' }
      ],
      placeholder: 'Select tariff type'
    },
    remarks: {
      id: 'remarks',
      label: 'Remarks',
      fieldType: 'textarea',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 7,
      width: 'full',
      placeholder: 'Enter Remarks'
    }
  };

  const handleBillingDataChange = (updatedData: Record<string, any>) => {
    setBillingData(prev => ({ ...prev, ...updatedData }));
  };

  // Mock functions for user configuration
  const getUserPanelConfig = async (userId: string, panelId: string): Promise<PanelSettings> => {
    const stored = localStorage.getItem(`panel_${userId}_${panelId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      title: 'Billing Details',
      width: 'full',
      collapsible: false,
      showStatusIndicator: true,
      showHeader: true,
      fields: billingPanelConfig
    };
  };

  const saveUserPanelConfig = async (userId: string, panelId: string, settings: PanelSettings) => {
    localStorage.setItem(`panel_${userId}_${panelId}`, JSON.stringify(settings));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Billing Demo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Billing Demo</h1>
          <div className="text-sm text-muted-foreground font-mono">
            DB00023/42
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DynamicPanel
            panelId="billing-panel"
            panelTitle="Billing Details"
            panelConfig={billingPanelConfig}
            initialData={billingData}
            onDataChange={handleBillingDataChange}
            getUserPanelConfig={getUserPanelConfig}
            saveUserPanelConfig={saveUserPanelConfig}
            userId="demo-user"
            panelWidth="full"
            collapsible={false}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Unit Price:</span>
                <span className="font-medium">€ {billingData.unitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Quantity:</span>
                <span className="font-medium">{billingData.billingQty}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Subtotal:</span>
                <span className="font-medium">€ {(billingData.unitPrice * billingData.billingQty).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 pt-4 border-t-2">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-lg">€ {(billingData.unitPrice * billingData.billingQty).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Values</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                {JSON.stringify(billingData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillingDemo;