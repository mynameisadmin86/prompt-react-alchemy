import { create } from 'zustand';
import { productService, type Product, type ProductCreateInput } from '@/api/services/productService';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface ProductState {
  product: Partial<Product>;
  loading: boolean;
  error: string | null;
  validationResult: ValidationResult;

  // Actions
  updateField: (field: keyof Product, value: any) => void;
  updateMultipleFields: (updates: Partial<Product>) => void;
  setValidationResult: (result: ValidationResult) => void;
  loadProduct: (id: string) => Promise<void>;
  saveProduct: () => Promise<void>;
  reset: () => void;
}

const initialProduct: Partial<Product> = {
  name: '',
  category: '',
  price: 0,
  stock: 0,
  status: 'active',
  description: ''
};

export const useProductStore = create<ProductState>((set, get) => ({
  product: { ...initialProduct },
  loading: false,
  error: null,
  validationResult: { isValid: true, errors: {} },

  updateField: (field, value) => {
    set((state) => ({
      product: { ...state.product, [field]: value }
    }));
  },

  updateMultipleFields: (updates) => {
    set((state) => ({
      product: { ...state.product, ...updates }
    }));
  },

  setValidationResult: (result) => {
    set({ validationResult: result });
  },

  loadProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await productService.getProductById(id);
      set({ product: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error?.message || 'Failed to load product', 
        loading: false 
      });
    }
  },

  saveProduct: async () => {
    set({ loading: true, error: null });
    try {
      const { product } = get();
      
      if (product.id) {
        await productService.updateProduct(product.id, product as ProductCreateInput);
      } else {
        await productService.createProduct(product as ProductCreateInput);
      }
      
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error?.message || 'Failed to save product', 
        loading: false 
      });
      throw error;
    }
  },

  reset: () => {
    set({
      product: { ...initialProduct },
      loading: false,
      error: null,
      validationResult: { isValid: true, errors: {} }
    });
  }
}));
