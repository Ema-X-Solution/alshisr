'use client';

import { useLocale, useTranslations } from 'next-intl';
import { HiOutlineMenu, HiOutlineLogout } from 'react-icons/hi';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { clearAuth, getStoredUser } from '@/lib/auth';
import { authApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('common');
  const { toast } = useToast();
  const user = getStoredUser();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout errors
    }
    clearAuth();
    toast({ title: t('loggedOut') });
    router.push('/login');
  };

  const switchLocale = (newLocale: 'ar' | 'en') => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  const dropdownContentClass =
    'border-border bg-card text-foreground shadow-lg';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <HiOutlineMenu className="h-5 w-5" />
        </Button>
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs uppercase"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <span className="hidden text-sm sm:inline">
                {user?.firstName} {user?.lastName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn('w-56', dropdownContentClass)}>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.firstName} {user?.lastName}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <HiOutlineLogout className="me-2 h-4 w-4" />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
