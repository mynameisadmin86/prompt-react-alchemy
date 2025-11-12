import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicPanel, DynamicPanelRef } from '@/components/DynamicPanel';
import { PanelConfig, PanelSettings } from '@/types/dynamicPanel';
import { useTripExecutionWizardStore } from '@/stores/tripExecutionWizardStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Save, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TripExecutionWizard = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    tripData,
    savedSteps,
    setCurrentStep,
    setBasicDetails,
    setOperationalDetails,
    setBillingDetails,
    setAdditionalDetails,
    markStepAsSaved,
    markStepAsUnsaved,
    resetWizard,
  } = useTripExecutionWizardStore();

  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingStep, setPendingStep] = useState<number | null>(null);

  const basicDetailsRef = useRef<DynamicPanelRef>(null);
  const operationalDetailsRef = useRef<DynamicPanelRef>(null);
  const billingDetailsRef = useRef<DynamicPanelRef>(null);
  const additionalDetailsRef = useRef<DynamicPanelRef>(null);

  // Track if user has made changes
  useEffect(() => {
    if (currentStep === 1 && Object.keys(tripData.basicDetails).length > 0) {
      markStepAsUnsaved(1);
    }
  }, [tripData.basicDetails]);

  useEffect(() => {
    if (currentStep === 2 && Object.keys(tripData.operationalDetails).length > 0) {
      markStepAsUnsaved(2);
    }
  }, [tripData.operationalDetails]);

  useEffect(() => {
    if (currentStep === 3 && Object.keys(tripData.billingDetails).length > 0) {
      markStepAsUnsaved(3);
    }
  }, [tripData.billingDetails]);

  useEffect(() => {
    if (currentStep === 4 && Object.keys(tripData.additionalDetails).length > 0) {
      markStepAsUnsaved(4);
    }
  }, [tripData.additionalDetails]);

  // Callbacks
  const handleBasicDetailsDataChange = useCallback((data: any) => {
    setBasicDetails(data);
    markStepAsUnsaved(1);
  }, [setBasicDetails, markStepAsUnsaved]);

  const handleOperationalDetailsDataChange = useCallback((data: any) => {
    setOperationalDetails(data);
    markStepAsUnsaved(2);
  }, [setOperationalDetails, markStepAsUnsaved]);

  const handleBillingDetailsDataChange = useCallback((data: any) => {
    setBillingDetails(data);
    markStepAsUnsaved(3);
  }, [setBillingDetails, markStepAsUnsaved]);

  const handleAdditionalDetailsDataChange = useCallback((data: any) => {
    setAdditionalDetails(data);
    markStepAsUnsaved(4);
  }, [setAdditionalDetails, markStepAsUnsaved]);

  // Options
  const customerOptions = useMemo(() => [
    { label: 'DB Cargo', value: 'db-cargo' },
    { label: 'Rail Logistics', value: 'rail-logistics' },
    { label: 'Euro Transport', value: 'euro-transport' },
    { label: 'Nordic Rail', value: 'nordic-rail' },
  ], []);

  const contractTypeOptions = useMemo(() => [
    { label: 'Fixed Price', value: 'fixed-price' },
    { label: 'Time & Material', value: 'time-material' },
    { label: 'Cost Plus', value: 'cost-plus' },
  ], []);

  const currencyOptions = useMemo(() => [
    { label: '€', value: 'EUR' },
    { label: '$', value: 'USD' },
    { label: '£', value: 'GBP' },
  ], []);

  const priorityOptions = useMemo(() => [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ], []);

  const trainTypeOptions = useMemo(() => [
    { label: 'Freight', value: 'freight' },
    { label: 'Express', value: 'express' },
    { label: 'Standard', value: 'standard' },
  ], []);

  const billingStatusOptions = useMemo(() => [
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Paid', value: 'paid' },
  ], []);

  const paymentTermsOptions = useMemo(() => [
    { label: 'Net 30', value: 'net-30' },
    { label: 'Net 60', value: 'net-60' },
    { label: 'Net 90', value: 'net-90' },
    { label: 'Immediate', value: 'immediate' },
  ], []);

  const searchData = useMemo(() => [
    'Berlin Hauptbahnhof',
    'Munich Central Station',
    'Hamburg Hbf',
    'Frankfurt Main Station',
    'Cologne Station',
  ], []);

  // Panel configs
  const basicDetailsConfig: PanelConfig = useMemo(() => ({
    tripPlanNo: {
      id: 'tripPlanNo',
      label: 'Trip Plan No',
      fieldType: 'text',
      value: 'TRIP00000001',
      mandatory: true,
      visible: true,
      editable: false,
      order: 1,
      width: 'half',
      placeholder: 'Auto-generated',
    },
    customerName: {
      id: 'customerName',
      label: 'Customer Name',
      fieldType: 'select',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 2,
      width: 'half',
      options: customerOptions,
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
      width: 'half',
      options: contractTypeOptions,
    },
    unitPrice: {
      id: 'unitPrice',
      label: 'Unit Price',
      fieldType: 'inputdropdown',
      value: { dropdown: 'EUR', input: '' },
      mandatory: false,
      visible: true,
      editable: true,
      order: 4,
      width: 'half',
      options: currencyOptions,
      inputType: 'currency',
    },
    description: {
      id: 'description',
      label: 'Description',
      fieldType: 'textarea',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 5,
      width: 'full',
      placeholder: 'Enter trip description...',
    },
    priority: {
      id: 'priority',
      label: 'Priority',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 6,
      width: 'half',
      options: priorityOptions,
    },
  }), [customerOptions, contractTypeOptions, currencyOptions, priorityOptions]);

  const operationalDetailsConfig: PanelConfig = useMemo(() => ({
    plannedStartDate: {
      id: 'plannedStartDate',
      label: 'Planned Start Date',
      fieldType: 'date',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 7,
      width: 'half',
    },
    plannedStartTime: {
      id: 'plannedStartTime',
      label: 'Planned Start Time',
      fieldType: 'time',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 8,
      width: 'half',
    },
    plannedEndDate: {
      id: 'plannedEndDate',
      label: 'Planned End Date',
      fieldType: 'date',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 9,
      width: 'half',
    },
    plannedEndTime: {
      id: 'plannedEndTime',
      label: 'Planned End Time',
      fieldType: 'time',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 10,
      width: 'half',
    },
    departurePoint: {
      id: 'departurePoint',
      label: 'Departure Point',
      fieldType: 'search',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 11,
      width: 'half',
      placeholder: 'Search departure location...',
      searchData: searchData,
    },
    arrivalPoint: {
      id: 'arrivalPoint',
      label: 'Arrival Point',
      fieldType: 'search',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 12,
      width: 'half',
      placeholder: 'Search arrival location...',
      searchData: searchData,
    },
    distance: {
      id: 'distance',
      label: 'Distance (km)',
      fieldType: 'text',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 13,
      width: 'half',
      placeholder: 'Enter distance',
    },
    trainType: {
      id: 'trainType',
      label: 'Train Type',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 14,
      width: 'half',
      options: trainTypeOptions,
    },
  }), [searchData, trainTypeOptions]);

  const billingDetailsConfig: PanelConfig = useMemo(() => ({
    totalAmount: {
      id: 'totalAmount',
      label: 'Total Amount',
      fieldType: 'currency',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 15,
      width: 'half',
      placeholder: '0.00',
    },
    taxAmount: {
      id: 'taxAmount',
      label: 'Tax Amount',
      fieldType: 'currency',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 16,
      width: 'half',
      placeholder: '0.00',
    },
    discountAmount: {
      id: 'discountAmount',
      label: 'Discount Amount',
      fieldType: 'currency',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 17,
      width: 'half',
      placeholder: '0.00',
    },
    billingStatus: {
      id: 'billingStatus',
      label: 'Billing Status',
      fieldType: 'select',
      value: '',
      mandatory: true,
      visible: true,
      editable: true,
      order: 18,
      width: 'half',
      options: billingStatusOptions,
    },
    paymentTerms: {
      id: 'paymentTerms',
      label: 'Payment Terms',
      fieldType: 'select',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 19,
      width: 'half',
      options: paymentTermsOptions,
    },
    invoiceDate: {
      id: 'invoiceDate',
      label: 'Invoice Date',
      fieldType: 'date',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 20,
      width: 'half',
    },
  }), [billingStatusOptions, paymentTermsOptions]);

  const additionalDetailsConfig: PanelConfig = useMemo(() => ({
    specialInstructions: {
      id: 'specialInstructions',
      label: 'Special Instructions',
      fieldType: 'textarea',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 21,
      width: 'full',
      placeholder: 'Any special instructions for this trip...',
    },
    cargoType: {
      id: 'cargoType',
      label: 'Cargo Type',
      fieldType: 'text',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 22,
      width: 'half',
      placeholder: 'Enter cargo type',
    },
    weight: {
      id: 'weight',
      label: 'Weight (tons)',
      fieldType: 'text',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 23,
      width: 'half',
      placeholder: 'Enter weight',
    },
    contactPerson: {
      id: 'contactPerson',
      label: 'Contact Person',
      fieldType: 'text',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 24,
      width: 'half',
      placeholder: 'Enter contact person name',
    },
    contactPhone: {
      id: 'contactPhone',
      label: 'Contact Phone',
      fieldType: 'text',
      value: '',
      mandatory: false,
      visible: true,
      editable: true,
      order: 25,
      width: 'half',
      placeholder: 'Enter phone number',
    },
  }), []);

  const getUserPanelConfigCallback = useCallback((userId: string, panelId: string): PanelSettings | null => {
    const stored = localStorage.getItem(`trip-wizard-${userId}-${panelId}`);
    return stored ? JSON.parse(stored) : null;
  }, []);

  const saveUserPanelConfigCallback = useCallback((userId: string, panelId: string, settings: PanelSettings): void => {
    localStorage.setItem(`trip-wizard-${userId}-${panelId}`, JSON.stringify(settings));
  }, []);

  const validateCurrentStep = (): boolean => {
    let ref: DynamicPanelRef | null = null;
    
    switch (currentStep) {
      case 1:
        ref = basicDetailsRef.current;
        break;
      case 2:
        ref = operationalDetailsRef.current;
        break;
      case 3:
        ref = billingDetailsRef.current;
        break;
      case 4:
        ref = additionalDetailsRef.current;
        break;
    }

    if (!ref) return true;
    
    const result = ref.doValidation();
    return typeof result === 'boolean' ? result : result.isValid;
  };

  const handleSaveStep = () => {
    if (validateCurrentStep()) {
      markStepAsSaved(currentStep);
      toast({
        title: "Success",
        description: `Step ${currentStep} saved successfully!`,
      });

      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleStepChange = (newStep: number) => {
    if (newStep === currentStep) return;

    // Check if current step has unsaved changes
    if (!savedSteps.includes(currentStep) && Object.keys(getCurrentStepData()).length > 0) {
      setPendingStep(newStep);
      setShowUnsavedDialog(true);
    } else {
      setCurrentStep(newStep);
    }
  };

  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1:
        return tripData.basicDetails;
      case 2:
        return tripData.operationalDetails;
      case 3:
        return tripData.billingDetails;
      case 4:
        return tripData.additionalDetails;
      default:
        return {};
    }
  };

  const handleProceedWithoutSaving = () => {
    if (pendingStep !== null) {
      setCurrentStep(pendingStep);
      setPendingStep(null);
    }
    setShowUnsavedDialog(false);
  };

  const handleSaveAndProceed = () => {
    if (validateCurrentStep()) {
      markStepAsSaved(currentStep);
      if (pendingStep !== null) {
        setCurrentStep(pendingStep);
        setPendingStep(null);
      }
      setShowUnsavedDialog(false);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding",
        variant: "destructive",
      });
    }
  };

  const handleSubmitWizard = () => {
    if (validateCurrentStep()) {
      markStepAsSaved(4);
      console.log('Complete Trip Data:', tripData);
      toast({
        title: "Success",
        description: "Trip execution created successfully!",
      });
      // Navigate to success page or reset
      setTimeout(() => {
        resetWizard();
        navigate('/');
      }, 2000);
    } else {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields",
        variant: "destructive",
      });
    }
  };

  const steps = [
    { number: 1, title: 'Basic Details', completed: savedSteps.includes(1) },
    { number: 2, title: 'Operational Details', completed: savedSteps.includes(2) },
    { number: 3, title: 'Billing Details', completed: savedSteps.includes(3) },
    { number: 4, title: 'Additional Details', completed: savedSteps.includes(4) },
  ];

  const progress = (currentStep / 4) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Trip Execution Wizard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create Trip Execution</h1>
        <p className="text-muted-foreground">
          Step {currentStep} of 4 - {steps[currentStep - 1].title}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => handleStepChange(step.number)}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${
                currentStep === step.number
                  ? 'bg-primary/10 text-primary'
                  : step.completed
                  ? 'text-green-600'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === step.number
                  ? 'border-primary bg-primary text-primary-foreground'
                  : step.completed
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-muted-foreground'
              }`}>
                {step.completed ? <CheckCircle className="h-5 w-5" /> : step.number}
              </div>
              <span className="text-xs font-medium">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <DynamicPanel
            ref={basicDetailsRef}
            panelId="wizard-basic-details"
            panelTitle="Basic Details"
            panelConfig={basicDetailsConfig}
            initialData={tripData.basicDetails}
            onDataChange={handleBasicDetailsDataChange}
            getUserPanelConfig={getUserPanelConfigCallback}
            saveUserPanelConfig={saveUserPanelConfigCallback}
            userId="user-001"
            collapsible={false}
            panelWidth="full"
          />
        )}

        {currentStep === 2 && (
          <DynamicPanel
            ref={operationalDetailsRef}
            panelId="wizard-operational-details"
            panelTitle="Operational Details"
            panelConfig={operationalDetailsConfig}
            initialData={tripData.operationalDetails}
            onDataChange={handleOperationalDetailsDataChange}
            getUserPanelConfig={getUserPanelConfigCallback}
            saveUserPanelConfig={saveUserPanelConfigCallback}
            userId="user-001"
            collapsible={false}
            panelWidth="full"
          />
        )}

        {currentStep === 3 && (
          <DynamicPanel
            ref={billingDetailsRef}
            panelId="wizard-billing-details"
            panelTitle="Billing Details"
            panelConfig={billingDetailsConfig}
            initialData={tripData.billingDetails}
            onDataChange={handleBillingDetailsDataChange}
            getUserPanelConfig={getUserPanelConfigCallback}
            saveUserPanelConfig={saveUserPanelConfigCallback}
            userId="user-001"
            collapsible={false}
            panelWidth="full"
          />
        )}

        {currentStep === 4 && (
          <>
            <DynamicPanel
              ref={additionalDetailsRef}
              panelId="wizard-additional-details"
              panelTitle="Additional Details"
              panelConfig={additionalDetailsConfig}
              initialData={tripData.additionalDetails}
              onDataChange={handleAdditionalDetailsDataChange}
              getUserPanelConfig={getUserPanelConfigCallback}
              saveUserPanelConfig={saveUserPanelConfigCallback}
              userId="user-001"
              collapsible={false}
              panelWidth="full"
            />

            {/* Review Summary */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Review Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground">Basic Details</h3>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
                    {JSON.stringify(tripData.basicDetails, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground">Operational Details</h3>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
                    {JSON.stringify(tripData.operationalDetails, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground">Billing Details</h3>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
                    {JSON.stringify(tripData.billingDetails, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground">Additional Details</h3>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
                    {JSON.stringify(tripData.additionalDetails, null, 2)}
                  </pre>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-3">
        <Button
          onClick={() => handleStepChange(currentStep - 1)}
          disabled={currentStep === 1}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-3">
          {currentStep < 4 ? (
            <>
              <Button onClick={handleSaveStep} className="gap-2">
                <Save className="h-4 w-4" />
                Save & Continue
              </Button>
              <Button
                onClick={() => handleStepChange(currentStep + 1)}
                variant="outline"
              >
                Skip
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          ) : (
            <Button onClick={handleSubmitWizard} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Submit Trip Execution
            </Button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in the current step. Do you want to save before proceeding?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleProceedWithoutSaving}>
              Don't Save
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveAndProceed}>
              Save & Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TripExecutionWizard;
