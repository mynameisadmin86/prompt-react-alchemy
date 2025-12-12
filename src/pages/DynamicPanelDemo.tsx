import React, { useState, useCallback, useRef } from 'react';
import { DynamicPanel, DynamicPanelRef } from '@/components/DynamicPanel';
import { PanelVisibilityManager } from '@/components/DynamicPanel/PanelVisibilityManager';
import { PanelConfig, PanelSettings } from '@/types/dynamicPanel';
import { EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { DynamicTabs, DynamicTab } from '@/components/ui/dynamic-tabs';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DynamicPanelDemo = () => {
  const [basicDetailsData, setBasicDetailsData] = useState({});
  const [operationalDetailsData, setOperationalDetailsData] = useState({});
  const [billingDetailsData, setBillingDetailsData] = useState({});

  // Panel refs for validation
  const basicDetailsRef = useRef<DynamicPanelRef>(null);
  const operationalDetailsRef = useRef<DynamicPanelRef>(null);
  const billingDetailsRef = useRef<DynamicPanelRef>(null);

  // Validation state
  const [validationResults, setValidationResults] = useState<Record<string, { isValid: boolean; errors: Record<string, string>; mandatoryFieldsEmpty: string[] }>>({});
  const { toast } = useToast();

  // Get form values from all panels
  const handleGetAllFormValues = () => {
    const allFormValues: Record<string, any> = {};

    if (basicDetailsVisible && basicDetailsRef.current) {
      allFormValues.basicDetails = basicDetailsRef.current.getFormValues();
    }

    if (operationalDetailsVisible && operationalDetailsRef.current) {
      allFormValues.operationalDetails = operationalDetailsRef.current.getFormValues();
    }

    if (billingDetailsVisible && billingDetailsRef.current) {
      allFormValues.billingDetails = billingDetailsRef.current.getFormValues();
    }

    console.log('All Form Values:', allFormValues);
    
    toast({
      title: "Form Values Retrieved",
      description: "Check the console for all form values.",
      variant: "default",
    });

    return allFormValues;
  };

  // Submit handler (example)
  const handleSubmitForm = () => {
    const isValid = handleValidateAllPanels();
    
    if (isValid) {
      const formValues = handleGetAllFormValues();
      
      // Here you would typically send the data to your API
      console.log('Submitting form data:', formValues);
      
      toast({
        title: "Form Submitted Successfully!",
        description: "All panels validated and data submitted.",
        variant: "default",
      });
    } else {
      toast({
        title: "Validation Failed",
        description: "Please fix validation errors before submitting.",
        variant: "destructive",
      });
    }
  };
  const handleValidateAllPanels = () => {
    const results: Record<string, { isValid: boolean; errors: Record<string, string>; mandatoryFieldsEmpty: string[] }> = {};
    let overallValid = true;
    let totalErrors = 0;

    // Validate Basic Details
    if (basicDetailsVisible && basicDetailsRef.current) {
      const basicValidation = basicDetailsRef.current.doValidation();
      results['basic-details'] = basicValidation;
      if (!basicValidation.isValid) {
        overallValid = false;
        totalErrors += Object.keys(basicValidation.errors).length;
      }
    }

    // Validate Operational Details
    if (operationalDetailsVisible && operationalDetailsRef.current) {
      const operationalValidation = operationalDetailsRef.current.doValidation();
      results['operational-details'] = operationalValidation;
      if (!operationalValidation.isValid) {
        overallValid = false;
        totalErrors += Object.keys(operationalValidation.errors).length;
      }
    }

    // Validate Billing Details
    if (billingDetailsVisible && billingDetailsRef.current) {
      const billingValidation = billingDetailsRef.current.doValidation();
      results['billing-details'] = billingValidation;
      if (!billingValidation.isValid) {
        overallValid = false;
        totalErrors += Object.keys(billingValidation.errors).length;
      }
    }

    setValidationResults(results);

    // Show toast notification
    if (overallValid) {
      toast({
        title: "Validation Successful",
        description: "All mandatory fields are filled and valid.",
        variant: "default",
      });
    } else {
      toast({
        title: "Validation Failed",
        description: `${totalErrors} validation error(s) found. Please check the highlighted fields.`,
        variant: "destructive",
      });
    }

    return overallValid;
  };

  // Panel titles state
  const [basicDetailsTitle, setBasicDetailsTitle] = useState('Basic Details');
  const [operationalDetailsTitle, setOperationalDetailsTitle] = useState('Operational Details');
  const [billingDetailsTitle, setBillingDetailsTitle] = useState('Billing Details');

  // Memoized callbacks to prevent re-rendering and focus loss
  const handleBasicDetailsDataChange = useCallback((data: any) => {
    setBasicDetailsData(data);
  }, []);

  const handleOperationalDetailsDataChange = useCallback((data: any) => {
    setOperationalDetailsData(data);
  }, []);

  const handleBillingDetailsDataChange = useCallback((data: any) => {
    setBillingDetailsData(data);
  }, []);

  // Panel widths state - updated for 12-column system
  const [basicDetailsWidth, setBasicDetailsWidth] = useState<'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>(12);
  const [operationalDetailsWidth, setOperationalDetailsWidth] = useState<'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>(6);
  const [billingDetailsWidth, setBillingDetailsWidth] = useState<'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>(6);

  // Panel visibility state
  const [basicDetailsVisible, setBasicDetailsVisible] = useState(true);
  const [operationalDetailsVisible, setOperationalDetailsVisible] = useState(true);
  const [billingDetailsVisible, setBillingDetailsVisible] = useState(true);

  // Basic Details Panel Configuration
  const basicDetailsConfig: PanelConfig = {
    tripPlanNo: {
      id: 'tripPlanNo',
      label: 'Trip Plan No',
      fieldType: 'text',
      value: 'TRIP00000001',
      mandatory: true,
      visible: true,
      editable: false,
      order: 1,
      width: 'third',
      style: { backgroundColor: '#f0f0f0', border: '2px solid blue' }
    },
    customer: {
      fieldType: 'lazyselect',
      id: 'customer',
      label: 'Customer',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      fetchOptions: async ({ searchTerm, offset, limit }) => {
        const res = await fetch(
          `/api/customers?search=${searchTerm}&offset=${offset}&limit=${limit}`
        );
        const data = await res.json();
        return data.items.map((item: any) => ({
          label: item.customerName,
          value: item.customerId
        }));
      },
      events: {
        onChange: (selected, event) => {
          console.log('Customer changed:', selected);
        },
        onClick: (event, value) => {
          console.log('Customer dropdown clicked:', { event, value });
        }
      }
    },
    customerName: {
      id: 'customerName',
      label: 'Customer Name',
      fieldType: 'lazyselect',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 2,
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
      events: {
        onChange: (selected, event) => {
          console.log('Customer changed:', selected);
          console.log('Event:', event);
        },
        onClick: (event, value) => {
          console.log('Customer dropdown clicked:', { event, value });
        }
      }
    },
    contractType: {
      id: 'contractType',
      label: 'Contract Type',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3,
      options: [
        { label: 'Fixed Price', value: 'fixed' },
        { label: 'Variable', value: 'variable' },
        { label: 'Cost Plus', value: 'cost-plus' }
      ]
    },
    description: {
      id: 'description',
      label: 'Description',
      fieldType: 'textarea',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 4,
      placeholder: 'Enter trip description...',
      events: {
        onKeyDown: (event) => {
          if (event.key === 'Enter' && event.ctrlKey) {
            console.log('Ctrl+Enter pressed in description');
          }
        },
        onBlur: (event) => {
          console.log('Description field blurred with value:', (event.target as HTMLTextAreaElement).value);
        }
      }
    },
    priority: {
      id: 'priority',
      label: 'Priority',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      options: [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' }
      ]
    },
    category: {
      id: 'category',
      label: 'Category',
      fieldType: 'searchableselect',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 6,
      placeholder: 'Select category...',
      localOptions: [
        { label: 'Rail Transport', value: 'rail-transport' },
        { label: 'Road Transport', value: 'road-transport' },
        { label: 'Intermodal Service', value: 'intermodal-service' },
        { label: 'Container Handling', value: 'container-handling' },
        { label: 'Last Mile Delivery', value: 'last-mile' },
        { label: 'Bulk Cargo', value: 'bulk-cargo' },
        { label: 'Express Service', value: 'express-service' },
        { label: 'Cold Chain', value: 'cold-chain' },
        { label: 'Hazardous Materials', value: 'hazmat' },
        { label: 'Oversized Cargo', value: 'oversized' }
      ],
      events: {
        onChange: (value, event) => {
          console.log('Category changed:', value);
        },
        onClick: (event, value) => {
          console.log('Category dropdown clicked:', { event, value });
        }
      }
    }
  };

  // Operational Details Panel Configuration
  const operationalDetailsConfig: PanelConfig = {
    plannedStartDate: {
      id: 'plannedStartDate',
      label: 'Planned Start Date',
      fieldType: 'date',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1
    },
    plannedStartTime: {
      id: 'plannedStartTime',
      label: 'Planned Start Time',
      fieldType: 'time',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 2
    },
    plannedEndDate: {
      id: 'plannedEndDate',
      label: 'Planned End Date',
      fieldType: 'date',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 3
    },
    plannedEndTime: {
      id: 'plannedEndTime',
      label: 'Planned End Time',
      fieldType: 'time',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 4
    },
    departurePoint: {
      id: 'departurePoint',
      label: 'Departure Point',
      fieldType: 'search',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 5,
      placeholder: 'Search departure location...',
      events: {
        onChange: (value, event) => {
          console.log('Searching for departure point:', value);
          // You could trigger an API call here to search for locations
        },
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            console.log('Enter pressed in departure search');
          }
        }
      }
    },
    arrivalPoint: {
      id: 'arrivalPoint',
      label: 'Arrival Point',
      fieldType: 'search',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 6,
      placeholder: 'Search arrival location...'
    },
    distance: {
      id: 'distance',
      label: 'Distance (km)',
      fieldType: 'text',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 7
    },
    trainType: {
      id: 'trainType',
      label: 'Train Type',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 8,
      options: [
        { label: 'Freight', value: 'freight' },
        { label: 'Passenger', value: 'passenger' },
        { label: 'Mixed', value: 'mixed' }
      ]
    }
  };

  // Billing Details Panel Configuration
  const billingDetailsConfig: PanelConfig = {
    totalAmount: {
      id: 'totalAmount',
      label: 'Total Amount',
      fieldType: 'currency',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 1,
      events: {
        onChange: (value, event) => {
          console.log('Total amount changed to:', value);
          // Auto-calculate other fields based on total amount
          if (value > 1000) {
            console.log('High value transaction detected');
          }
        },
        onFocus: (event) => {
          console.log('Total amount field focused');
        }
      }
    },
    taxAmount: {
      id: 'taxAmount',
      label: 'Tax Amount',
      fieldType: 'currency',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 2
    },
    discountAmount: {
      id: 'discountAmount',
      label: 'Discount Amount',
      fieldType: 'currency',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 3
    },
    billingStatus: {
      id: 'billingStatus',
      label: 'Billing Status',
      fieldType: 'select',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 4,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' }
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
      options: [
        { label: 'Net 30', value: 'net-30' },
        { label: 'Net 60', value: 'net-60' },
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
      order: 6
    }
  };

  // Mock functions for user config management
  const getUserPanelConfig = (userId: string, panelId: string): PanelSettings | null => {
    const stored = localStorage.getItem(`panel-config-${userId}-${panelId}`);
    return stored ? JSON.parse(stored) : null;
  };

  const saveUserPanelConfig = (userId: string, panelId: string, settings: PanelSettings): void => {
    localStorage.setItem(`panel-config-${userId}-${panelId}`, JSON.stringify(settings));
    console.log(`Saved config for panel ${panelId}:`, settings);
  };

  // Tab management
  const [activeTab, setActiveTab] = useState('template');

  const tabs: DynamicTab[] = [
    { id: 'template', label: 'Template' },
    { id: 'cim-report', label: 'CIM/CUV Report' },
    { id: 'general', label: 'General' },
    { id: 'declarations', label: 'Declarations' },
    { id: 'route', label: 'Route' },
    { id: 'wagon-info', label: 'Wagon Info' }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    console.log('Tab changed to:', tabId);
    
    // Example of conditional panel visibility based on active tab
    switch (tabId) {
      case 'template':
        setBasicDetailsVisible(true);
        setOperationalDetailsVisible(true);
        setBillingDetailsVisible(false);
        break;
      case 'cim-report':
        setBasicDetailsVisible(true);
        setOperationalDetailsVisible(false);
        setBillingDetailsVisible(true);
        break;
      case 'general':
        setBasicDetailsVisible(true);
        setOperationalDetailsVisible(true);
        setBillingDetailsVisible(true);
        break;
      case 'declarations':
        setBasicDetailsVisible(false);
        setOperationalDetailsVisible(true);
        setBillingDetailsVisible(true);
        break;
      case 'route':
        setBasicDetailsVisible(false);
        setOperationalDetailsVisible(true);
        setBillingDetailsVisible(false);
        break;
      case 'wagon-info':
        setBasicDetailsVisible(true);
        setOperationalDetailsVisible(false);
        setBillingDetailsVisible(false);
        break;
      default:
        setBasicDetailsVisible(true);
        setOperationalDetailsVisible(true);
        setBillingDetailsVisible(true);
    }
  };

  // Panel visibility management
  const panels = [
    { id: 'basic-details', title: basicDetailsTitle, visible: basicDetailsVisible },
    { id: 'operational-details', title: operationalDetailsTitle, visible: operationalDetailsVisible },
    { id: 'billing-details', title: billingDetailsTitle, visible: billingDetailsVisible }
  ];

  const handlePanelVisibilityChange = (panelId: string, visible: boolean) => {
    switch (panelId) {
      case 'basic-details':
        setBasicDetailsVisible(visible);
        break;
      case 'operational-details':
        setOperationalDetailsVisible(visible);
        break;
      case 'billing-details':
        setBillingDetailsVisible(visible);
        break;
    }
  };

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
                Dynamic Panel Demo
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title and Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dynamic Panel Configuration</h1>
            <p className="text-gray-600 mt-1">
              Configure field visibility, ordering, and labels for each panel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleGetAllFormValues}
              variant="secondary"
              className="flex items-center gap-2"
            >
              Get Form Values
            </Button>
            <Button 
              onClick={handleValidateAllPanels}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Validate All Panels
            </Button>
            <Button 
              onClick={handleSubmitForm}
              className="flex items-center gap-2"
            >
              Submit Form
            </Button>
            <PanelVisibilityManager
              panels={panels}
              onVisibilityChange={handlePanelVisibilityChange}
            />
          </div>
        </div>

        {/* Dynamic Tabs */}
        <div className="flex items-center justify-between">
          <DynamicTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={handleTabChange}
            className="bg-white shadow-sm"
          />
          <div className="text-sm text-muted-foreground">
            Active Tab: <span className="font-medium">{tabs.find(tab => tab.id === activeTab)?.label}</span>
          </div>
        </div>

        {/* Validation Results */}
        {Object.keys(validationResults).length > 0 && (
          <div className="space-y-3">
            {Object.entries(validationResults).map(([panelId, result]) => (
              <Alert key={panelId} variant={result.isValid ? "default" : "destructive"}>
                {result.isValid ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {panelId === 'basic-details' && basicDetailsTitle}
                      {panelId === 'operational-details' && operationalDetailsTitle}
                      {panelId === 'billing-details' && billingDetailsTitle}
                    </span>
                    <span className={`text-sm ${result.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isValid ? 'Valid' : `${Object.keys(result.errors).length} error(s)`}
                    </span>
                  </div>
                  {!result.isValid && result.mandatoryFieldsEmpty.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Missing mandatory fields:</span>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {result.mandatoryFieldsEmpty.map((field, index) => (
                          <li key={index}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Dynamic Panels in 12-column grid */}
        <div className="grid grid-cols-12 gap-6">
          {(() => {
            let currentTabIndex = 1;
            const panels = [];
            
            // Panel 1: Basic Details
            if (basicDetailsVisible) {
              const basicDetailsVisibleCount = Object.values(basicDetailsConfig).filter(config => config.visible).length;
              panels.push(
                <DynamicPanel
                  key="basic-details"
                  ref={basicDetailsRef}
                  panelId="basic-details"
                  panelOrder={1}
                  startingTabIndex={currentTabIndex}
                  panelTitle={basicDetailsTitle}
                  panelConfig={basicDetailsConfig}
                  initialData={basicDetailsData}
                  onDataChange={handleBasicDetailsDataChange}
                  onTitleChange={setBasicDetailsTitle}
                  onWidthChange={setBasicDetailsWidth}
                  getUserPanelConfig={getUserPanelConfig}
                  saveUserPanelConfig={saveUserPanelConfig}
                  userId="current-user"
                  panelWidth={basicDetailsWidth}
                  validationErrors={validationResults['basic-details']?.errors || {}}
                />
              );
              currentTabIndex += basicDetailsVisibleCount;
            }

            // Panel 2: Operational Details
            if (operationalDetailsVisible) {
              const operationalDetailsVisibleCount = Object.values(operationalDetailsConfig).filter(config => config.visible).length;
              panels.push(
                <DynamicPanel
                  key="operational-details"
                  ref={operationalDetailsRef}
                  panelId="operational-details"
                  panelOrder={2}
                  startingTabIndex={currentTabIndex}
                  panelTitle={operationalDetailsTitle}
                  panelConfig={operationalDetailsConfig}
                  initialData={operationalDetailsData}
                  onDataChange={handleOperationalDetailsDataChange}
                  onTitleChange={setOperationalDetailsTitle}
                  onWidthChange={setOperationalDetailsWidth}
                  getUserPanelConfig={getUserPanelConfig}
                  saveUserPanelConfig={saveUserPanelConfig}
                  userId="current-user"
                  panelWidth={operationalDetailsWidth}
                  validationErrors={validationResults['operational-details']?.errors || {}}
                />
              );
              currentTabIndex += operationalDetailsVisibleCount;
            }

            // Panel 3: Billing Details
            if (billingDetailsVisible) {
              panels.push(
                <DynamicPanel
                  key="billing-details"
                  ref={billingDetailsRef}
                  panelId="billing-details"
                  panelOrder={3}
                  startingTabIndex={currentTabIndex}
                  panelTitle={billingDetailsTitle}
                  panelConfig={billingDetailsConfig}
                  initialData={billingDetailsData}
                  onDataChange={handleBillingDetailsDataChange}
                  onTitleChange={setBillingDetailsTitle}
                  onWidthChange={setBillingDetailsWidth}
                  getUserPanelConfig={getUserPanelConfig}
                  saveUserPanelConfig={saveUserPanelConfig}
                  userId="current-user"
                  panelWidth={billingDetailsWidth}
                  validationErrors={validationResults['billing-details']?.errors || {}}
                />
              );
            }

            return panels;
          })()}
        </div>

        {/* Show message when all panels are hidden */}
        {!basicDetailsVisible && !operationalDetailsVisible && !billingDetailsVisible && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <EyeOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">All panels are hidden</h3>
            <p className="text-gray-500 mb-4">Use the "Manage Panels" button above to show panels.</p>
          </div>
        )}

        {/* Debug Data Display */}
        {(basicDetailsVisible || operationalDetailsVisible || billingDetailsVisible) && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Current Form Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {basicDetailsVisible && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">{basicDetailsTitle}</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {JSON.stringify(basicDetailsData, null, 2)}
                  </pre>
                </div>
              )}
              {operationalDetailsVisible && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">{operationalDetailsTitle}</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {JSON.stringify(operationalDetailsData, null, 2)}
                  </pre>
                </div>
              )}
              {billingDetailsVisible && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">{billingDetailsTitle}</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {JSON.stringify(billingDetailsData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPanelDemo;
