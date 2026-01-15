import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import FoodCard from '@/components/FoodCard';
import ProductDetail from '@/components/ProductDetail';
import CartSidebar, { CartItem } from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import CheckoutModal from '@/components/CheckoutModal';
import { foodData, categories, FoodItem } from '@/data/foodData';
import { ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState<string>('burger');
  const [selectedProduct, setSelectedProduct] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = searchQuery
    ? (() => {
        const fuse = new Fuse(foodData, { keys: ['name', 'description'], threshold: 0.4 });
        return fuse.search(searchQuery).map(result => result.item);
      })()
    : foodData.filter((item) => item.category === activeCategory);

  const handleSelectProduct = (item: FoodItem) => {
    setSelectedProduct(item);
    setQuantity(1);
  };

  const handleAddToCart = (item: FoodItem, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + qty } : cartItem
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const handleRemoveItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      setSelectedProduct(filteredProducts[0]);
      setQuantity(1);
    }
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background page-entrance">
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAuthClick={() => setIsAuthOpen(true)} />
      {!searchQuery && <HeroBanner activeCategory={activeCategory} />}

      <section id="menu" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Explore Our <span className="gradient-text">Menu</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover our wide range of delicious dishes, crafted with fresh ingredients and love.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {!searchQuery && (
              <aside className="lg:w-64 flex-shrink-0">
                <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="lg:hidden w-full flex items-center justify-between p-4 mb-4 rounded-2xl bg-card border border-border/50 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categories.find((c) => c.id === activeCategory)?.icon}</span>
                    <span className="font-semibold text-foreground">{categories.find((c) => c.id === activeCategory)?.name}</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isMobileSidebarOpen ? 'rotate-90' : ''}`} />
                </button>

                <nav className={`space-y-2 ${isMobileSidebarOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-24`}>
                  <div className="p-2 rounded-3xl bg-card border border-border/50 shadow-soft">
                    <ul className="space-y-1">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <button onClick={() => { setActiveCategory(category.id); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeCategory === category.id ? 'category-active' : 'hover:bg-secondary text-foreground'}`}>
                            <span className="text-2xl">{category.icon}</span>
                            <div className="text-left">
                              <p className="font-semibold">{category.name}</p>
                              <p className={`text-xs ${activeCategory === category.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{category.description}</p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="hidden lg:block p-6 rounded-3xl brand-gradient text-primary-foreground mt-6">
                    <h3 className="text-xl font-bold mb-2">Special Offer! 🎉</h3>
                    <p className="text-sm text-primary-foreground/90 mb-4">Get 20% off on your first order using code FIRST20</p>
                    <button className="w-full py-3 rounded-2xl bg-card text-foreground font-semibold hover:bg-card/90 transition-colors">Apply Code</button>
                  </div>
                </nav>
              </aside>
            )}

            <div className="flex-1 flex flex-col xl:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">{searchQuery ? `Search Results for "${searchQuery}"` : categories.find((c) => c.id === activeCategory)?.name}</h3>
                  <span className="text-sm text-muted-foreground">{filteredProducts.length} items</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6 stagger-children">
                  {filteredProducts.map((item) => (
                    <FoodCard key={item.id} item={item} onSelect={handleSelectProduct} onAddToCart={handleAddToCart} isSelected={selectedProduct?.id === item.id} />
                  ))}
                </div>
              </div>
              <div className="hidden xl:block w-96 flex-shrink-0">
                <div className="sticky top-24">
                  <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} quantity={quantity} onQuantityChange={setQuantity} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="xl:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto">
            <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} quantity={quantity} onQuantityChange={setQuantity} />
          </div>
        </div>
      )}

      <section id="offers" className="py-16 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Exclusive <span className="gradient-text">Offers</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Save more on your favorite meals with our special deals.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{ title: '🎉 First Order Offer', discount: '20% OFF', desc: 'Use code FIRST20 on your first order', code: 'FIRST20' }, { title: '🍔 Combo Delight', discount: '₹150 OFF', desc: 'On combo meals above ₹599', code: 'COMBO150' }, { title: '⚡ Flash Sale', discount: 'Buy 1 Get 1', desc: 'Limited time offer', code: 'B1G1' }].map((offer, i) => (
              <div key={i} className="relative p-6 rounded-3xl bg-card shadow-soft overflow-hidden">
                <div className="absolute inset-0 brand-gradient opacity-10" />
                <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                <p className="text-xl font-semibold text-primary mb-2">{offer.discount}</p>
                <p className="text-muted-foreground mb-4">{offer.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="px-4 py-2 rounded-xl bg-secondary font-mono font-bold">{offer.code}</span>
                  <button onClick={() => navigator.clipboard.writeText(offer.code)} className="px-5 py-2 rounded-2xl brand-gradient text-primary-foreground font-semibold hover:opacity-90 transition">Copy</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">About <span className="gradient-text">CloudBite</span></h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">CloudBite is your trusted food delivery partner, bringing freshly prepared meals straight to your doorstep.</p>
              <div className="grid grid-cols-2 gap-6">
                {[{ val: '10K+', label: 'Happy Customers' }, { val: '500+', label: 'Daily Orders' }, { val: '4.9★', label: 'Customer Rating' }, { val: 'Fast', label: '30-min Delivery' }].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card shadow-soft">
                    <h3 className="text-2xl font-bold gradient-text mb-2">{stat.val}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-40 h-40 brand-gradient rounded-full blur-3xl opacity-30" />
              <div className="relative p-8 rounded-3xl bg-card shadow-soft">
                <img src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092" alt="Delicious Food" className="rounded-2xl w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border/50 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center"><span className="text-xl">🍽️</span></div>
                <span className="text-xl font-bold gradient-text">CloudBite</span>
              </div>
              <p className="text-muted-foreground text-sm">Delivering happiness to your doorstep, one meal at a time.</p>
            </div>
            <div><h4 className="font-semibold text-foreground mb-4">Quick Links</h4><ul className="space-y-2 text-sm text-muted-foreground"><li><a href="#menu" className="hover:text-primary transition-colors">Menu</a></li><li><a href="#offers" className="hover:text-primary transition-colors">Offers</a></li><li><a href="#about" className="hover:text-primary transition-colors">About</a></li></ul></div>
            <div><h4 className="font-semibold text-foreground mb-4">Legal</h4><ul className="space-y-2 text-sm text-muted-foreground"><li>Privacy Policy</li><li>Terms of Service</li></ul></div>
            <div><h4 className="font-semibold text-foreground mb-4">Contact Us</h4><ul className="space-y-2 text-sm text-muted-foreground"><li>📞 +91 1234567890</li><li>✉️ hello@cloudbite.com</li><li>📍 Mumbai, India</li></ul></div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground"><p>© 2024 CloudBite. All rights reserved.</p></div>
        </div>
      </footer>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onAuthClick={() => { setIsCartOpen(false); setIsAuthOpen(true); }} onCheckout={handleCheckout} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} items={cart} onOrderComplete={handleOrderComplete} />
    </div>
  );
};

export default Home;
