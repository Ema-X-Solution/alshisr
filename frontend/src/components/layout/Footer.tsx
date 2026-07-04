'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Newsletter } from '@/components/home/Newsletter';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display mb-4 text-xl font-semibold">{t('about')}</h3>
            <p className="text-sm leading-relaxed text-primary-foreground/80">{t('aboutText')}</p>
            <div className="mt-6 flex gap-4">
              <a href="https://instagram.com/alshisr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="h-5 w-5 transition-opacity hover:opacity-70" />
              </a>
              <a href="https://twitter.com/alshisr" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="h-5 w-5 transition-opacity hover:opacity-70" />
              </a>
              <a href="https://facebook.com/alshisr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="h-5 w-5 transition-opacity hover:opacity-70" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display mb-4 text-xl font-semibold">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-secondary">{tNav('shop')}</Link></li>
              <li><Link href="/categories" className="text-primary-foreground/80 hover:text-secondary">{tNav('categories')}</Link></li>
              <li><Link href="/offers" className="text-primary-foreground/80 hover:text-secondary">{tNav('offers')}</Link></li>
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-secondary">{tNav('about')}</Link></li>
              <li><Link href="/blog" className="text-primary-foreground/80 hover:text-secondary">{tNav('blog')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display mb-4 text-xl font-semibold">{t('customerService')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-primary-foreground/80 hover:text-secondary">{tNav('contact')}</Link></li>
              <li><Link href="/faq" className="text-primary-foreground/80 hover:text-secondary">{tNav('faq')}</Link></li>
              <li><Link href="/privacy" className="text-primary-foreground/80 hover:text-secondary">{t('privacyPolicy')}</Link></li>
              <li><Link href="/terms" className="text-primary-foreground/80 hover:text-secondary">{t('terms')}</Link></li>
              <li><Link href="/refund-policy" className="text-primary-foreground/80 hover:text-secondary">{t('refundPolicy')}</Link></li>
              <li><Link href="/shipping-policy" className="text-primary-foreground/80 hover:text-secondary">{t('shippingPolicy')}</Link></li>
            </ul>
          </div>

          <div>
            <Newsletter variant="footer" />
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <p className="text-center text-sm text-primary-foreground/70">
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
