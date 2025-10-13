import { create } from "zustand";
import {
  Header,
  Incident,
  LegDetail,
  ModeFlag,
  TripData,
} from "@/types/manageTripTypes";
import { tripService } from "@/api/services/tripService";

interface TripState {
  tripData: TripData | null;
  loading: boolean;
  error: string | null;

  // CRUD actions
  setTrip?: (data: TripData) => void;
  updateHeader?: (updates: Partial<Header>, modeFlag?: ModeFlag) => void;
  updateHeaderField: (
    key: keyof Header,
    value: any,
    modeFlag?: ModeFlag
  ) => void;
  addLeg?: (leg: LegDetail) => void;
  updateLeg?: (legId: string, updates: Partial<LegDetail>) => void;
  removeLeg?: (legId: string) => void;
  addIncident?: (incident: Incident) => void;
  updateIncident?: (incidentId: string, updates: Partial<Incident>) => void;
  removeIncident?: (incidentId: string) => void;

  // API actions
  fetchTrip: (tripId: string) => Promise<void>;
  saveTrip: () => Promise<void>;
  confirmTrip: () => Promise<void>;
}

export const manageTripStore = create<TripState>((set, get) => ({
  tripData: null,
  loading: false,
  error: null,

  setTrip: (trip: any) => {
    set({ tripData: trip });
  },

  fetchTrip: async (tripNo: string) => {
    set({ loading: true, error: null });
    try {
      // call your API service - adapt to your service's signature
      const res: any = await tripService.getTripById({ id: tripNo });
      // your API returns ResponseData JSON string — parse carefully
      const parsed = res?.data?.ResponseData
        ? JSON.parse(res.data.ResponseData)
        : res?.data || [];
      // parsed structure expected to be full TripResponse
      set({ tripData: parsed, loading: false, error: null });
    } catch (err: any) {
      console.error("fetchTrip failed", err);
      set({ error: err?.message ?? "Fetch failed", loading: false });
    }
  },
  
  saveTrip: async () => {
    const current = get().tripData;
    if (!current) {
      throw new Error("No trip data to save");
    }
    
    set({ loading: true, error: null });
    try {
      console.log('Saving trip draft with data:', current);
      const res = await tripService.saveTripDraft(current);
      
      // Update the store with the response if needed
      if (res?.data) {
        const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        set({ tripData: parsed, loading: false, error: null });
      } else {
        set({ loading: false });
      }
      
      console.log('Trip saved successfully:', res);
    } catch (err: any) {
      console.error("saveTrip failed", err);
      set({ error: err?.message ?? "Save failed", loading: false });
      throw err;
    }
  },
  
  confirmTrip: async () => {
    const current = get().tripData;
    if (!current) {
      throw new Error("No trip data to confirm");
    }
    
    set({ loading: true, error: null });
    try {
      console.log('Confirming trip with data:', current);
      const res = await tripService.confirmTrip(current);
      
      // Update the store with the response
      if (res?.data) {
        const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        set({ tripData: parsed, loading: false, error: null });
      } else {
        set({ loading: false });
      }
      
      console.log('Trip confirmed successfully:', res);
    } catch (err: any) {
      console.error("confirmTrip failed", err);
      set({ error: err?.message ?? "Confirm failed", loading: false });
      throw err;
    }
  },
  
  updateHeaderField: (key, value, modeFlag = "Update") => {
    const current = get().tripData;
    if (!current) return;
    const updatedHeader = {
      ...current.Header,
      [key]: value,
      ModeFlag: modeFlag,
    };
    set({ tripData: { ...current, Header: updatedHeader } });
    console.log('------tripData: ', get().tripData);
  },
}));
