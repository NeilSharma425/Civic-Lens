import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UploadSection from "@/components/UploadSection";
import Dashboard from "@/components/Dashboard";
import ProcessingResults from "@/components/ProcessingResults";
import InsightsExport from "@/components/InsightsExport";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <UploadSection />
      <Dashboard />
      <ProcessingResults />
      <InsightsExport />
      <Footer />
    </div>
  );
}
