'use client';

import { useRouter } from 'next/navigation';
import { HiOutlineMenu, HiOutlineLogout } from 'react-icons/hi';
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

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const user = getStoredUser();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout errors
    }
    clearAuth();
    toast({ title: 'Logged out successfully' });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <HiOutlineMenu className="h-5 w-5" />
        </Button>
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <span className="hidden sm:inline text-sm">
              {user?.firstName} {user?.lastName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.firstName} {user?.lastName}</span>
              <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <HiOutlineLogout className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
