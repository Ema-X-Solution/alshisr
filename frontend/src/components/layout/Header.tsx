'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from '@/components/shared/BrandLogo';

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/shop', labelKey: 'shop' },
  { href: '/categories', labelKey: 'categories' },
  { href: '/offers', labelKey: 'offers' },
  { href: '/about', labelKey: 'about' },
  { href: '/blog', labelKey: 'blog' },
  { href: '/contact', labelKey: 'contact' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const switchLocale = (newLocale: 'ar' | 'en') => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  const dropdownContentClass =
    'w-48 border-border bg-background/95 text-foreground shadow-lg backdrop-blur-sm';

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        <Link href="/" className="shrink-0">
          <BrandLogo locale={locale as 'ar' | 'en'} priority />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary',
                pathname === link.href && 'text-primary',
              )}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} aria-label={tCommon('search')}>
            <FiSearch className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-xs uppercase md:flex"
                aria-label={t('language')}
              >
                {locale === 'ar' ? t('english') : t('arabic')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={dropdownContentClass}>
              <DropdownMenuItem
                onClick={() => switchLocale('ar')}
                className="justify-between gap-2"
              >
                <span>{t('arabic')}</span>
                {locale === 'ar' && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchLocale('en')}
                className="justify-between gap-2"
              >
                <span>{t('english')}</span>
                {locale === 'en' && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/wishlist" className="relative">
            <Button variant="ghost" size="icon" aria-label={t('wishlist')}>
              <FiHeart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label={t('cart')}>
              <FiShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('account')}>
                <FiUser className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={dropdownContentClass}>
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem className="text-muted-foreground" disabled>
                    {user?.firstName} {user?.lastName}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="w-full cursor-pointer">
                      {t('orders')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="w-full cursor-pointer">
                      {t('notifications')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>{t('logout')}</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full cursor-pointer">
                      {t('login')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="w-full cursor-pointer">
                      {t('register')}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <FiMenu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === 'ar' ? 'right' : 'left'} className="w-72">
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-primary',
                      pathname === link.href && 'text-primary',
                    )}
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => switchLocale(locale === 'ar' ? 'en' : 'ar')}
                  className="text-start text-lg font-medium text-muted-foreground hover:text-primary"
                >
                  {locale === 'ar' ? t('english') : t('arabic')}
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60"
          >
            <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl gap-2 px-4 py-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tCommon('searchPlaceholder')}
                className="flex-1"
                autoFocus
              />
              <Button type="submit">{tCommon('search')}</Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <FiX className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
