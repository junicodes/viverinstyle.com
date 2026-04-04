import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Search, User, LogOut, Moon, Sun, LayoutDashboard, Heart, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { AuthModal } from './AuthModal';
import { Button } from './ui/button';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/1bbddcaa197198eb93aced0c28b77cec28693e0a.png';

interface HeaderProps {
  onCategoryClick?: (categorySlug: string) => void;
  onProductClick?: (product: any) => void;
  onNavigate?: (page: string) => void;
}

const SHOP_BY_TYPE = [
  { name: 'Sofas & Couches', slug: 'sofas' },
  { name: 'Chairs', slug: 'chairs' },
  { name: 'Tables', slug: 'tables' },
  { name: 'Beds & Bedroom', slug: 'beds' },
  { name: 'Storage', slug: 'storage' },
];

const SHOP_BY_MATERIAL = [
  { name: 'Leather', filter: 'leather' },
  { name: 'Velvet', filter: 'velvet' },
  { name: 'Wood', filter: 'wood' },
  { name: 'Marble', filter: 'marble' },
  { name: 'Metal', filter: 'metal' },
  { name: 'Fabric', filter: 'fabric' },
];

export function Header({ onCategoryClick, onProductClick, onNavigate }: HeaderProps = {}) {
  const { cart, setCartOpen, isMobileMenuOpen, setMobileMenuOpen, user, logout, favorites } = useStore();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isShopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme === 'dark';
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const products = await api.getProducts();
      const results = products.filter((product: any) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase()) ||
        product.material?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavClick = (page: string) => {
    onNavigate?.(page);
    setMobileMenuOpen(false);
    setShopOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => handleNavClick('home')} className="flex items-center space-x-2 sm:space-x-3 group">
              <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <img src={logoImage} alt="Vivere In Style" className="h-12 sm:h-16 w-auto" />
              </motion.div>
              <div className="hidden sm:block">
                <div className="text-xl leading-none mb-1 text-foreground">Vivere In Style</div>
                <div className="text-xs text-muted-foreground italic">La dolce vita</div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {user && (
              <button
                onClick={() => user.role === 'admin' ? handleNavClick('admin') : handleNavClick('account')}
                className="text-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                {user.role === 'admin' ? 'Dashboard' : 'My Account'}
              </button>
            )}

            <button onClick={() => handleNavClick('home')} className="text-foreground/70 hover:text-foreground transition-colors text-sm">
              Home
            </button>

            {/* Shop Mega Menu */}
            <div ref={shopRef} className="relative">
              <button
                onClick={() => setShopOpen(!isShopOpen)}
                onMouseEnter={() => setShopOpen(true)}
                className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1 text-sm"
              >
                Shop
                <ChevronDown className={`w-3 h-3 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isShopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    onMouseLeave={() => setShopOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] bg-card border border-border rounded-xl shadow-2xl p-6 z-50"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">By Type</h3>
                        <ul className="space-y-2">
                          {SHOP_BY_TYPE.map(item => (
                            <li key={item.slug}>
                              <button
                                onClick={() => { onCategoryClick?.(item.slug); setShopOpen(false); }}
                                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                              >
                                {item.name}
                              </button>
                            </li>
                          ))}
                          <li className="pt-1">
                            <button
                              onClick={() => { handleNavClick('collection'); }}
                              className="text-sm font-medium text-foreground hover:underline"
                            >
                              Shop All →
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">By Material</h3>
                        <ul className="space-y-2">
                          {SHOP_BY_MATERIAL.map(item => (
                            <li key={item.filter}>
                              <button
                                onClick={() => { handleNavClick(`collection?material=${item.filter}`); }}
                                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                              >
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border">
                      <button
                        onClick={() => handleNavClick('collection')}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        View Complete Collection →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => handleNavClick('brand-story')} className="text-foreground/70 hover:text-foreground transition-colors text-sm">
              About
            </button>
            <button onClick={() => handleNavClick('blogs')} className="text-foreground/70 hover:text-foreground transition-colors text-sm">
              Journal
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <button onClick={toggleDarkMode} className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Toggle dark mode">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button onClick={() => setSearchOpen(!isSearchOpen)} className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {favorites.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => user.role === 'admin' ? handleNavClick('admin') : null}
                  className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user.name || user.email.split('@')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-brand-gold text-brand-charcoal px-2 py-0.5 rounded">Admin</span>
                  )}
                </button>
                <button onClick={logout} className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)} className="hidden lg:flex">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}

            <button onClick={() => setCartOpen(true)} className="p-2 hover:bg-secondary rounded-lg transition-colors relative" aria-label="Shopping cart">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-brand-gold text-brand-charcoal text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border">
              <div className="py-4 relative">
                <input
                  type="text"
                  placeholder="Search for furniture..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                    {searchResults.map((product: any) => (
                      <button key={product.id} onClick={() => { onProductClick?.(product); setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }} className="w-full flex items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-secondary transition-colors text-left">
                        <img src={product.images?.[0] || product.image} alt={product.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-sm sm:text-base">{product.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{product.category}</div>
                        </div>
                        <div className="text-base sm:text-lg flex-shrink-0">${product.price?.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl p-4 text-center text-muted-foreground">No products found</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-border bg-background">
            <nav className="px-4 py-4 space-y-1">
              {user ? (
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg mb-2">
                    <User className="w-5 h-5 text-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{user.name || user.email.split('@')[0]}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    {user.role === 'admin' && <span className="text-xs bg-brand-gold text-brand-charcoal px-2 py-1 rounded">Admin</span>}
                  </div>
                  <button onClick={() => { user.role === 'admin' ? handleNavClick('admin') : handleNavClick('account'); }} className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    {user.role === 'admin' ? 'Dashboard' : 'My Account'}
                  </button>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2 text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 mb-4 bg-brand-gold hover:bg-brand-gold/90 text-brand-charcoal rounded-lg transition-colors flex items-center gap-2 font-medium">
                  <User className="w-4 h-4" /> Login / Sign Up
                </button>
              )}

              <button onClick={() => handleNavClick('home')} className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors">Home</button>

              {/* Mobile Shop Accordion */}
              <div>
                <button onClick={() => setMobileShopOpen(!mobileShopOpen)} className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors flex items-center justify-between">
                  Shop
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileShopOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">By Type</p>
                    {SHOP_BY_TYPE.map(item => (
                      <button key={item.slug} onClick={() => { onCategoryClick?.(item.slug); setMobileMenuOpen(false); setMobileShopOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-secondary rounded-lg transition-colors text-foreground/80">
                        {item.name}
                      </button>
                    ))}
                    <button onClick={() => handleNavClick('collection')} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors">Shop All →</button>
                  </div>
                )}
              </div>

              <button onClick={() => handleNavClick('brand-story')} className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors">About</button>
              <button onClick={() => handleNavClick('blogs')} className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors">Journal</button>
              <button onClick={() => handleNavClick('wishlist')} className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2">
                <Heart className="w-4 h-4" /> Wishlist {favorites.length > 0 && `(${favorites.length})`}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} onLoginSuccess={(role) => { role === 'admin' ? handleNavClick('admin') : handleNavClick('account'); }} />
    </header>
  );
}
