export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  ordersCount?: number;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DashboardStats {
  revenue: { total: number; thisMonth: number };
  orders: { total: number; today: number; pending: number };
  customers: number;
  products: number;
  lowStockProducts: number;
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  customer: { firstName: string; lastName: string; email: string };
}

export interface AnalyticsData {
  period: string;
  summary: {
    totalOrders: number;
    paidOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  orderStatusBreakdown: { status: string; count: number }[];
  topProducts: {
    productId: string;
    name: string;
    quantitySold: number;
    revenue: number;
  }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  hasVariants: boolean;
  categoryId: string;
  brandId?: string;
  metaTitle?: string;
  metaTitleAr?: string;
  metaDescription?: string;
  metaDescriptionAr?: string;
  tags?: string[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  category?: Category;
  brand?: Brand;
  createdAt?: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  attributes: Record<string, string>;
  isActive?: boolean;
}

export interface ProductAttribute {
  name: string;
  nameAr: string;
  value: string;
  valueAr: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  productsCount?: number;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  logo?: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  productsCount?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  items?: OrderItem[];
  shippingAddress?: AddressSnapshot;
  billingAddress?: AddressSnapshot;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface AddressSnapshot {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

export interface OrderTimelineEvent {
  id: string;
  status: string;
  note?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
}

export interface Slider {
  id: string;
  title: string;
  titleAr: string;
  subtitle?: string;
  subtitleAr?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  buttonTextAr?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Banner {
  id: string;
  title: string;
  titleAr: string;
  subtitle?: string;
  subtitleAr?: string;
  image: string;
  link?: string;
  position?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Blog {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  excerpt?: string;
  excerptAr?: string;
  content: string;
  contentAr: string;
  image?: string;
  author?: string;
  isPublished: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  createdAt?: string;
}

export interface Page {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  content: string;
  contentAr: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
}

export interface Faq {
  id: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  category?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  nameAr?: string;
  role?: string;
  roleAr?: string;
  content: string;
  contentAr: string;
  avatar?: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
  user?: User;
  product?: { id: string; name: string; slug: string };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export type SettingsGrouped = Record<
  string,
  Record<string, { value: unknown; type: string }>
>;

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}
