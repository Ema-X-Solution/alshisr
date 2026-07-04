'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
  HiOutlineDocumentText,
  HiOutlineDocument,
  HiOutlineQuestionMarkCircle,
  HiOutlineMail,
  HiOutlineCog,
  HiOutlineBell,
} from 'react-icons/hi';

const navItems = [
  { href: '/', label: 'Dashboard', icon: HiOutlineHome },
  { href: '/products', label: 'Products', icon: HiOutlineShoppingBag },
  { href: '/categories', label: 'Categories', icon: HiOutlineTag },
  { href: '/brands', label: 'Brands', icon: HiOutlineStar },
  { href: '/orders', label: 'Orders', icon: HiOutlineClipboardList },
  { href: '/customers', label: 'Customers', icon: HiOutlineUsers },
  { href: '/users', label: 'Users', icon: HiOutlineUserGroup },
  { href: '/coupons', label: 'Coupons', icon: HiOutlineTicket },
  { href: '/banners', label: 'Banners', icon: HiOutlinePhotograph },
  { href: '/sliders', label: 'Sliders', icon: HiOutlineViewGrid },
  { href: '/reviews', label: 'Reviews', icon: HiOutlineChatAlt2 },
  { href: '/blogs', label: 'Blogs', icon: HiOutlineDocumentText },
  { href: '/pages', label: 'Pages', icon: HiOutlineDocument },
  { href: '/faq', label: 'FAQ', icon: HiOutlineQuestionMarkCircle },
  { href: '/contact', label: 'Contact', icon: HiOutlineMail },
  { href: '/settings', label: 'Settings', icon: HiOutlineCog },
  { href: '/notifications', label: 'Notifications', icon: HiOutlineBell },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

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
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              AS
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">AL SHISR</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
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
                    {item.label}
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
