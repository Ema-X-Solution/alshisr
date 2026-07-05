# AL SHISR — الشِصر

**منصة تجارة إلكترونية فاخرة** موجهة للسوق العربي، مع متجر للعملاء ولوحة تحكم إدارية كاملة وواجهة برمجية (API) موحدة.

| | |
|---|---|
| **الاسم** | AL SHISR — الشِصر |
| **الشعار** | Luxury Redefined — الفخامة بأسلوب جديد |
| **الإصدار** | 1.0.0 |
| **الترخيص** | ملكية خاصة — AL SHISR © 2026 |

---

## المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المميزات](#المميزات)
3. [التقنيات المستخدمة](#التقنيات-المستخدمة)
4. [هيكل المشروع](#هيكل-المشروع)
5. [قاعدة البيانات](#قاعدة-البيانات)
6. [وحدات الـ API](#وحدات-ال-api)
7. [صفحات المتجر](#صفحات-المتجر)
8. [لوحة التحكم](#لوحة-التحكم)
9. [المتغيرات البيئية](#المتغيرات-البيئية)
10. [التشغيل المحلي](#التشغيل-المحلي)
11. [أوامر npm](#أوامر-npm)
12. [النشر](#النشر)
13. [ألوان العلامة التجارية](#ألوان-العلامة-التجارية)
14. [الوثائق الإضافية](#الوثائق-الإضافية)

---

## نظرة عامة

المشروع عبارة عن **Monorepo** (مستودع واحد يضم عدة تطبيقات) يُدار عبر npm workspaces ويضم ثلاثة تطبيقات رئيسية:

| التطبيق | الوصف | المنفذ |
|---------|-------|--------|
| **frontend** | متجر العملاء (عربي/إنجليزي) | `3000` |
| **dashboard** | لوحة تحكم الإدارة | `3001` |
| **backend** | واجهة API مبنية بـ NestJS | `4000` |

بالإضافة إلى حزمة مشتركة `packages/shared` وإعدادات Docker وNginx وCI/CD.

```
┌─────────────┐     ┌─────────────┐
│  Frontend   │     │  Dashboard  │
│  (Next.js)  │     │  (Next.js)  │
│  :3000      │     │  :3001      │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │  REST API /api/v1
         ┌───────▼───────┐
         │    Backend    │
         │   (NestJS)    │
         │    :4000      │
         └───────┬───────┘
       ┌─────────┼─────────┐
       ▼         ▼         ▼
  PostgreSQL   Redis    Cloudinary
   (Prisma)  (BullMQ)  (صور)
```

---

## المميزات

### المتجر (Frontend)
- دعم لغتين: **العربية** (افتراضي) والإنجليزية عبر `next-intl`
- تصفح المنتجات، الفئات، العلامات التجارية، والعروض
- سلة تسوق، قائمة أمنيات، وبحث
- إتمام الطلب والدفع (Stripe / MyFatoorah / الدفع عند الاستلام)
- حساب المستخدم: الطلبات، الملف الشخصي، الإشعارات
- مدونة، أسئلة شائعة، تواصل، وسياسات (خصوصية، شحن، استرجاع)
- تسجيل دخول، تسجيل، Google OAuth، تأكيد البريد، استعادة كلمة المرور
- SEO: `sitemap.ts` و `robots.ts`

### لوحة التحكم (Dashboard)
- إحصائيات وتحليلات (إيرادات، طلبات، رسوم بيانية)
- إدارة المنتجات، الفئات، العلامات، الكوبونات
- إدارة الطلبات والعملاء والمستخدمين والصلاحيات
- إدارة المحتوى: بانرات، سلايدر، مدونة، صفحات، FAQ، آراء
- رسائل التواصل، النشرة البريدية، الإشعارات، الإعدادات

### الـ Backend
- REST API موحدة مع Swagger
- مصادقة JWT + Refresh Token
- صلاحيات حسب الدور (RBAC)
- رفع الصور عبر Cloudinary
- طوابير مهام عبر BullMQ + Redis
- بريد إلكتروني عبر SMTP
- Rate limiting عبر Throttler

---

## التقنيات المستخدمة

| الطبقة | التقنيات |
|--------|----------|
| **المتجر** | Next.js 15, React 19, TailwindCSS, Shadcn UI, Radix UI, TanStack Query, Framer Motion, Swiper, Zod |
| **لوحة التحكم** | Next.js 15, React 19, TailwindCSS, Shadcn UI, TanStack Table, Recharts |
| **الـ API** | NestJS 11, Prisma 6, PostgreSQL 16, Redis 7, BullMQ |
| **المصادقة** | Passport JWT, bcrypt, Google OAuth |
| **الدفع** | Stripe, MyFatoorah |
| **البنية التحتية** | Docker, Docker Compose, Nginx, PM2, GitHub Actions |

---

## هيكل المشروع

```
alshisr/
├── frontend/                    # متجر العملاء
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/        # صفحات متعددة اللغات
│   │   │   │   ├── page.tsx                 # الصفحة الرئيسية
│   │   │   │   ├── shop/                    # المتجر وصفحة المنتج
│   │   │   │   ├── categories/              # الفئات
│   │   │   │   ├── cart/                    # السلة
│   │   │   │   ├── checkout/                # إتمام الطلب
│   │   │   │   ├── orders/                  # الطلبات
│   │   │   │   ├── wishlist/                # قائمة الأمنيات
│   │   │   │   ├── profile/                 # الملف الشخصي
│   │   │   │   ├── notifications/           # الإشعارات
│   │   │   │   ├── search/                  # البحث
│   │   │   │   ├── blog/                    # المدونة
│   │   │   │   ├── faq/                     # الأسئلة الشائعة
│   │   │   │   ├── contact/                 # تواصل معنا
│   │   │   │   ├── about/                   # من نحن
│   │   │   │   ├── offers/                  # العروض
│   │   │   │   ├── privacy/                 # سياسة الخصوصية
│   │   │   │   ├── terms/                   # الشروط والأحكام
│   │   │   │   ├── shipping-policy/         # سياسة الشحن
│   │   │   │   ├── refund-policy/           # سياسة الاسترجاع
│   │   │   │   └── (auth)/                  # تسجيل دخول / تسجيل / استعادة كلمة المرور
│   │   │   ├── layout.tsx
│   │   │   ├── sitemap.ts
│   │   │   └── robots.ts
│   │   ├── components/
│   │   │   ├── auth/            # نماذج المصادقة
│   │   │   ├── cart/            # مكونات السلة
│   │   │   ├── checkout/        # الدفع وملخص الطلب
│   │   │   ├── home/            # أقسام الصفحة الرئيسية
│   │   │   ├── layout/          # Header, Footer
│   │   │   ├── shop/            # بطاقات المنتجات، فلاتر، معرض
│   │   │   ├── shared/          # مكونات مشتركة
│   │   │   └── ui/              # مكونات Shadcn UI
│   │   ├── lib/
│   │   │   ├── api/             # عميل API (auth, products, cart, orders, cms)
│   │   │   ├── hooks/           # useAuth, useCart, useWishlist
│   │   │   └── utils/
│   │   ├── messages/            # ar.json, en.json (الترجمة)
│   │   ├── i18n/                # إعدادات الترجمة
│   │   ├── providers/           # AuthProvider, QueryProvider
│   │   └── middleware.ts        # توجيه اللغة
│   └── package.json
│
├── dashboard/                   # لوحة التحكم الإدارية
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/    # تسجيل دخول المشرف
│   │   │   └── (dashboard)/
│   │   │       ├── page.tsx                 # لوحة الإحصائيات
│   │   │       ├── products/                # المنتجات (قائمة / إنشاء / تعديل)
│   │   │       ├── categories/              # الفئات
│   │   │       ├── brands/                  # العلامات التجارية
│   │   │       ├── orders/                  # الطلبات
│   │   │       ├── customers/               # العملاء
│   │   │       ├── users/                   # المستخدمون والصلاحيات
│   │   │       ├── coupons/                 # الكوبونات
│   │   │       ├── banners/                 # البانرات
│   │   │       ├── sliders/                 # السلايدر
│   │   │       ├── blogs/                   # المدونة
│   │   │       ├── pages/                   # الصفحات الثابتة
│   │   │       ├── faq/                     # الأسئلة الشائعة
│   │   │       ├── reviews/                 # آراء العملاء
│   │   │       ├── contact/                 # رسائل التواصل
│   │   │       ├── notifications/           # الإشعارات
│   │   │       └── settings/                # إعدادات الموقع
│   │   ├── components/
│   │   │   ├── dashboard/       # StatCard, RevenueChart, OrdersChart
│   │   │   ├── data-table/      # جداول البيانات
│   │   │   ├── forms/           # نماذج CRUD
│   │   │   ├── layout/          # Sidebar, Header, Breadcrumb
│   │   │   └── ui/
│   │   └── lib/                 # api, auth, services, types
│   └── package.json
│
├── backend/                     # واجهة API
│   ├── prisma/
│   │   ├── schema.prisma        # مخطط قاعدة البيانات
│   │   ├── migrations/          # ترحيلات Prisma
│   │   └── seed.ts              # بيانات أولية
│   ├── src/
│   │   ├── main.ts              # نقطة الدخول + Swagger
│   │   ├── app.module.ts
│   │   ├── prisma/              # PrismaService
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── dto/             # pagination
│   │   │   ├── filters/         # معالجة الأخطاء
│   │   │   ├── guards/          # RolesGuard
│   │   │   └── interceptors/    # logging, transform
│   │   └── modules/
│   │       ├── auth/            # مصادقة وتسجيل
│   │       ├── users/           # المستخدمون
│   │       ├── products/        # المنتجات
│   │       ├── categories/      # الفئات
│   │       ├── brands/          # العلامات
│   │       ├── cart/            # السلة
│   │       ├── wishlist/        # قائمة الأمنيات
│   │       ├── orders/          # الطلبات
│   │       ├── reviews/         # التقييمات
│   │       ├── coupons/         # الكوبونات
│   │       ├── cms/             # المحتوى (بانر، سلايدر، مدونة...)
│   │       ├── shipping/        # الشحن
│   │       ├── payments/        # الدفع (Stripe, MyFatoorah)
│   │       ├── upload/          # رفع الصور
│   │       ├── notifications/   # الإشعارات
│   │       ├── settings/        # الإعدادات
│   │       ├── contact/         # رسائل التواصل
│   │       ├── newsletter/      # النشرة البريدية
│   │       ├── admin/           # إحصائيات المشرف
│   │       └── health/          # فحص صحة الخدمة
│   └── package.json
│
├── packages/
│   └── shared/                  # أنواع وثوابت مشتركة
│       └── src/
│           ├── types.ts
│           ├── constants.ts     # ألوان العلامة، حالات الطلب، طرق الدفع
│           └── utils.ts
│
├── docker/
│   ├── docker-compose.yml       # PostgreSQL, Redis, Backend, Frontend, Dashboard, Nginx
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── Dockerfile.dashboard
│   └── entrypoint-backend.sh
│
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       ├── default.conf         # المتجر + API
│       └── admin.conf           # لوحة التحكم
│
├── scripts/
│   ├── deploy.sh                # نشر على VPS
│   ├── vps-fix.sh
│   └── fix-dockerfile-*.sh
│
├── docs/
│   ├── API.md                   # توثيق الـ API
│   └── DEPLOYMENT.md            # دليل النشر
│
├── .github/workflows/
│   └── ci.yml                   # CI/CD (build على main و develop)
│
├── .env.example                 # نموذج المتغيرات البيئية
├── ecosystem.config.js          # إعداد PM2 للإنتاج
├── package.json                 # جذر Monorepo
└── README.md
```

---

## قاعدة البيانات

قاعدة بيانات **PostgreSQL** تُدار عبر **Prisma ORM**.

### الجداول الرئيسية

| المجموعة | الجداول |
|----------|---------|
| **المستخدمون والصلاحيات** | `User`, `VerificationToken`, `PasswordReset`, `Permission`, `RolePermission` |
| **المنتجات** | `Brand`, `Category`, `Product`, `ProductImage`, `ProductVariant`, `ProductAttribute`, `RelatedProduct` |
| **التسوق** | `CartItem`, `WishlistItem`, `Coupon`, `Review` |
| **الطلبات** | `Order`, `OrderItem`, `OrderTimeline`, `Invoice`, `Address` |
| **المحتوى (CMS)** | `Banner`, `Slider`, `Blog`, `Page`, `Faq`, `Testimonial` |
| **التواصل** | `ContactMessage`, `Newsletter`, `Notification` |
| **الشحن والإعدادات** | `ShippingZone`, `ShippingRate`, `Setting`, `EmailTemplate` |
| **النظام** | `AuditLog` |

### الأدوار (Roles)

| الدور | الوصف |
|-------|-------|
| `SUPER_ADMIN` | صلاحيات كاملة |
| `ADMIN` | إدارة عامة |
| `MANAGER` | إدارة محدودة |
| `CUSTOMER` | عميل المتجر |

### حالات الطلب (OrderStatus)

`PENDING` → `PROCESSING` → `SHIPPING` → `DELIVERED`  
أو: `CANCELLED` / `REFUNDED`

### طرق الدفع (PaymentMethod)

| الطريقة | الوصف |
|---------|-------|
| `STRIPE` | بطاقة ائتمان |
| `MYFATOORAH` | ماي فاتورة |
| `COD` | الدفع عند الاستلام |

---

## وحدات الـ API

**الرابط الأساسي:** `http://localhost:4000/api/v1`  
**Swagger:** `http://localhost:4000/api/docs`

| الوحدة | المسار التقريبي | الوصف |
|--------|-----------------|-------|
| Auth | `/auth/*` | تسجيل، دخول، refresh، استعادة كلمة المرور، Google OAuth |
| Products | `/products` | عرض وإدارة المنتجات |
| Categories | `/categories` | الفئات |
| Brands | `/brands` | العلامات التجارية |
| Cart | `/cart` | سلة التسوق |
| Wishlist | `/wishlist` | قائمة الأمنيات |
| Orders | `/orders` | الطلبات |
| Reviews | `/reviews` | التقييمات |
| Coupons | `/coupons` | الكوبونات |
| CMS | `/cms/*` | بانرات، سلايدر، مدونة، صفحات، FAQ |
| Shipping | `/shipping` | مناطق وأسعار الشحن |
| Payments | `/payments` | Stripe / MyFatoorah webhooks |
| Upload | `/upload` | رفع الصور |
| Users | `/users` | إدارة المستخدمين |
| Admin | `/admin/*` | إحصائيات وتحليلات |
| Contact | `/contact` | رسائل التواصل |
| Newsletter | `/newsletter` | الاشتراك في النشرة |
| Notifications | `/notifications` | إشعارات المستخدم |
| Settings | `/settings` | إعدادات الموقع |
| Health | `/health` | فحص صحة الخدمة |

> للتفاصيل الكاملة راجع [docs/API.md](docs/API.md)

---

## صفحات المتجر

| المسار | الوصف |
|--------|-------|
| `/` | الصفحة الرئيسية (سلايدر، أفضل المبيعات، فئات، عروض، آراء) |
| `/shop` | قائمة المنتجات مع فلاتر |
| `/shop/[slug]` | صفحة منتج واحد |
| `/categories` | كل الفئات |
| `/categories/[slug]` | منتجات فئة معينة |
| `/offers` | العروض الخاصة |
| `/cart` | سلة التسوق |
| `/checkout` | إتمام الطلب والدفع |
| `/orders` | طلبات المستخدم |
| `/orders/[id]` | تفاصيل طلب |
| `/wishlist` | قائمة الأمنيات |
| `/profile` | الملف الشخصي |
| `/search` | البحث |
| `/blog` | المدونة |
| `/blog/[slug]` | مقال |
| `/faq` | الأسئلة الشائعة |
| `/contact` | تواصل معنا |
| `/about` | من نحن |
| `/login`, `/register` | المصادقة |
| `/privacy`, `/terms`, `/shipping-policy`, `/refund-policy` | الصفحات القانونية |

---

## لوحة التحكم

| القسم | الوظيفة |
|-------|---------|
| **Dashboard** | إحصائيات، إيرادات، رسوم بيانية للطلبات |
| **Products** | إنشاء وتعديل المنتجات (صور، متغيرات، سمات) |
| **Categories / Brands** | إدارة التصنيفات والعلامات |
| **Orders** | متابعة الطلبات وتحديث الحالة |
| **Customers** | عرض العملاء |
| **Users** | إدارة المشرفين والصلاحيات |
| **Coupons** | كوبونات الخصم |
| **Banners / Sliders** | المحتوى المرئي للصفحة الرئيسية |
| **Blogs / Pages / FAQ** | إدارة المحتوى النصي |
| **Reviews** | مراجعة تقييمات العملاء |
| **Contact** | رسائل التواصل الواردة |
| **Notifications** | إشعارات النظام |
| **Settings** | إعدادات عامة للموقع |

---

## المتغيرات البيئية

انسخ `.env.example` إلى `.env` وعدّل القيم:

```bash
cp .env.example .env
```

| المتغير | الوصف |
|---------|-------|
| `DATABASE_URL` | رابط اتصال PostgreSQL |
| `REDIS_HOST` / `REDIS_PORT` | Redis للطوابير والتخزين المؤقت |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | مفاتيح المصادقة |
| `CLOUDINARY_*` | رفع الصور |
| `SMTP_*` | إرسال البريد الإلكتروني |
| `STRIPE_*` | بوابة Stripe |
| `MYFATOORAH_*` | بوابة MyFatoorah |
| `GOOGLE_CLIENT_*` | تسجيل الدخول بـ Google |
| `NEXT_PUBLIC_API_URL` | رابط API للواجهات الأمامية |
| `FRONTEND_URL` / `DASHBOARD_URL` | عناوين CORS |

---

## التشغيل المحلي

### المتطلبات

- Node.js **20+**
- Docker و Docker Compose (لـ PostgreSQL و Redis)
- أو PostgreSQL 16 محلياً

### خطوات التشغيل

```bash
# 1. إعداد المتغيرات البيئية
cp .env.example .env

# 2. تشغيل PostgreSQL و Redis
npm run docker:up

# 3. تثبيت الحزم
npm install

# 4. إعداد قاعدة البيانات
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. تشغيل كل الخدمات معاً
npm run dev
```

### الروابط بعد التشغيل

| الخدمة | الرابط |
|--------|--------|
| المتجر | http://localhost:3000 |
| لوحة التحكم | http://localhost:3001 |
| API | http://localhost:4000 |
| Swagger | http://localhost:4000/api/docs |
| Prisma Studio | `npm run prisma:studio --workspace=backend` |

### بيانات الدخول الافتراضية (مشرف)

| | |
|---|---|
| **البريد** | `admin@alshisr.com` |
| **كلمة المرور** | `Admin@123456` |

---

## أوامر npm

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل Backend + Frontend + Dashboard معاً |
| `npm run dev:backend` | تشغيل API فقط |
| `npm run dev:frontend` | تشغيل المتجر فقط |
| `npm run dev:dashboard` | تشغيل لوحة التحكم فقط |
| `npm run build` | بناء كل المشاريع |
| `npm run db:generate` | توليد Prisma Client |
| `npm run db:migrate` | تطبيق ترحيلات قاعدة البيانات |
| `npm run db:seed` | إدخال البيانات الأولية |
| `npm run docker:up` | تشغيل Docker Compose |
| `npm run docker:down` | إيقاف الحاويات |
| `npm run docker:build` | بناء صور Docker |

---

## النشر

### Docker (موصى به)

```bash
npm run docker:build
npm run docker:up

# أول مرة: ترحيل و seed
docker exec alshisr-backend npx prisma migrate deploy
docker exec alshisr-backend npx prisma db seed
```

| الخدمة | المنفذ | الحاوية |
|--------|--------|---------|
| المتجر | 3000 | alshisr-frontend |
| لوحة التحكم | 3001 | alshisr-dashboard |
| API | 4000 | alshisr-backend |
| PostgreSQL | 5432 | alshisr-postgres |
| Redis | 6379 | alshisr-redis |
| Nginx | 80 | alshisr-nginx |

**توجيه Nginx:**
- `/` → المتجر
- `/admin` → لوحة التحكم
- `/api/` → الـ Backend

### PM2 (بدون Docker)

```bash
npm run build
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

### CI/CD

GitHub Actions في `.github/workflows/ci.yml` يبني Backend و Frontend و Dashboard عند الدفع على `main` و `develop`.

> للتفاصيل الكاملة راجع [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### فحص الصحة

```bash
curl http://localhost/api/v1/health
```

```json
{ "success": true, "data": { "status": "ok", "timestamp": "..." } }
```

---

## ألوان العلامة التجارية

| اللون | الكود | الاستخدام |
|-------|-------|-----------|
| Primary | `#5C1D16` | اللون الرئيسي (بورجوندي) |
| Secondary | `#C8A46B` | الذهبي |
| Background | `#FAF7F2` | خلفية الصفحة |
| Text | `#222222` | النص الأساسي |

---

## الوثائق الإضافية

| الملف | المحتوى |
|-------|---------|
| [docs/API.md](docs/API.md) | توثيق نقاط الـ API |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | دليل النشر على VPS و Docker و SSL |
| Swagger | http://localhost:4000/api/docs (تفاعلي) |

---

## الترخيص

**ملكية خاصة** — جميع الحقوق محفوظة لـ AL SHISR © 2026
