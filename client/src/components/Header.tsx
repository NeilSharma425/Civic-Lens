import { Eye, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Eye className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="app-title">CivicLens</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Civic Feedback Analysis</p>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/"
              className={`text-muted-foreground hover:text-foreground transition-colors ${location === '/' ? 'text-foreground font-semibold' : ''}`}
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link 
              href="/analytics"
              className={`text-muted-foreground hover:text-foreground transition-colors ${location === '/analytics' ? 'text-foreground font-semibold' : ''}`}
              data-testid="nav-analytics"
            >
              Analytics
            </Link>
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
              <Link 
                href="/"
                onClick={closeMobileMenu}
                className={`text-left text-muted-foreground hover:text-foreground transition-colors py-2 ${location === '/' ? 'text-foreground font-semibold' : ''}`}
                data-testid="mobile-nav-home"
              >
                Home
              </Link>
              <Link 
                href="/analytics"
                onClick={closeMobileMenu}
                className={`text-left text-muted-foreground hover:text-foreground transition-colors py-2 ${location === '/analytics' ? 'text-foreground font-semibold' : ''}`}
                data-testid="mobile-nav-analytics"
              >
                Analytics
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
