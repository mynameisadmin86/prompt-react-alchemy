import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TripExecutionWizardState {
  // Step 1: Basic Details
  basicDetails: {
    tripId?: string;
    customerId?: string;
    tripType?: string;
    railInfo?: string;
    fromLocation?: string;
    toLocation?: string;
    trainNo?: string;
    cluster?: string;
  };
  
  // Step 2: Operational Details
  operationalDetails: {
    startDate?: string;
    endDate?: string;
    mode?: string;
    supplierRefNo?: string;
    remarks1?: string;
  };
  
  // Step 3: Billing Details
  billingDetails: {
    amount?: number;
    currency?: string;
    cost?: number;
    qcUserdefined1?: string;
  };
  
  // Step 4: Additional Details
  additionalDetails: {
    status?: string;
    notes?: string;
    attachments?: string[];
  };

  // Saved status for each step
  savedSteps: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
  };

  // Actions
  setBasicDetails: (data: Partial<TripExecutionWizardState['basicDetails']>) => void;
  setOperationalDetails: (data: Partial<TripExecutionWizardState['operationalDetails']>) => void;
  setBillingDetails: (data: Partial<TripExecutionWizardState['billingDetails']>) => void;
  setAdditionalDetails: (data: Partial<TripExecutionWizardState['additionalDetails']>) => void;
  markStepAsSaved: (step: keyof TripExecutionWizardState['savedSteps']) => void;
  resetWizard: () => void;
}

const initialState = {
  basicDetails: {},
  operationalDetails: {},
  billingDetails: {},
  additionalDetails: {},
  savedSteps: {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  },
};

export const useTripExecutionWizardStore = create<TripExecutionWizardState>()(
  persist(
    (set) => ({
      ...initialState,

      setBasicDetails: (data) =>
        set((state) => ({
          basicDetails: { ...state.basicDetails, ...data },
          savedSteps: { ...state.savedSteps, step1: false },
        })),

      setOperationalDetails: (data) =>
        set((state) => ({
          operationalDetails: { ...state.operationalDetails, ...data },
          savedSteps: { ...state.savedSteps, step2: false },
        })),

      setBillingDetails: (data) =>
        set((state) => ({
          billingDetails: { ...state.billingDetails, ...data },
          savedSteps: { ...state.savedSteps, step3: false },
        })),

      setAdditionalDetails: (data) =>
        set((state) => ({
          additionalDetails: { ...state.additionalDetails, ...data },
          savedSteps: { ...state.savedSteps, step4: false },
        })),

      markStepAsSaved: (step) =>
        set((state) => ({
          savedSteps: { ...state.savedSteps, [step]: true },
        })),

      resetWizard: () => set(initialState),
    }),
    {
      name: 'trip-execution-wizard-storage',
    }
  )
);
