import { Eye, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Eye className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="app-title">CivicLens</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Civic Feedback Analysis</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => scrollToSection('upload')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-upload"
            >
              Upload
            </button>
            <button 
              onClick={() => scrollToSection('dashboard')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-dashboard"
            >
              Dashboard
            </button>
            <button 
              onClick={() => scrollToSection('insights')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-insights"
            >
              Insights
            </button>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('upload')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
                data-testid="mobile-nav-upload"
              >
                Upload
              </button>
              <button 
                onClick={() => scrollToSection('dashboard')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
                data-testid="mobile-nav-dashboard"
              >
                Dashboard
              </button>
              <button 
                onClick={() => scrollToSection('insights')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
                data-testid="mobile-nav-insights"
              >
                Insights
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
