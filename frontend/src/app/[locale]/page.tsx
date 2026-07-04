import { HeroSlider } from '@/components/home/HeroSlider';
import { BestSellers } from '@/components/home/BestSellers';
import { FeaturedProducts } from '@/components/home/BestSellers';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { SpecialOffers } from '@/components/home/SpecialOffers';
import { AboutBrand } from '@/components/home/AboutBrand';
import { Testimonials } from '@/components/home/Testimonials';
import { InstagramGallery } from '@/components/home/InstagramGallery';
import { Newsletter } from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <BestSellers />
      <FeaturedProducts />
      <CategoryGrid />
      <SpecialOffers />
      <AboutBrand />
      <Testimonials />
      <InstagramGallery />
      <section className="section-padding bg-primary/5">
        <Newsletter />
      </section>
    </>
  );
}
