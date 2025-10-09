import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { ApiResponse } from '../types';
import type { TripInfo, TripDetails, Activity, SummaryCard } from '@/stores/tripExecutionPageStore';

export interface TripExecutionResponse {
  tripInfo: TripInfo;
  tripDetails: TripDetails;
  activities: Activity[];
  summaryCards: SummaryCard[];
}

export interface SaveTripDraftInput {
  tripId: string;
  tripDetails: TripDetails;
  activities: Activity[];
}

export interface ConfirmTripInput {
  tripId: string;
  tripDetails: TripDetails;
  activities: Activity[];
}

export const tripExecutionService = {
  // Get trip execution details
  getTripExecution: async (tripId: string): Promise<TripExecutionResponse> => {
    const response = await apiClient.get<ApiResponse<TripExecutionResponse>>(
      `${API_ENDPOINTS.TRIPS.LIST}/${tripId}/execution`
    );
    return response.data.data;
  },

  // Save trip as draft
  saveTripDraft: async (data: SaveTripDraftInput): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `${API_ENDPOINTS.TRIPS.LIST}/${data.tripId}/draft`,
      {
        tripDetails: data.tripDetails,
        activities: data.activities
      }
    );
    return response.data;
  },

  // Confirm trip execution
  confirmTrip: async (data: ConfirmTripInput): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `${API_ENDPOINTS.TRIPS.LIST}/${data.tripId}/confirm`,
      {
        tripDetails: data.tripDetails,
        activities: data.activities
      }
    );
    return response.data;
  },

  // Update activity
  updateActivity: async (
    tripId: string,
    activityId: string,
    data: Partial<Activity>
  ): Promise<ApiResponse<Activity>> => {
    const response = await apiClient.patch<ApiResponse<Activity>>(
      `${API_ENDPOINTS.TRIPS.LIST}/${tripId}/activities/${activityId}`,
      data
    );
    return response.data;
  },

  // Get trip summary
  getTripSummary: async (tripId: string): Promise<SummaryCard[]> => {
    const response = await apiClient.get<ApiResponse<SummaryCard[]>>(
      `${API_ENDPOINTS.TRIPS.LIST}/${tripId}/summary`
    );
    return response.data.data;
  }
};
