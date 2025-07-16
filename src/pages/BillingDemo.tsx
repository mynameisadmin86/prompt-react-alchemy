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

  const [snippetsData, setSnippetsData] = useState({
    contractPriceSnippet: {
      label: 'Contract Price',
      amount: '€ 1200.00'
    },
    netAmountSnippet: {
      label: 'Net Amount',
      amount: '€ 5580.00'
    }
  });

  const billingPanelConfig: PanelConfig = {
    titleCard: {
      id: 'titleCard',
      label: '',
      fieldType: 'card',
      value: 'Billing Details',
      mandatory: false,
      visible: true,
      editable: true,
      order: 0,
      width: 'half',
      cardConfig: {
        variant: 'outline',
        size: 'md',
        editable: true
      },
      placeholder: 'Panel Title'
    },
    referenceCard: {
      id: 'referenceCard',
      label: '',
      fieldType: 'card',
      value: 'DB00023/42',
      mandatory: false,
      visible: true,
      editable: true,
      order: 0.5,
      width: 'half',
      cardConfig: {
        variant: 'secondary',
        size: 'md',
        editable: true
      },
      placeholder: 'Reference ID'
    },
    contractPriceCard: {
      id: 'contractPriceCard',
      label: '',
      fieldType: 'card',
      value: {
        label: 'Contract Price',
        amount: '€ 1200.00'
      },
      mandatory: false,
      visible: true,
      editable: true,
      order: 1,
      width: 'half',
      cardConfig: {
        color: 'bg-emerald-50',
        editable: true
      }
    },
    netAmountCard: {
      id: 'netAmountCard',
      label: '',
      fieldType: 'card',
      value: {
        label: 'Net Amount',
        amount: '€ 5580.00'
      },
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      width: 'half',
      cardConfig: {
        color: 'bg-blue-50',
        editable: true
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
      order: 3,
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
      order: 4,
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
      order: 5,
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
      order: 6,
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
      order: 7,
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
      order: 8,
      width: 'full',
      placeholder: 'Enter Remarks'
    }
  };

  // Snippets panel configuration
  const snippetsPanelConfig: PanelConfig = {
    contractPriceSnippet: {
      id: 'contractPriceSnippet',
      label: '',
      fieldType: 'card',
      value: {
        label: 'Contract Price',
        amount: '€ 1200.00'
      },
      mandatory: false,
      visible: true,
      editable: true,
      order: 1,
      width: 'half',
      cardConfig: {
        color: 'bg-emerald-50',
        editable: true
      }
    },
    netAmountSnippet: {
      id: 'netAmountSnippet',
      label: '',
      fieldType: 'card',
      value: {
        label: 'Net Amount',
        amount: '€ 5580.00'
      },
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      width: 'half',
      cardConfig: {
        color: 'bg-blue-50',
        editable: true
      }
    }
  };

  const handleBillingDataChange = (updatedData: Record<string, any>) => {
    setBillingData(prev => ({ ...prev, ...updatedData }));
  };

  const handleSnippetsDataChange = (updatedData: Record<string, any>) => {
    setSnippetsData(prev => ({ ...prev, ...updatedData }));
  };

  // Mock functions for user configuration - billing panel
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

  // Mock functions for snippets panel
  const getUserSnippetsConfig = async (userId: string, panelId: string): Promise<PanelSettings> => {
    const stored = localStorage.getItem(`snippets_${userId}_${panelId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      title: 'Snippets',
      width: 'full',
      collapsible: true,
      showStatusIndicator: false,
      showHeader: true,
      fields: snippetsPanelConfig
    };
  };

  const saveUserSnippetsConfig = async (userId: string, panelId: string, settings: PanelSettings) => {
    localStorage.setItem(`snippets_${userId}_${panelId}`, JSON.stringify(settings));
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

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Billing Demo</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Snippets Panel */}
            <DynamicPanel
              panelId="snippets-panel"
              panelTitle="Snippets"
              panelConfig={snippetsPanelConfig}
              initialData={snippetsData}
              onDataChange={handleSnippetsDataChange}
              getUserPanelConfig={getUserSnippetsConfig}
              saveUserPanelConfig={saveUserSnippetsConfig}
              userId="demo-user"
              panelWidth="full"
              collapsible={true}
            />

            {/* Main Billing Panel */}
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
              <CardTitle className="text-lg">Snippets Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                {JSON.stringify(snippetsData, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing Data</CardTitle>
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