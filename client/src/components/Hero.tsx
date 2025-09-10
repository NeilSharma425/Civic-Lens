import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToUpload = () => {
    const element = document.getElementById('upload');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToDashboard = () => {
    const element = document.getElementById('dashboard');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="hero-title">
              Bridge Civic <span className="text-primary">Representation</span> Gaps
            </h2>
            <p className="text-lg text-muted-foreground mb-8" data-testid="hero-description">
              CivicLens uses AI to translate, analyze, and rewrite civic feedback for inclusive policymaking. 
              Identify underrepresented voices and sentiment trends across diverse communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToUpload}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                data-testid="button-start-analysis"
              >
                Start Analysis
              </Button>
              <Button 
                variant="outline"
                onClick={scrollToDashboard}
                className="border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                data-testid="button-view-demo"
              >
                View Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Diverse community meeting discussing civic issues" 
              className="rounded-xl shadow-lg w-full h-auto"
              data-testid="hero-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
