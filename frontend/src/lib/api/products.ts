import { apiClient, extractData } from './client';
import type {
  AuthResponse,
  PaginatedResponse,
  Product,
  ProductFilters,
  Review,
} from '../types';

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
      params: filters,
    });
    return extractData(response) as PaginatedResponse<Product>;
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get<Product>(`/products/slug/${slug}`);
    return extractData(response);
  },

  getRelated: async (slug: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/slug/${slug}/related`);
    return extractData(response);
  },

  search: async (query: string, page = 1, limit = 12): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
      params: { search: query, page, limit },
    });
    return extractData(response) as PaginatedResponse<Product>;
  },
};

export const reviewsApi = {
  getByProduct: async (productId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>(
      `/reviews/product/${productId}`,
      { params: { page, limit } },
    );
    return extractData(response) as PaginatedResponse<Review>;
  },

  create: async (data: { productId: string; rating: number; title?: string; comment?: string }) => {
    const response = await apiClient.post<Review>('/reviews', data);
    return extractData(response);
  },
};
