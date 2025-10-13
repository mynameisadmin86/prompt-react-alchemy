
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { ApiResponse, PaginatedResponse, QueryParams, Trip, TripCreateInput, TripUpdateInput } from '../types';

export const tripService = {
  // Get trips with filtering, sorting, and pagination
  getTrips: async (params?: QueryParams): Promise<PaginatedResponse<Trip>> => {
    const response = await apiClient.get(API_ENDPOINTS.TRIPS.LIST, { params });
    return response.data;
  },

  // Get single trip
  getTrip: async (id: string): Promise<ApiResponse<Trip>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.TRIPS.LIST}/${id}`);
    return response.data;
  },

  // Create new trip
  createTrip: async (data: TripCreateInput): Promise<ApiResponse<Trip>> => {
    const response = await apiClient.post(API_ENDPOINTS.TRIPS.CREATE, data);
    return response.data;
  },

  // Update trip
  updateTrip: async (id: string, data: TripUpdateInput): Promise<ApiResponse<Trip>> => {
    const response = await apiClient.put(API_ENDPOINTS.TRIPS.UPDATE(id), data);
    return response.data;
  },

  // Delete trip
  deleteTrip: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(API_ENDPOINTS.TRIPS.DELETE(id));
    return response.data;
  },

  // Approve trip
  approveTrip: async (id: string): Promise<ApiResponse<Trip>> => {
    const response = await apiClient.post(API_ENDPOINTS.TRIPS.APPROVE(id));
    return response.data;
  },

  // Get single trip
  getTripById: async (params?: any): Promise<ApiResponse<Trip>> => {
    const requestPayload = JSON.stringify({
      context: {
        UserID: "ramcouser",
        Role: "ramcorole",
        OUID: 4,
        MessageID: "12345",
        MessageType: "TripLog GetTripID",
      },
      SearchCriteria: {
        TripID: params?.id,
      },
      Pagination: {
        PageNumber: 1,
        PageSize: 10,
        TotalRecords: 200,
      },
    });
    const requestBody = {
      RequestData: requestPayload,
    };
    const response = await apiClient.post(
      `${API_ENDPOINTS.TRIPS}`,
      requestBody
    );
    return response.data;
  },

  // Save trip draft
  saveTripDraft: async (tripData: any): Promise<ApiResponse<Trip>> => {
    const requestPayload = JSON.stringify({
      context: {
        UserID: "ramcouser",
        Role: "ramcorole",
        OUID: 4,
        MessageID: "12345",
        MessageType: "TripLog Save Draft",
      },
      TripData: tripData,
    });
    const requestBody = {
      RequestData: requestPayload,
    };
    const response = await apiClient.post(
      `${API_ENDPOINTS.TRIPS.CREATE}`,
      requestBody
    );
    return response.data;
  },

  // Confirm trip
  confirmTrip: async (tripData: any): Promise<ApiResponse<Trip>> => {
    const requestPayload = JSON.stringify({
      context: {
        UserID: "ramcouser",
        Role: "ramcorole",
        OUID: 4,
        MessageID: "12345",
        MessageType: "TripLog Confirm",
      },
      TripData: {
        ...tripData,
        Header: {
          ...tripData.Header,
          Status: "Confirmed"
        }
      },
    });
    const requestBody = {
      RequestData: requestPayload,
    };
    const response = await apiClient.post(
      `${API_ENDPOINTS.TRIPS.CREATE}`,
      requestBody
    );
    return response.data;
  },
};
