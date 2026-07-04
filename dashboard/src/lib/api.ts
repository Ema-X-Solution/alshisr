import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setAuth, clearAuth, getStoredUser } from './auth';
import type { ApiResponse, LoginResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuth();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<ApiResponse<LoginResponse>>(
          `${API_URL}/auth/refresh`,
          { refreshToken },
        );
        const { accessToken, refreshToken: newRefreshToken } = data.data;
        const user = getStoredUser();
        if (user) setAuth(accessToken, newRefreshToken, user);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export async function apiGet<T>(url: string, params?: Record<string, unknown>) {
  const { data } = await api.get<ApiResponse<T>>(url, { params });
  return data.data;
}

export async function apiPost<T>(url: string, body?: unknown) {
  const { data } = await api.post<ApiResponse<T>>(url, body);
  return data.data;
}

export async function apiPatch<T>(url: string, body?: unknown) {
  const { data } = await api.patch<ApiResponse<T>>(url, body);
  return data.data;
}

export async function apiDelete<T>(url: string, body?: unknown) {
  const { data } = await api.delete<ApiResponse<T>>(url, { data: body });
  return data.data;
}

export async function apiUpload(file: File, folder?: string) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<ApiResponse<{ url: string; publicId: string }>>(
    '/upload/image',
    formData,
    {
      params: folder ? { folder } : undefined,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return data.data;
}
