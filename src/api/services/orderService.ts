import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { ApiResponse, PaginatedResponse, QueryParams, Order, OrderCreateInput, OrderUpdateInput } from '../types';

export const orderService = {
  // Get orders with filtering, sorting, and pagination
  getOrders: async (params?: QueryParams): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.LIST, { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.LIST}/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (data: OrderCreateInput): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, data);
    return response.data;
  },

  // Update order
  updateOrder: async (id: string, data: OrderUpdateInput): Promise<ApiResponse<Order>> => {
    const response = await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE(id), data);
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(id));
    return response.data;
  },

  // Process order
  processOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.PROCESS(id));
    return response.data;
  },
};
