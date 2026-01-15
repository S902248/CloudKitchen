import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAuthClick: () => void;
}

const Navbar = ({ cartCount, onCartClick, searchQuery, setSearchQuery, onAuthClick }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-glow">
              <span className="text-xl">🍽️</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold gradient-text">CloudBite</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('menu')} className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Menu
            </button>
            <button onClick={() => scrollToSection('offers')} className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Offers
            </button>
            <button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-primary transition-colors font-medium">
              About
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* User Auth */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground truncate max-w-[100px]">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={onAuthClick}
                variant="outline"
                className="hidden sm:flex gap-2"
              >
                <User className="w-4 h-4" />
                Login
              </Button>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-3 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 brand-gradient rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-secondary">
              <button
                onClick={() => scrollToSection('menu')}
                className="py-3 px-4 rounded-xl text-left hover:bg-card transition-colors text-foreground font-medium"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection('offers')}
                className="py-3 px-4 rounded-xl text-left hover:bg-card transition-colors text-foreground font-medium"
              >
                Offers
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="py-3 px-4 rounded-xl text-left hover:bg-card transition-colors text-foreground font-medium"
              >
                About
              </button>
              {user ? (
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-card">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-destructive"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-3 px-4 rounded-xl brand-gradient text-primary-foreground font-medium text-center"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
