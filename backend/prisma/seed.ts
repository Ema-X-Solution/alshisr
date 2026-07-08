import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { slugify } from '@alshisr/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@alshisr.com' },
    update: {},
    create: {
      email: 'admin@alshisr.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'AL SHISR',
      role: 'SUPER_ADMIN',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Demo customer
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'أحمد',
      lastName: 'العلي',
      phone: '+966501234567',
      role: 'CUSTOMER',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('✅ Demo customer created:', customer.email);

  // Permissions
  const permissions = [
    { name: 'products.read', module: 'products', action: 'read' },
    { name: 'products.write', module: 'products', action: 'write' },
    { name: 'products.delete', module: 'products', action: 'delete' },
    { name: 'orders.read', module: 'orders', action: 'read' },
    { name: 'orders.write', module: 'orders', action: 'write' },
    { name: 'users.read', module: 'users', action: 'read' },
    { name: 'users.write', module: 'users', action: 'write' },
    { name: 'settings.read', module: 'settings', action: 'read' },
    { name: 'settings.write', module: 'settings', action: 'write' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: { ...perm, description: perm.name },
    });
  }
  console.log('✅ Permissions created');

  // Brands
  const brands = [
    { name: 'AL SHISR', nameAr: 'الشِصر', slug: 'al-shisr', description: 'Our signature luxury brand' },
    { name: 'Royal Heritage', nameAr: 'التراث الملكي', slug: 'royal-heritage', description: 'Timeless elegance' },
    { name: 'Desert Gold', nameAr: 'ذهب الصحراء', slug: 'desert-gold', description: 'Inspired by Arabian nights' },
  ];

  const createdBrands: Record<string, string> = {};
  for (const brand of brands) {
    const b = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
    createdBrands[brand.slug] = b.id;
  }
  console.log('✅ Brands created');

  // Categories
  const categories = [
    { name: 'Perfumes', nameAr: 'عطور', slug: 'perfumes', description: 'Luxury fragrances' },
    { name: 'Jewelry', nameAr: 'مجوهرات', slug: 'jewelry', description: 'Fine jewelry collection' },
    { name: 'Accessories', nameAr: 'إكسسوارات', slug: 'accessories', description: 'Premium accessories' },
    { name: 'Home Decor', nameAr: 'ديكور المنزل', slug: 'home-decor', description: 'Luxury home items' },
    { name: 'Watches', nameAr: 'ساعات', slug: 'watches', description: 'Exclusive timepieces' },
    { name: 'Gift Sets', nameAr: 'مجموعات هدايا', slug: 'gift-sets', description: 'Curated gift collections' },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = c.id;
  }
  console.log('✅ Categories created');

  // Products
  const products = [
    {
      name: 'Oud Royal Essence',
      nameAr: 'عود رويال إيسنس',
      slug: 'oud-royal-essence',
      description: 'A luxurious oud fragrance with notes of amber, sandalwood, and rose.',
      descriptionAr: 'عطر فاخر من العود مع نفحات العنبر والصندل والورد.',
      shortDescription: 'Premium oud fragrance',
      shortDescriptionAr: 'عطر عود فاخر',
      sku: 'AS-PERF-001',
      price: 1250,
      compareAtPrice: 1500,
      stock: 50,
      categoryId: createdCategories['perfumes'],
      brandId: createdBrands['al-shisr'],
      isFeatured: true,
      isBestSeller: true,
      tags: ['oud', 'luxury', 'arabic'],
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
    },
    {
      name: 'Gold Heritage Necklace',
      nameAr: 'قلادة التراث الذهبية',
      slug: 'gold-heritage-necklace',
      description: 'Handcrafted 18K gold necklace with traditional Arabic motifs.',
      descriptionAr: 'قلادة ذهبية عيار ١٨ مصنوعة يدوياً بنقوش عربية تقليدية.',
      shortDescription: '18K gold necklace',
      shortDescriptionAr: 'قلادة ذهب عيار ١٨',
      sku: 'AS-JEW-001',
      price: 8500,
      compareAtPrice: 10000,
      stock: 15,
      categoryId: createdCategories['jewelry'],
      brandId: createdBrands['royal-heritage'],
      isFeatured: true,
      isBestSeller: true,
      tags: ['gold', 'necklace', 'heritage'],
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
    },
    {
      name: 'Silk Arabian Scarf',
      nameAr: 'وشاح حريري عربي',
      slug: 'silk-arabian-scarf',
      description: 'Premium silk scarf with intricate geometric patterns.',
      descriptionAr: 'وشاح حريري فاخر بنقوش هندسية معقدة.',
      shortDescription: 'Premium silk scarf',
      shortDescriptionAr: 'وشاح حريري فاخر',
      sku: 'AS-ACC-001',
      price: 450,
      stock: 100,
      categoryId: createdCategories['accessories'],
      brandId: createdBrands['al-shisr'],
      isFeatured: true,
      tags: ['silk', 'scarf', 'accessories'],
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
    },
    {
      name: 'Desert Rose Candle',
      nameAr: 'شمعة وردة الصحراء',
      slug: 'desert-rose-candle',
      description: 'Hand-poured luxury candle with rose and oud scent.',
      descriptionAr: 'شمعة فاخرة مصنوعة يدوياً برائحة الورد والعود.',
      shortDescription: 'Luxury scented candle',
      shortDescriptionAr: 'شمعة عطرية فاخرة',
      sku: 'AS-HOME-001',
      price: 280,
      compareAtPrice: 350,
      stock: 75,
      categoryId: createdCategories['home-decor'],
      brandId: createdBrands['desert-gold'],
      isBestSeller: true,
      tags: ['candle', 'home', 'rose'],
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
    },
    {
      name: 'Chronograph Elite',
      nameAr: 'كرونوغراف إيليت',
      slug: 'chronograph-elite',
      description: 'Swiss-made chronograph with Arabic numeral dial.',
      descriptionAr: 'ساعة كرونوغراف سويسرية بقرص أرقام عربية.',
      shortDescription: 'Swiss chronograph watch',
      shortDescriptionAr: 'ساعة كرونوغراف سويسرية',
      sku: 'AS-WAT-001',
      price: 15000,
      compareAtPrice: 18000,
      stock: 8,
      categoryId: createdCategories['watches'],
      brandId: createdBrands['royal-heritage'],
      isFeatured: true,
      tags: ['watch', 'swiss', 'chronograph'],
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
    },
    {
      name: 'Royal Gift Collection',
      nameAr: 'مجموعة الهدايا الملكية',
      slug: 'royal-gift-collection',
      description: 'Curated luxury gift set with perfume, candle, and silk scarf.',
      descriptionAr: 'مجموعة هدايا فاخرة تضم عطر وشمعة ووشاح حريري.',
      shortDescription: 'Luxury gift set',
      shortDescriptionAr: 'مجموعة هدايا فاخرة',
      sku: 'AS-GIFT-001',
      price: 2200,
      compareAtPrice: 2800,
      stock: 30,
      categoryId: createdCategories['gift-sets'],
      brandId: createdBrands['al-shisr'],
      isFeatured: true,
      isBestSeller: true,
      tags: ['gift', 'collection', 'luxury'],
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
    },
  ];

  for (const product of products) {
    const { images, ...productData } = product;
    const p = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: productData,
    });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.upsert({
        where: { id: `${p.id}-img-${i}` },
        update: {},
        create: {
          id: `${p.id}-img-${i}`,
          productId: p.id,
          url: images[i],
          isPrimary: i === 0,
          sortOrder: i,
        },
      });
    }
  }
  console.log('✅ Products created');

  // Sliders
  const sliders = [
    {
      title: 'Luxury Redefined',
      titleAr: 'الفخامة بأسلوب جديد',
      subtitle: 'Discover our exclusive collection',
      subtitleAr: 'اكتشف مجموعتنا الحصرية',
      image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      link: '/shop',
      buttonText: 'Shop Now',
      buttonTextAr: 'تسوق الآن',
      sortOrder: 0,
    },
    {
      title: 'Arabian Heritage',
      titleAr: 'التراث العربي',
      subtitle: 'Timeless elegance meets modern luxury',
      subtitleAr: 'أناقة خالدة تلتقي بالفخامة العصرية',
      image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      link: '/about',
      buttonText: 'Learn More',
      buttonTextAr: 'اعرف المزيد',
      sortOrder: 1,
    },
  ];

  for (const slider of sliders) {
    await prisma.slider.create({ data: slider });
  }
  console.log('✅ Sliders created');

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah Al-Rashid',
      nameAr: 'سارة الراشد',
      role: 'VIP Customer',
      roleAr: 'عميلة مميزة',
      content: 'The quality and elegance of AL SHISR products is unmatched. Truly luxurious.',
      contentAr: 'جودة وأناقة منتجات الشِصر لا مثيل لها. فخامة حقيقية.',
      rating: 5,
      sortOrder: 0,
    },
    {
      name: 'Mohammed Al-Farsi',
      nameAr: 'محمد الفارسي',
      role: 'Collector',
      roleAr: 'جامع',
      content: 'Every piece tells a story of Arabian heritage and craftsmanship.',
      contentAr: 'كل قطعة تحكي قصة التراث العربي والحرفية.',
      rating: 5,
      sortOrder: 1,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log('✅ Testimonials created');

  // FAQs
  const faqs = [
    {
      question: 'What is your return policy?',
      questionAr: 'ما هي سياسة الإرجاع؟',
      answer: 'We offer a 30-day return policy for unused items in original packaging.',
      answerAr: 'نقدم سياسة إرجاع لمدة ٣٠ يوماً للمنتجات غير المستخدمة في عبوتها الأصلية.',
      category: 'returns',
      sortOrder: 0,
    },
    {
      question: 'Do you ship internationally?',
      questionAr: 'هل تشحنون دولياً؟',
      answer: 'Yes, we ship to over 50 countries worldwide with premium packaging.',
      answerAr: 'نعم، نشحن إلى أكثر من ٥٠ دولة حول العالم بتغليف فاخر.',
      category: 'shipping',
      sortOrder: 1,
    },
    {
      question: 'Are your products authentic?',
      questionAr: 'هل منتجاتكم أصلية؟',
      answer: 'All our products are 100% authentic with certificates of authenticity.',
      answerAr: 'جميع منتجاتنا أصلية ١٠٠٪ مع شهادات أصالة.',
      category: 'products',
      sortOrder: 2,
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }
  console.log('✅ FAQs created');

  // Pages
  const pages = [
    {
      title: 'About Us',
      titleAr: 'من نحن',
      slug: 'about',
      content: '<p>AL SHISR is an Omani brand specializing in premium organic Kashmiri saffron from Dhofar.</p>',
      contentAr: '<p>الشِصر علامة عُمانية متخصصة في الزعفران الكشميري العضوي الفاخر من ظفار.</p>',
    },
    {
      title: 'Privacy Policy',
      titleAr: 'سياسة الخصوصية',
      slug: 'privacy',
      content: '<h2>Privacy Policy</h2><p>Your privacy is important to us...</p>',
      contentAr: '<h2>سياسة الخصوصية</h2><p>خصوصيتك مهمة بالنسبة لنا...</p>',
    },
    {
      title: 'Terms of Service',
      titleAr: 'شروط الخدمة',
      slug: 'terms',
      content: '<h2>Terms of Service</h2><p>By using our services...</p>',
      contentAr: '<h2>شروط الخدمة</h2><p>باستخدام خدماتنا...</p>',
    },
    {
      title: 'Refund Policy',
      titleAr: 'سياسة الاسترداد',
      slug: 'refund-policy',
      content: '<h2>Refund Policy</h2><p>We want you to be completely satisfied...</p>',
      contentAr: '<h2>سياسة الاسترداد</h2><p>نريدك أن تكون راضياً تماماً...</p>',
    },
    {
      title: 'Shipping Policy',
      titleAr: 'سياسة الشحن',
      slug: 'shipping-policy',
      content: '<h2>Shipping Policy</h2><p>We offer premium shipping options...</p>',
      contentAr: '<h2>سياسة الشحن</h2><p>نقدم خيارات شحن فاخرة...</p>',
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log('✅ Pages created');

  // Coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off your first order',
      descriptionAr: 'خصم ١٠٪ على طلبك الأول',
      type: 'percentage',
      value: 10,
      minOrderAmount: 100,
      maxDiscount: 500,
      usageLimit: 1000,
      isActive: true,
    },
  });
  console.log('✅ Coupons created');

  // Shipping zones
  const zone = await prisma.shippingZone.upsert({
    where: { id: 'om-zone' },
    update: {},
    create: {
      id: 'om-zone',
      name: 'Oman',
      nameAr: 'سلطنة عمان',
      countries: ['OM'],
      isActive: true,
    },
  });

  await prisma.shippingRate.upsert({
    where: { id: 'om-standard' },
    update: {},
    create: {
      id: 'om-standard',
      zoneId: zone.id,
      name: 'Standard Shipping',
      nameAr: 'شحن عادي',
      price: 2,
      isActive: true,
    },
  });

  await prisma.shippingRate.upsert({
    where: { id: 'om-express' },
    update: {},
    create: {
      id: 'om-express',
      zoneId: zone.id,
      name: 'Express Shipping',
      nameAr: 'شحن سريع',
      price: 5,
      isActive: true,
    },
  });
  console.log('✅ Shipping zones created');

  // Settings
  const settings = [
    { group: 'general', key: 'site_name', value: 'AL SHISR', type: 'string' },
    { group: 'general', key: 'site_name_ar', value: 'الشِصر', type: 'string' },
    { group: 'general', key: 'tagline', value: 'Luxury Redefined', type: 'string' },
    { group: 'general', key: 'tagline_ar', value: 'الفخامة بأسلوب جديد', type: 'string' },
    { group: 'colors', key: 'primary', value: '#5B2C83', type: 'string' },
    { group: 'colors', key: 'secondary', value: '#C8A24A', type: 'string' },
    { group: 'colors', key: 'lavender', value: '#8E5FBF', type: 'string' },
    { group: 'colors', key: 'saffron', value: '#E67E22', type: 'string' },
    { group: 'colors', key: 'olive', value: '#5F7D3A', type: 'string' },
    { group: 'colors', key: 'sage', value: '#A8C686', type: 'string' },
    { group: 'colors', key: 'background', value: '#F8F5EF', type: 'string' },
    { group: 'colors', key: 'text', value: '#2C2C2C', type: 'string' },
    { group: 'colors', key: 'brown', value: '#7A4E2D', type: 'string' },
    { group: 'contact', key: 'email', value: 'info@alshisr.com', type: 'string' },
    { group: 'contact', key: 'phone', value: '+968 9000 0000', type: 'string' },
    { group: 'contact', key: 'address', value: 'Muscat, Sultanate of Oman', type: 'string' },
    { group: 'social', key: 'instagram', value: 'https://instagram.com/alshisr', type: 'string' },
    { group: 'social', key: 'twitter', value: 'https://twitter.com/alshisr', type: 'string' },
    { group: 'social', key: 'facebook', value: 'https://facebook.com/alshisr', type: 'string' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { group_key: { group: setting.group, key: setting.key } },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Settings created');

  // Email templates
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to AL SHISR',
      subjectAr: 'مرحباً بك في الشِصر',
      body: '<h1>Welcome {{firstName}}!</h1><p>Thank you for joining AL SHISR.</p>',
      bodyAr: '<h1>مرحباً {{firstName}}!</h1><p>شكراً لانضمامك إلى الشِصر.</p>',
      variables: ['firstName'],
    },
    {
      name: 'order_confirmation',
      subject: 'Order Confirmation - {{orderNumber}}',
      subjectAr: 'تأكيد الطلب - {{orderNumber}}',
      body: '<h1>Order Confirmed</h1><p>Your order {{orderNumber}} has been confirmed.</p>',
      bodyAr: '<h1>تم تأكيد الطلب</h1><p>تم تأكيد طلبك {{orderNumber}}.</p>',
      variables: ['orderNumber', 'firstName', 'total'],
    },
    {
      name: 'password_reset',
      subject: 'Reset Your Password',
      subjectAr: 'إعادة تعيين كلمة المرور',
      body: '<h1>Password Reset</h1><p>Click the link to reset your password: {{resetLink}}</p>',
      bodyAr: '<h1>إعادة تعيين كلمة المرور</h1><p>انقر على الرابط لإعادة تعيين كلمة المرور: {{resetLink}}</p>',
      variables: ['resetLink', 'firstName'],
    },
  ];

  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    });
  }
  console.log('✅ Email templates created');

  // Blog posts
  await prisma.blog.upsert({
    where: { slug: 'art-of-arabian-luxury' },
    update: {},
    create: {
      title: 'The Art of Arabian Luxury',
      titleAr: 'فن الفخامة العربية',
      slug: 'art-of-arabian-luxury',
      excerpt: 'Discover the rich heritage behind Arabian luxury goods.',
      excerptAr: 'اكتشف التراث الغني وراء السلع الفاخرة العربية.',
      content: '<p>Arabian luxury has a history spanning thousands of years...</p>',
      contentAr: '<p>الفخامة العربية لها تاريخ يمتد لآلاف السنين...</p>',
      author: 'AL SHISR Team',
      isPublished: true,
      publishedAt: new Date(),
      tags: ['luxury', 'heritage', 'arabic'],
    },
  });
  console.log('✅ Blog posts created');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
