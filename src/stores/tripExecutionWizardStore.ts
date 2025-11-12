import { create } from 'zustand';

interface TripData {
  basicDetails: Record<string, any>;
  operationalDetails: Record<string, any>;
  billingDetails: Record<string, any>;
  additionalDetails: Record<string, any>;
}

interface TripExecutionWizardStore {
  currentStep: number;
  tripData: TripData;
  savedSteps: number[];
  setCurrentStep: (step: number) => void;
  setBasicDetails: (data: Record<string, any>) => void;
  setOperationalDetails: (data: Record<string, any>) => void;
  setBillingDetails: (data: Record<string, any>) => void;
  setAdditionalDetails: (data: Record<string, any>) => void;
  markStepAsSaved: (step: number) => void;
  markStepAsUnsaved: (step: number) => void;
  resetWizard: () => void;
}

const initialState = {
  currentStep: 1,
  tripData: {
    basicDetails: {},
    operationalDetails: {},
    billingDetails: {},
    additionalDetails: {},
  },
  savedSteps: [],
};

export const useTripExecutionWizardStore = create<TripExecutionWizardStore>((set) => ({
  ...initialState,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setBasicDetails: (data) =>
    set((state) => ({
      tripData: {
        ...state.tripData,
        basicDetails: data,
      },
    })),
  
  setOperationalDetails: (data) =>
    set((state) => ({
      tripData: {
        ...state.tripData,
        operationalDetails: data,
      },
    })),
  
  setBillingDetails: (data) =>
    set((state) => ({
      tripData: {
        ...state.tripData,
        billingDetails: data,
      },
    })),
  
  setAdditionalDetails: (data) =>
    set((state) => ({
      tripData: {
        ...state.tripData,
        additionalDetails: data,
      },
    })),
  
  markStepAsSaved: (step) =>
    set((state) => ({
      savedSteps: state.savedSteps.includes(step)
        ? state.savedSteps
        : [...state.savedSteps, step],
    })),
  
  markStepAsUnsaved: (step) =>
    set((state) => ({
      savedSteps: state.savedSteps.filter((s) => s !== step),
    })),
  
  resetWizard: () => set(initialState),
}));
