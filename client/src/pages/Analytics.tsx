import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import ProcessingResults from "@/components/ProcessingResults";
import InsightsExport from "@/components/InsightsExport";
import Footer from "@/components/Footer";

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div id="dashboard-section" className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground">View and analyze civic feedback insights</p>
          </div>
          <Dashboard />
          <ProcessingResults />
          <InsightsExport />
        </div>
      </div>
      <Footer />
    </div>
  );
}

