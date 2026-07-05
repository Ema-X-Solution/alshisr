import type { Locale } from '@/i18n/routing';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  isActive: boolean;
}

export interface ProductAttribute {
  id: string;
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
  children?: Category[];
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  logo?: string;
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
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  hasVariants: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  brand?: Brand;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  user: { firstName: string; lastName: string; avatar?: string };
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  variantId?: string;
  product: Product;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'STRIPE' | 'MYFATOORAH' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  name: string;
  nameAr: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  couponCode?: string;
  notes?: string;
  shippingAddress: AddressSnapshot;
  billingAddress?: AddressSnapshot;
  trackingNumber?: string;
  items: OrderItem[];
  timeline?: OrderTimeline[];
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
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
}

export interface Banner {
  id: string;
  title: string;
  titleAr: string;
  subtitle?: string;
  subtitleAr?: string;
  image: string;
  link?: string;
  position: string;
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
  publishedAt?: string;
  tags: string[];
  viewCount: number;
  createdAt?: string;
  updatedAt?: string;
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
}

export interface Faq {
  id: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  category?: string;
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
}

export interface Notification {
  id: string;
  title: string;
  titleAr?: string;
  message: string;
  messageAr?: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  nameAr: string;
  countries: string[];
  rates: ShippingRate[];
}

export interface ShippingRate {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  estimatedDays?: number;
}

export interface CouponValidation {
  valid: boolean;
  coupon?: {
    code: string;
    type: string;
    value: number;
    discount: number;
  };
  message?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categoryId?: string;
  brand?: string;
  brandId?: string;
  featured?: boolean;
  bestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function localizedField(
  item: object,
  field: string,
  locale: Locale,
): string {
  const record = item as Record<string, unknown>;
  const arField = `${field}Ar`;
  if (locale === 'ar' && arField in record && record[arField]) {
    return String(record[arField]);
  }
  return String(record[field] ?? '');
}

export function formatPrice(amount: number, locale: Locale = 'ar'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPriceAmount(amount: number, locale: Locale = 'ar'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getProductImage(product: Product): string {
  const primary = product.images?.find((img) => img.isPrimary);
  return primary?.url || product.images?.[0]?.url || '/placeholder-product.jpg';
}

export function getDiscountPercent(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
