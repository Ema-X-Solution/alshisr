import { apiClient, extractData } from './client';
import type {
  Banner,
  Blog,
  Faq,
  Page,
  PaginatedResponse,
  Slider,
  Testimonial,
} from '../types';

export const cmsApi = {
  getSliders: async () => {
    const response = await apiClient.get<Slider[]>('/cms/sliders');
    return extractData(response);
  },

  getBanners: async (position?: string) => {
    const response = await apiClient.get<Banner[]>('/cms/banners', {
      params: position ? { position } : undefined,
    });
    return extractData(response);
  },

  getBlogs: async (page = 1, limit = 12) => {
    const response = await apiClient.get<PaginatedResponse<Blog>>('/cms/blogs', {
      params: { page, limit },
    });
    return extractData(response);
  },

  getBlogBySlug: async (slug: string) => {
    const response = await apiClient.get<Blog>(`/cms/blogs/slug/${slug}`);
    return extractData(response);
  },

  getPages: async () => {
    const response = await apiClient.get<Page[]>('/cms/pages');
    return extractData(response);
  },

  getPageBySlug: async (slug: string) => {
    const response = await apiClient.get<Page>(`/cms/pages/slug/${slug}`);
    return extractData(response);
  },

  getFaqs: async (category?: string) => {
    const response = await apiClient.get<Faq[]>('/cms/faqs', {
      params: category ? { category } : undefined,
    });
    return extractData(response);
  },

  getTestimonials: async () => {
    const response = await apiClient.get<Testimonial[]>('/cms/testimonials');
    return extractData(response);
  },
};

export const categoriesApi = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return extractData(response);
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return extractData(response);
  },
};

export const contactApi = {
  submit: async (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    const response = await apiClient.post('/contact', data);
    return extractData(response);
  },
};

export const newsletterApi = {
  subscribe: async (email: string) => {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return extractData(response);
  },
};

export const settingsApi = {
  getPublic: async () => {
    const response = await apiClient.get<Record<string, Record<string, unknown>>>('/settings/public');
    return extractData(response);
  },
};

export const shippingApi = {
  getZones: async () => {
    const response = await apiClient.get('/shipping/zones');
    return extractData(response);
  },

  calculate: async (data: { zoneId: string; rateId?: string; subtotal?: number }) => {
    const response = await apiClient.post('/shipping/calculate', data);
    return extractData(response);
  },
};

export const couponsApi = {
  validate: async (code: string, subtotal: number) => {
    const response = await apiClient.post('/coupons/validate', { code, subtotal });
    return extractData(response);
  },
};

export const notificationsApi = {
  getAll: async (page = 1, limit = 20) => {
    const response = await apiClient.get('/notifications', { params: { page, limit } });
    return extractData(response);
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return extractData(response);
  },

  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return extractData(response);
  },
};

export const wishlistApi = {
  get: async () => {
    const response = await apiClient.get('/wishlist');
    return extractData(response);
  },

  add: async (productId: string) => {
    const response = await apiClient.post('/wishlist', { productId });
    return extractData(response);
  },

  toggle: async (productId: string) => {
    const response = await apiClient.post('/wishlist/toggle', { productId });
    return extractData(response);
  },

  remove: async (productId: string) => {
    const response = await apiClient.delete(`/wishlist/${productId}`);
    return extractData(response);
  },
};
