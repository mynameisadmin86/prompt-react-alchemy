import { create } from 'zustand';

export interface TripInfo {
  id: string;
  tripNumber: string;
  customerId: string;
  customerName: string;
  railCompany: string;
  railCompanyId: string;
  price: number;
  currency: string;
  transportMode: string;
  fromLocation: string;
  fromLocationCode: string;
  toLocation: string;
  toLocationCode: string;
  status: 'draft' | 'released' | 'in-progress' | 'completed' | 'cancelled';
}

export interface TripDetails {
  tripType: 'One Way' | 'Round Trip';
  trainNo: string;
  cluster: string;
  supplierRefNo: string;
  ocUserdefined1: string;
  remarks1: string;
}

export interface Activity {
  id?: string;
  leg: string;
  behaviour: string;
  location: string;
  plannedActual: string;
  consignment: string;
  status: 'completed' | 'pending';
  action: string;
  actualDateTime: string;
}

export interface SummaryCard {
  label: string;
  value: string | number;
  icon?: string;
}

interface TripExecutionPageState {
  // Data
  tripInfo: TripInfo | null;
  tripDetails: TripDetails;
  activities: Activity[];
  summaryCards: SummaryCard[];
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Actions
  setTripInfo: (info: TripInfo) => void;
  setTripDetails: (details: Partial<TripDetails>) => void;
  updateTripDetailField: (field: keyof TripDetails, value: any) => void;
  setActivities: (activities: Activity[]) => void;
  updateActivity: (index: number, activity: Partial<Activity>) => void;
  setSummaryCards: (cards: SummaryCard[]) => void;
  
  // Async actions
  fetchTripExecution: (tripId: string) => Promise<void>;
  saveDraft: () => Promise<void>;
  confirmTrip: () => Promise<void>;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialTripDetails: TripDetails = {
  tripType: 'One Way',
  trainNo: '',
  cluster: '10000406',
  supplierRefNo: '',
  ocUserdefined1: 'GC',
  remarks1: ''
};

export const useTripExecutionPageStore = create<TripExecutionPageState>((set, get) => ({
  // Initial state
  tripInfo: null,
  tripDetails: initialTripDetails,
  activities: [],
  summaryCards: [],
  isLoading: false,
  isSaving: false,
  error: null,
  
  // Setters
  setTripInfo: (info) => set({ tripInfo: info }),
  
  setTripDetails: (details) =>
    set((state) => ({
      tripDetails: { ...state.tripDetails, ...details }
    })),
  
  updateTripDetailField: (field, value) =>
    set((state) => ({
      tripDetails: { ...state.tripDetails, [field]: value }
    })),
  
  setActivities: (activities) => set({ activities }),
  
  updateActivity: (index, activity) =>
    set((state) => ({
      activities: state.activities.map((act, i) =>
        i === index ? { ...act, ...activity } : act
      )
    })),
  
  setSummaryCards: (cards) => set({ summaryCards: cards }),
  
  // Async actions
  fetchTripExecution: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Import service dynamically to avoid circular dependencies
      const { tripExecutionService } = await import('@/api/services/tripExecutionService');
      const data = await tripExecutionService.getTripExecution(tripId);
      
      set({
        tripInfo: data.tripInfo,
        tripDetails: data.tripDetails,
        activities: data.activities,
        summaryCards: data.summaryCards,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch trip execution',
        isLoading: false
      });
    }
  },
  
  saveDraft: async () => {
    const state = get();
    if (!state.tripInfo) {
      set({ error: 'No trip information available' });
      return;
    }
    
    set({ isSaving: true, error: null });
    try {
      const { tripExecutionService } = await import('@/api/services/tripExecutionService');
      await tripExecutionService.saveTripDraft({
        tripId: state.tripInfo.id,
        tripDetails: state.tripDetails,
        activities: state.activities
      });
      
      set({ isSaving: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save draft',
        isSaving: false
      });
    }
  },
  
  confirmTrip: async () => {
    const state = get();
    if (!state.tripInfo) {
      set({ error: 'No trip information available' });
      return;
    }
    
    set({ isSaving: true, error: null });
    try {
      const { tripExecutionService } = await import('@/api/services/tripExecutionService');
      await tripExecutionService.confirmTrip({
        tripId: state.tripInfo.id,
        tripDetails: state.tripDetails,
        activities: state.activities
      });
      
      set({ isSaving: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to confirm trip',
        isSaving: false
      });
    }
  },
  
  // Utility
  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      tripInfo: null,
      tripDetails: initialTripDetails,
      activities: [],
      summaryCards: [],
      isLoading: false,
      isSaving: false,
      error: null
    })
}));
