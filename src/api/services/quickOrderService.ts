import { apiClient } from '@/api/client';
import { ApiResponse, PaginatedResponse } from '@/api/types';

export interface QuickOrderSearchParams {
  [key: string]: any;
  orderType?: string;
  supplier?: string;
  contract?: string;
  cluster?: string;
  customer?: string;
  customerSupplierRefNo?: string;
  draftBillNo?: string;
  departurePoint?: string;
  arrivalPoint?: string;
  serviceType?: string;
  serviceFromDate?: string;
  serviceToDate?: string;
  quickUniqueId?: string;
  quickOrderNo?: string;
  draftBillStatus?: string;
  isBillingFailed?: boolean | string;
  subService?: string;
  wbs?: string;
  operationalLocation?: string;
  primaryRefDoc?: string;
  createdBy?: string;
  secondaryDoc?: string;
  invoiceNo?: string;
  invoiceStatus?: string;
  resourceType?: string;
  wagon?: string;
  container?: string;
  fromOrderDate?: string;
  page?: number;
  limit?: number;
}

export interface QuickOrderData {
  id: string;
  orderType: string;
  supplier: string;
  contract: string;
  cluster: string;
  customer: string;
  customerSupplierRefNo: string;
  draftBillNo: string;
  departurePoint: string;
  arrivalPoint: string;
  serviceType: string;
  serviceFromDate: string;
  serviceToDate: string;
  quickUniqueId: string;
  quickOrderNo: string;
  draftBillStatus: string;
  isBillingFailed: boolean;
  subService: string;
  wbs: string;
  operationalLocation: string;
  primaryRefDoc: string;
  createdBy: string;
  secondaryDoc: string;
  invoiceNo: string;
  invoiceStatus: string;
  resourceType: string;
  wagon: string;
  container: string;
  fromOrderDate: string;
  [key: string]: any;
}

class QuickOrderService {
  private readonly baseUrl = 'https://c5x9m1w2-3001.inc1.devtunnels.ms/coreapiops/v1/quickorderhub';

  async searchOrders(params: QuickOrderSearchParams = {}): Promise<ApiResponse<QuickOrderData[]>> {
    try {
      console.log('Making API call to search orders with params:', params);
      
      // Remove empty values from params
      const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanParams)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle ResponseData/ResponseResult structure
      if (data.ResponseData && data.ResponseData.ResponseResult) {
        return {
          success: true,
          data: data.ResponseData.ResponseResult,
          message: 'Orders retrieved successfully'
        };
      } else if (data.ResponseResult && Array.isArray(data.ResponseResult)) {
        return {
          success: true,
          data: data.ResponseResult,
          message: 'Orders retrieved successfully'
        };
      } else if (data.success !== undefined) {
        return data;
      } else if (Array.isArray(data)) {
        return {
          success: true,
          data: data,
          message: 'Orders retrieved successfully'
        };
      } else if (data.data && Array.isArray(data.data)) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Orders retrieved successfully'
        };
      } else {
        return {
          success: true,
          data: [],
          message: 'No orders found'
        };
      }
    } catch (error) {
      console.error('QuickOrderService.searchOrders error:', error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<ApiResponse<QuickOrderData>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('QuickOrderService.getOrderById error:', error);
      throw error;
    }
  }

  async createOrder(orderData: Partial<QuickOrderData>): Promise<ApiResponse<QuickOrderData>> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('QuickOrderService.createOrder error:', error);
      throw error;
    }
  }

  async updateOrder(id: string, orderData: Partial<QuickOrderData>): Promise<ApiResponse<QuickOrderData>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('QuickOrderService.updateOrder error:', error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('QuickOrderService.deleteOrder error:', error);
      throw error;
    }
  }
}

export const quickOrderService = new QuickOrderService();