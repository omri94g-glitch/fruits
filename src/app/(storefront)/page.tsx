import { Hero } from "@/components/storefront/Hero";
import { OccasionNav } from "@/components/storefront/OccasionNav";
import { BestSellers } from "@/components/storefront/BestSellers";
import { HowItArrives } from "@/components/storefront/HowItArrives";
import { FeatureStrip } from "@/components/storefront/FeatureStrip";
import { Reviews } from "@/components/storefront/Reviews";
import { EventsBusinessBand } from "@/components/storefront/EventsBusinessBand";
import { FAQ } from "@/components/storefront/FAQ";
import { FinalCTA } from "@/components/storefront/FinalCTA";

// Product data is live in the DB (prices/stock can change without a redeploy),
// and build-time prerendering would require DB access during every build.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="relative bg-cream">
        <OccasionNav />
        <BestSellers />
        <HowItArrives />
        <FeatureStrip />
        <Reviews />
        <EventsBusinessBand />
        <FAQ />
        <FinalCTA />
      </div>
    </>
  );
}
