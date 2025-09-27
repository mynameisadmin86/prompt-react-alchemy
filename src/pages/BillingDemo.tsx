import React, { useState } from 'react';
import { DynamicPanel } from '@/components/DynamicPanel/DynamicPanel';
import { PanelConfig } from '@/types/dynamicPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillingDemo = () => {
  const navigate = useNavigate();

  const [snippetPanelConfig, setSnippetPanelConfig] = useState<PanelConfig>({
    billingType: {
      id: 'billingType',
      label: 'Billing Type',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 1,
      width: 'full',
      options: [
        { value: 'standard', label: 'Standard Billing' },
        { value: 'premium', label: 'Premium Billing' },
        { value: 'enterprise', label: 'Enterprise Billing' }
      ],
      events: {
        onChange: (value: string) => {
          handleBillingTypeChange(value);
        }
      }
    },
    contractPrice: {
      id: 'contractPrice',
      label: 'Contract Price',
      fieldType: 'card',
      value: '€ 1200.00',
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      width: 'half',
      color: '#10b981', // Emerald green background
      fieldColour: '#047857' // Dark emerald text
    },
    netAmount: {
      id: 'netAmount',
      label: 'Net Amount',
      fieldType: 'card',
      value: '€ 5580.00',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3,
      width: 'half',
      color: '#8b5cf6', // Purple background
      fieldColour: '#6d28d9' // Dark purple text
    }
  });

  const handleBillingTypeChange = (billingType: string) => {
    console.log('Billing type changed to:', billingType);
    let contractPrice = '€ 1200.00';
    let netAmount = '€ 5580.00';
    let contractColor = '#10b981';
    let contractTextColor = '#047857';
    let netColor = '#8b5cf6';
    let netTextColor = '#6d28d9';

    switch (billingType) {
      case 'standard':
        contractPrice = '€ 1000.00';
        netAmount = '€ 3720.00';
        contractColor = '#10b981';
        contractTextColor = '#047857';
        netColor = '#8b5cf6';
        netTextColor = '#6d28d9';
        break;
      case 'premium':
        contractPrice = '€ 2000.00';
        netAmount = '€ 6975.00';
        contractColor = '#f59e0b';
        contractTextColor = '#d97706';
        netColor = '#ef4444';
        netTextColor = '#dc2626';
        break;
      case 'enterprise':
        contractPrice = '€ 3000.00';
        netAmount = '€ 11625.00';
        contractColor = '#6366f1';
        contractTextColor = '#4f46e5';
        netColor = '#ec4899';
        netTextColor = '#db2777';
        break;
      default:
        break;
    }

    console.log('Updating prices:', { contractPrice, netAmount });
    setSnippetPanelConfig(prev => {
      const newConfig = {
        ...prev,
        contractPrice: {
          ...prev.contractPrice,
          value: contractPrice,
          color: contractColor,
          fieldColour: contractTextColor
        },
        netAmount: {
          ...prev.netAmount,
          value: netAmount,
          color: netColor,
          fieldColour: netTextColor
        }
      };
      console.log('New snippet config:', newConfig);
      return newConfig;
    });
  };

  const controlPanelConfig: PanelConfig = {
    description: {
      id: 'description',
      label: 'Description',
      fieldType: 'text',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 1,
      width: 'half'
    },
    notes: {
      id: 'notes',
      label: 'Notes',
      fieldType: 'text',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 2,
      width: 'half'
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Billing Demo</h1>
        </div>

        <div className="space-y-6">
          <DynamicPanel
            panelId="billing-control"
            panelOrder={1}
            panelTitle="Billing Configuration"
            panelConfig={controlPanelConfig}
            panelWidth="full"
            showPreview={false}
          />
          
          <DynamicPanel
            key={`billing-snippets-${JSON.stringify(snippetPanelConfig)}`}
            panelId="billing-snippets"
            panelOrder={2}
            panelTitle="Financial Snippets"
            panelConfig={snippetPanelConfig}
            panelWidth="full"
            showPreview={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingDemo;