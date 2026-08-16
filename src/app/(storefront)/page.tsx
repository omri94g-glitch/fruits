import { Hero } from "@/components/storefront/Hero";
import { BestSellers } from "@/components/storefront/BestSellers";
import { FeatureStrip } from "@/components/storefront/FeatureStrip";
import { Testimonials } from "@/components/storefront/Testimonials";
import { InstagramFeed } from "@/components/storefront/InstagramFeed";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BestSellers />
      <FeatureStrip />
      <Testimonials />
      <InstagramFeed />
    </>
  );
}
