import HeroSection from "@/components/HeroSection";
import CelebritySpotlight from "@/components/CelebritySpotlight";
import ExploreSection from "@/components/ExploreSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CelebritySpotlight />
      <ExploreSection />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <p className="text-ivory-dark/60 text-sm">
          Kerala Election Pulse 2026 &middot; Data from Election Commission &amp; MyNeta.info
        </p>
        <p className="text-ivory-dark/30 text-xs mt-1">
          Not affiliated with any political party.
        </p>
      </footer>
    </main>
  );
}
