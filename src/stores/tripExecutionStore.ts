import { create } from 'zustand';

interface TripData {
  basicDetails: Record<string, any>;
  operationalDetails: Record<string, any>;
  billingDetails: Record<string, any>;
}

interface TripExecutionStore {
  tripData: TripData;
  setBasicDetails: (data: Record<string, any>) => void;
  setOperationalDetails: (data: Record<string, any>) => void;
  setBillingDetails: (data: Record<string, any>) => void;
  setSectionData: (section: keyof TripData, field: string, value: any) => void;
  getSectionData: (section: keyof TripData) => Record<string, any>;
  resetTrip: () => void;
}

const initialState: TripData = {
  basicDetails: {},
  operationalDetails: {},
  billingDetails: {},
};

export const useTripExecutionStore = create<TripExecutionStore>((set, get) => ({
  tripData: initialState,
  
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
  
  setSectionData: (section, field, value) =>
    set((state) => ({
      tripData: {
        ...state.tripData,
        [section]: {
          ...state.tripData[section],
          [field]: value,
        },
      },
    })),
  
  getSectionData: (section) => get().tripData[section],
  
  resetTrip: () => set({ tripData: initialState }),
}));
