import { Hero } from "@/components/storefront/Hero";
import { BestSellers } from "@/components/storefront/BestSellers";
import { FeatureStrip } from "@/components/storefront/FeatureStrip";
import { Testimonials } from "@/components/storefront/Testimonials";
import { InstagramFeed } from "@/components/storefront/InstagramFeed";

// Product data is live in the DB (prices/stock can change without a redeploy),
// and build-time prerendering would require DB access during every build.
export const dynamic = "force-dynamic";

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
