'use client';

import { useLocale, useTranslations } from 'next-intl';
import { BRAND } from '@alshisr/shared';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Link, usePathname } from '@/i18n/navigation';
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineStar,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineTicket,
  HiOutlinePhotograph,
  HiOutlineViewGrid,
  HiOutlineChatAlt2,
  HiOutlineAnnotation,
  HiOutlineDocumentText,
  HiOutlineDocument,
  HiOutlineQuestionMarkCircle,
  HiOutlineMail,
  HiOutlineCog,
  HiOutlineBell,
} from 'react-icons/hi';

const navItems = [
  { href: '/', labelKey: 'dashboard' as const, icon: HiOutlineHome },
  { href: '/products', labelKey: 'products' as const, icon: HiOutlineShoppingBag },
  { href: '/categories', labelKey: 'categories' as const, icon: HiOutlineTag },
  { href: '/brands', labelKey: 'brands' as const, icon: HiOutlineStar },
  { href: '/orders', labelKey: 'orders' as const, icon: HiOutlineClipboardList },
  { href: '/customers', labelKey: 'customers' as const, icon: HiOutlineUsers },
  { href: '/users', labelKey: 'users' as const, icon: HiOutlineUserGroup },
  { href: '/coupons', labelKey: 'coupons' as const, icon: HiOutlineTicket },
  { href: '/banners', labelKey: 'banners' as const, icon: HiOutlinePhotograph },
  { href: '/sliders', labelKey: 'sliders' as const, icon: HiOutlineViewGrid },
  { href: '/reviews', labelKey: 'reviews' as const, icon: HiOutlineChatAlt2 },
  { href: '/testimonials', labelKey: 'testimonials' as const, icon: HiOutlineAnnotation },
  { href: '/blogs', labelKey: 'blogs' as const, icon: HiOutlineDocumentText },
  { href: '/pages', labelKey: 'pages' as const, icon: HiOutlineDocument },
  { href: '/faq', labelKey: 'faq' as const, icon: HiOutlineQuestionMarkCircle },
  { href: '/contact', labelKey: 'contact' as const, icon: HiOutlineMail },
  { href: '/settings', labelKey: 'settings' as const, icon: HiOutlineCog },
  { href: '/notifications', labelKey: 'notifications' as const, icon: HiOutlineBell },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const isRtl = locale === 'ar';

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0',
          isRtl ? 'right-0 border-r-0 border-l' : 'left-0',
          open ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo priority />
            <div>
              <p className="font-semibold text-sm leading-tight">
                {isRtl ? BRAND.nameAr || BRAND.name : BRAND.name}
              </p>
              <p className="text-xs text-muted-foreground">{tCommon('adminPanel')}</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
