'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { useFormNavigation } from '@/hooks/use-form-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSection, FormActions } from './FormSection';
import { ImageUpload } from './ImageUpload';
import { productsApi, categoriesApi, brandsApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Product } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  shortDescription: z.string().optional(),
  shortDescriptionAr: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional(),
  costPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0).default(0),
  lowStockThreshold: z.coerce.number().min(0).default(5),
  weight: z.coerce.number().min(0).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  hasVariants: z.boolean().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
  metaTitle: z.string().optional(),
  metaTitleAr: z.string().optional(),
  metaDescription: z.string().optional(),
  metaDescriptionAr: z.string().optional(),
  tags: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    sortOrder: z.number().optional(),
    isPrimary: z.boolean().optional(),
  })).optional(),
  variants: z.array(z.object({
    sku: z.string(),
    price: z.coerce.number().min(0),
    compareAtPrice: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().min(0).optional(),
    attributes: z.record(z.string()),
    isActive: z.boolean().optional(),
  })).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { navigateAfterSave } = useFormNavigation();
  const { toast } = useToast();
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');
  const isEdit = !!product;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandsApi.list,
  });

  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      nameAr: product?.nameAr || '',
      slug: product?.slug || '',
      description: product?.description || '',
      descriptionAr: product?.descriptionAr || '',
      shortDescription: product?.shortDescription || '',
      shortDescriptionAr: product?.shortDescriptionAr || '',
      sku: product?.sku || '',
      price: product?.price || 0,
      compareAtPrice: product?.compareAtPrice ?? undefined,
      costPrice: product?.costPrice ?? undefined,
      stock: product?.stock || 0,
      lowStockThreshold: product?.lowStockThreshold || 5,
      weight: product?.weight,
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      isBestSeller: product?.isBestSeller ?? false,
      hasVariants: product?.hasVariants ?? false,
      categoryId: product?.categoryId || '',
      brandId: product?.brandId || '',
      metaTitle: product?.metaTitle || '',
      metaTitleAr: product?.metaTitleAr || '',
      metaDescription: product?.metaDescription || '',
      metaDescriptionAr: product?.metaDescriptionAr || '',
      tags: product?.tags?.join(', ') || '',
      images: product?.images || [],
      variants: product?.variants?.map((v) => ({
        ...v,
        compareAtPrice: v.compareAtPrice ?? undefined,
      })) || [],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: 'images' });
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({ control, name: 'variants' });
  const hasVariants = watch('hasVariants');

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        ...data,
        compareAtPrice: data.compareAtPrice && data.compareAtPrice > 0 ? data.compareAtPrice : null,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        brandId: data.brandId || undefined,
        variants: data.variants?.map((v) => ({
          ...v,
          compareAtPrice: v.compareAtPrice && v.compareAtPrice > 0 ? v.compareAtPrice : null,
        })),
      };
      if (isEdit) {
        await productsApi.update(product.id, payload);
        toast({ title: tForms('updated', { item: tForms('itemProduct') }) });
      } else {
        await productsApi.create(payload);
        toast({ title: tForms('created', { item: tForms('itemProduct') }) });
      }
      await navigateAfterSave('/products', ['products', 'categories', 'brands']);
    } catch {
      toast({ title: tForms('saveFailed', { item: tForms('itemProduct') }), variant: 'destructive' });
    }
  };

  const switchLabels: Record<'isActive' | 'isFeatured' | 'isBestSeller' | 'hasVariants', string> = {
    isActive: tCommon('active'),
    isFeatured: tForms('featured'),
    isBestSeller: tForms('bestSeller'),
    hasVariants: tForms('hasVariants'),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title={tForms('basicInfo')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{tForms('nameEn')}</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameAr">{tForms('nameAr')}</Label>
            <Input id="nameAr" dir="rtl" {...register('nameAr')} />
            {errors.nameAr && <p className="text-sm text-destructive">{errors.nameAr.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">{tForms('sku')}</Label>
            <Input id="sku" {...register('sku')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">{tForms('slug')}</Label>
            <Input id="slug" {...register('slug')} placeholder={tForms('slugPlaceholder')} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{tForms('category')}</Label>
            <Select value={watch('categoryId')} onValueChange={(v) => setValue('categoryId', v)}>
              <SelectTrigger><SelectValue placeholder={tForms('selectCategory')} /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{tForms('brand')}</Label>
            <Select value={watch('brandId') || ''} onValueChange={(v) => setValue('brandId', v)}>
              <SelectTrigger><SelectValue placeholder={tForms('selectBrand')} /></SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">{tForms('shortDescriptionEn')}</Label>
          <Textarea id="shortDescription" {...register('shortDescription')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{tForms('descriptionEn')}</Label>
          <Textarea id="description" rows={4} {...register('description')} />
        </div>
      </FormSection>

      <FormSection title={tForms('pricingInventory')}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">{tForms('price')}</Label>
            <Input id="price" type="number" step="0.01" {...register('price')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="compareAtPrice">{tForms('comparePrice')}</Label>
            <Input id="compareAtPrice" type="number" step="0.01" {...register('compareAtPrice')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costPrice">{tForms('costPrice')}</Label>
            <Input id="costPrice" type="number" step="0.01" {...register('costPrice')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">{tForms('stock')}</Label>
            <Input id="stock" type="number" {...register('stock')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">{tForms('lowStockThreshold')}</Label>
            <Input id="lowStockThreshold" type="number" {...register('lowStockThreshold')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">{tForms('weight')}</Label>
            <Input id="weight" type="number" step="0.01" {...register('weight')} />
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {(['isActive', 'isFeatured', 'isBestSeller', 'hasVariants'] as const).map((field) => (
            <div key={field} className="flex items-center gap-2 rtl:flex-row-reverse">
              <Switch checked={watch(field)} onCheckedChange={(v) => setValue(field, v)} />
              <Label>{switchLabels[field]}</Label>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title={tForms('images')}>
        {imageFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-4 border-b pb-4">
            <ImageUpload
              value={watch(`images.${index}.url`)}
              onChange={(url) => setValue(`images.${index}.url`, url)}
              folder="products"
            />
            <div className="flex-1 space-y-2">
              <Input placeholder={tForms('altText')} {...register(`images.${index}.alt`)} />
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <Switch
                  checked={watch(`images.${index}.isPrimary`)}
                  onCheckedChange={(v) => setValue(`images.${index}.isPrimary`, v)}
                />
                <Label>{tForms('primaryImage')}</Label>
              </div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeImage(index)}>{tForms('remove')}</Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendImage({ url: '', isPrimary: imageFields.length === 0 })}>
          {tForms('addImage')}
        </Button>
      </FormSection>

      {hasVariants && (
        <FormSection title={tForms('variants')}>
          {variantFields.map((field, index) => (
            <div key={field.id} className="grid gap-4 sm:grid-cols-4 border-b pb-4">
              <Input placeholder={tForms('sku')} {...register(`variants.${index}.sku`)} />
              <Input type="number" placeholder={tForms('price')} {...register(`variants.${index}.price`)} />
              <Input type="number" placeholder={tForms('stock')} {...register(`variants.${index}.stock`)} />
              <Input placeholder='Attributes e.g. size:M,color:Black' onChange={(e) => {
                const parts = e.target.value.split(',');
                const attrs: Record<string, string> = {};
                parts.forEach((p) => { const [k, v] = p.split(':'); if (k && v) attrs[k.trim()] = v.trim(); });
                setValue(`variants.${index}.attributes`, attrs);
              }} />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(index)}>{tForms('remove')}</Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({ sku: '', price: 0, stock: 0, attributes: {}, isActive: true })}>
            {tForms('addVariant')}
          </Button>
        </FormSection>
      )}

      <FormSection title={tForms('seo')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">{tForms('metaTitleEn')}</Label>
            <Input id="metaTitle" {...register('metaTitle')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaTitleAr">{tForms('metaTitleAr')}</Label>
            <Input id="metaTitleAr" dir="rtl" {...register('metaTitleAr')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">{tForms('metaDescriptionEn')}</Label>
            <Textarea id="metaDescription" {...register('metaDescription')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescriptionAr">{tForms('metaDescriptionAr')}</Label>
            <Textarea id="metaDescriptionAr" dir="rtl" {...register('metaDescriptionAr')} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tags">{tForms('tags')}</Label>
            <Input id="tags" {...register('tags')} placeholder="luxury, perfume, gift" />
          </div>
        </div>
      </FormSection>

      <FormActions>
        <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon('cancel')}</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : isEdit ? tCommon('update') : tCommon('create')}
        </Button>
      </FormActions>
    </form>
  );
}
