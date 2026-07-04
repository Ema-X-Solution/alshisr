import { apiClient, extractData } from './client';
import type { Order, PaginatedResponse, PaymentMethod, AddressSnapshot } from '../types';

export interface CreateOrderData {
  paymentMethod: PaymentMethod;
  shippingAddress: AddressSnapshot;
  billingAddress?: AddressSnapshot;
  couponCode?: string;
  notes?: string;
  shippingRateId?: string;
  shippingCost?: number;
}

export const ordersApi = {
  getAll: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>('/orders', {
      params: { page, limit, status },
    });
    return extractData(response) as PaginatedResponse<Order>;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return extractData(response);
  },

  getTimeline: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}/timeline`);
    return extractData(response);
  },

  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return extractData(response);
  },
};
