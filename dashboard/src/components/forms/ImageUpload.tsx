'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { apiUpload } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder, className, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await apiUpload(file, folder);
      onChange(result.url);
      toast({ title: 'Image uploaded successfully' });
    } catch {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="flex items-center gap-4">
        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border bg-muted">
          {value ? (
            <Image src={value} alt="Upload" fill className="object-cover" />
          ) : (
            <HiOutlinePhotograph className="h-8 w-8 text-muted-foreground" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id={`upload-${label || 'image'}`}
            disabled={uploading}
          />
          <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
            <label htmlFor={`upload-${label || 'image'}`} className="cursor-pointer">
              {value ? 'Change Image' : 'Upload Image'}
            </label>
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => onChange('')}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
