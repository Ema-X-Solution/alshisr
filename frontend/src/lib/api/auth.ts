import { apiClient, extractData } from './client';
import type { AuthResponse, User } from '../types';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return extractData(response);
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return extractData(response);
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return extractData(response);
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return extractData(response);
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    return extractData(response);
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.get('/auth/verify-email', { params: { token } });
    return extractData(response);
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return extractData(response);
  },
};

export const usersApi = {
  getProfile: async () => {
    const response = await apiClient.get<User>('/users/me');
    return extractData(response);
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.patch<User>('/users/me', data);
    return extractData(response);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.patch('/users/me/password', {
      currentPassword,
      newPassword,
    });
    return extractData(response);
  },

  getAddresses: async () => {
    const response = await apiClient.get('/users/me/addresses');
    return extractData(response);
  },

  createAddress: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/users/me/addresses', data);
    return extractData(response);
  },

  updateAddress: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.patch(`/users/me/addresses/${id}`, data);
    return extractData(response);
  },

  deleteAddress: async (id: string) => {
    const response = await apiClient.delete(`/users/me/addresses/${id}`);
    return extractData(response);
  },

  setDefaultAddress: async (id: string) => {
    const response = await apiClient.patch(`/users/me/addresses/${id}/default`);
    return extractData(response);
  },
};
