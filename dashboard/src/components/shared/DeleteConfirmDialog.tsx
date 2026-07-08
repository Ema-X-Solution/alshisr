'use client';

import { useTranslations } from 'next-intl';
import { HiOutlineExclamation } from 'react-icons/hi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  isLoading,
}: DeleteConfirmDialogProps) {
  const t = useTranslations('common');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="flex items-start gap-4 p-6 pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
            <HiOutlineExclamation className="h-6 w-6 text-destructive" />
          </div>
          <DialogHeader className="space-y-3 text-start">
            <DialogTitle className="text-base font-semibold leading-snug">
              {t('deleteConfirmTitle')}
            </DialogTitle>
            {itemName ? (
              <div className="space-y-2">
                <p className="rounded-md border bg-muted/60 px-3 py-2 text-sm font-medium text-foreground break-words">
                  {itemName}
                </p>
                <DialogDescription className="text-sm leading-relaxed">
                  {t('deleteConfirmDescription')}
                </DialogDescription>
              </div>
            ) : (
              <DialogDescription className="text-sm leading-relaxed">
                {t('deleteConfirmDescriptionGeneric')}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>
        <DialogFooter className="border-t bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="min-w-[5.5rem] bg-background"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="min-w-[5.5rem]"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
