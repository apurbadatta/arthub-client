
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedArtworks from "@/components/home/FeaturedArtworks";
import HowItWorks from  "@/components/home/HowItWorks";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <CategorySection />
      <FeaturedArtworks/>
      <HowItWorks/>
      
    
      
    </main>
  );
}