import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from './api';
import type {
  AnalyticsData,
  Banner,
  Blog,
  Brand,
  Category,
  ContactMessage,
  Coupon,
  DashboardStats,
  Faq,
  ListParams,
  LoginResponse,
  Notification,
  Order,
  OrderTimelineEvent,
  Page,
  PaginatedResponse,
  Product,
  Review,
  SettingsGrouped,
  Slider,
  Testimonial,
  User,
} from './types';

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiPost<LoginResponse>('/auth/login', { email, password }),
  logout: () => apiPost('/auth/logout'),
  getProfile: () => apiGet<User>('/users/me'),
};

// Admin Dashboard
export const adminApi = {
  getDashboard: () => apiGet<DashboardStats>('/admin/dashboard'),
  getAnalytics: (period = '30d') =>
    apiGet<AnalyticsData>('/admin/analytics', { period }),
};

// Products
export const productsApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedResponse<Product>>('/products', params),
  get: (id: string) => apiGet<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => apiPost<Product>('/products', data),
  update: (id: string, data: Partial<Product>) =>
    apiPatch<Product>(`/products/${id}`, data),
  delete: (id: string) => apiDelete(`/products/${id}`),
};

// Categories
export const categoriesApi = {
  list: async () => {
    const categories = await apiGet<Category[]>('/categories');
    const normalize = (items: Category[]): Category[] =>
      items.map((category) => ({
        ...category,
        productCount: category.productCount ?? category.productsCount ?? 0,
        children: category.children ? normalize(category.children) : undefined,
      }));
    return normalize(categories);
  },
  get: (id: string) => apiGet<Category>(`/categories/${id}`),
  create: (data: Partial<Category>) => apiPost<Category>('/categories', data),
  update: (id: string, data: Partial<Category>) =>
    apiPatch<Category>(`/categories/${id}`, data),
  delete: (id: string) => apiDelete(`/categories/${id}`),
};

// Brands
export const brandsApi = {
  list: async () => {
    const brands = await apiGet<Brand[]>('/brands');
    return brands.map((brand) => ({
      ...brand,
      productCount: brand.productCount ?? brand.productsCount ?? 0,
    }));
  },
  get: (id: string) => apiGet<Brand>(`/brands/${id}`),
  create: (data: Partial<Brand>) => apiPost<Brand>('/brands', data),
  update: (id: string, data: Partial<Brand>) =>
    apiPatch<Brand>(`/brands/${id}`, data),
  delete: (id: string) => apiDelete(`/brands/${id}`),
};

// Orders
export const ordersApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedResponse<Order>>('/orders', params),
  get: (id: string) => apiGet<Order>(`/orders/${id}`),
  getTimeline: (id: string) =>
    apiGet<OrderTimelineEvent[]>(`/orders/${id}/timeline`),
  updateStatus: (
    id: string,
    status: string,
    note?: string,
    trackingNumber?: string,
  ) =>
    apiPatch<Order>(`/orders/${id}/status`, { status, note, trackingNumber }),
};

// Users
export const usersApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedResponse<User>>('/users', params),
  get: (id: string) => apiGet<User>(`/users/${id}`),
  create: (data: Partial<User> & { password?: string }) =>
    apiPost<User>('/users', data),
  update: (id: string, data: Partial<User>) =>
    apiPatch<User>(`/users/${id}`, data),
  delete: (id: string) => apiDelete(`/users/${id}`),
};

// Coupons
export const couponsApi = {
  list: () => apiGet<Coupon[]>('/coupons'),
  get: (id: string) => apiGet<Coupon>(`/coupons/${id}`),
  create: (data: Partial<Coupon>) => apiPost<Coupon>('/coupons', data),
  update: (id: string, data: Partial<Coupon>) =>
    apiPatch<Coupon>(`/coupons/${id}`, data),
  delete: (id: string) => apiDelete(`/coupons/${id}`),
};

// CMS
export const cmsApi = {
  // Sliders
  listSliders: () => apiGet<Slider[]>('/cms/admin/sliders'),
  createSlider: (data: Partial<Slider>) =>
    apiPost<Slider>('/cms/sliders', data),
  updateSlider: (id: string, data: Partial<Slider>) =>
    apiPatch<Slider>(`/cms/sliders/${id}`, data),
  deleteSlider: (id: string) => apiDelete(`/cms/sliders/${id}`),

  // Banners
  listBanners: (position?: string) =>
    apiGet<Banner[]>('/cms/admin/banners', position ? { position } : undefined),
  createBanner: (data: Partial<Banner>) =>
    apiPost<Banner>('/cms/banners', data),
  updateBanner: (id: string, data: Partial<Banner>) =>
    apiPatch<Banner>(`/cms/banners/${id}`, data),
  deleteBanner: (id: string) => apiDelete(`/cms/banners/${id}`),

  // Blogs
  listBlogs: (params?: ListParams) =>
    apiGet<PaginatedResponse<Blog>>('/cms/admin/blogs', params),
  createBlog: (data: Partial<Blog>) => apiPost<Blog>('/cms/blogs', data),
  updateBlog: (id: string, data: Partial<Blog>) =>
    apiPatch<Blog>(`/cms/blogs/${id}`, data),
  deleteBlog: (id: string) => apiDelete(`/cms/blogs/${id}`),

  // Pages
  listPages: () => apiGet<Page[]>('/cms/admin/pages'),
  createPage: (data: Partial<Page>) => apiPost<Page>('/cms/pages', data),
  updatePage: (id: string, data: Partial<Page>) =>
    apiPatch<Page>(`/cms/pages/${id}`, data),
  deletePage: (id: string) => apiDelete(`/cms/pages/${id}`),

  // FAQs
  listFaqs: (category?: string) =>
    apiGet<Faq[]>('/cms/admin/faqs', category ? { category } : undefined),
  createFaq: (data: Partial<Faq>) => apiPost<Faq>('/cms/faqs', data),
  updateFaq: (id: string, data: Partial<Faq>) =>
    apiPatch<Faq>(`/cms/faqs/${id}`, data),
  deleteFaq: (id: string) => apiDelete(`/cms/faqs/${id}`),

  // Testimonials
  listTestimonials: () => apiGet<Testimonial[]>('/cms/admin/testimonials'),
  createTestimonial: (data: Partial<Testimonial>) =>
    apiPost<Testimonial>('/cms/testimonials', data),
  updateTestimonial: (id: string, data: Partial<Testimonial>) =>
    apiPatch<Testimonial>(`/cms/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => apiDelete(`/cms/testimonials/${id}`),
};

// Reviews
export const reviewsApi = {
  listPending: (params?: ListParams) =>
    apiGet<PaginatedResponse<Review>>('/reviews/pending', params),
  approve: (id: string) => apiPatch<Review>(`/reviews/${id}/approve`),
};

// Contact
export const contactApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedResponse<ContactMessage>>('/contact', params),
  markAsRead: (id: string) => apiPatch<ContactMessage>(`/contact/${id}/read`),
};

// Settings
export const settingsApi = {
  getAll: () => apiGet<SettingsGrouped>('/settings'),
  update: (settings: { group: string; key: string; value: string; type?: string }[]) =>
    apiPatch<SettingsGrouped>('/settings', { settings }),
};

// Notifications
export const notificationsApi = {
  list: (params?: ListParams) =>
    apiGet<PaginatedResponse<Notification>>('/notifications', params),
  markAsRead: (id: string) => apiPatch(`/notifications/${id}/read`),
  markAllAsRead: () => apiPatch('/notifications/read-all'),
};
