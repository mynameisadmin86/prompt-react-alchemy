import { apiClient } from '../client';
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  description?: string;
}

export interface ProductCreateInput {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  description?: string;
}

export const productService = {
  async getProducts(params?: QueryParams): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: ProductCreateInput): Promise<ApiResponse<Product>> {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<ProductCreateInput>): Promise<ApiResponse<Product>> {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  }
};
