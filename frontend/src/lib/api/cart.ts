import { apiClient, extractData } from './client';
import type { Cart, CartItem } from '../types';

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return extractData(response);
  },

  addItem: async (productId: string, quantity = 1, variantId?: string) => {
    const response = await apiClient.post<CartItem>('/cart', {
      productId,
      quantity,
      variantId,
    });
    return extractData(response);
  },

  updateItem: async (id: string, quantity: number) => {
    const response = await apiClient.patch<CartItem>(`/cart/${id}`, { quantity });
    return extractData(response);
  },

  removeItem: async (id: string) => {
    const response = await apiClient.delete(`/cart/${id}`);
    return extractData(response);
  },

  clear: async () => {
    const response = await apiClient.delete('/cart/clear');
    return extractData(response);
  },
};
