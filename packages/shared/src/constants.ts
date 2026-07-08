export const BRAND = {
  name: 'AL SHISR',
  nameAr: 'الشِصر',
  tagline: 'Luxury Redefined',
  taglineAr: 'الفخامة بأسلوب جديد',
} as const;

export const COLORS = {
  primary: '#5B2C83',
  secondary: '#C8A24A',
  lavender: '#8E5FBF',
  saffron: '#E67E22',
  olive: '#5F7D3A',
  sage: '#A8C686',
  ivory: '#F8F5EF',
  white: '#FFFFFF',
  text: '#2C2C2C',
  brown: '#7A4E2D',
  background: '#F8F5EF',
} as const;

export const API_VERSION = 'v1';

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

export const ORDER_STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  PENDING: { en: 'Pending', ar: 'قيد الانتظار' },
  PROCESSING: { en: 'Processing', ar: 'قيد المعالجة' },
  SHIPPING: { en: 'Shipping', ar: 'قيد الشحن' },
  DELIVERED: { en: 'Delivered', ar: 'تم التسليم' },
  CANCELLED: { en: 'Cancelled', ar: 'ملغي' },
  REFUNDED: { en: 'Refunded', ar: 'مسترد' },
};

export const PAYMENT_METHOD_LABELS: Record<string, { en: string; ar: string }> = {
  STRIPE: { en: 'Credit Card', ar: 'بطاقة ائتمان' },
  MYFATOORAH: { en: 'MyFatoorah', ar: 'ماي فاتورة' },
  COD: { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
};
