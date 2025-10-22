import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UploadSection from "@/components/UploadSection";
import Footer from "@/components/Footer";
import DemoHint from "@/components/DemoHint";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <UploadSection />
      <Footer />
      <DemoHint />
    </div>
  );
}
