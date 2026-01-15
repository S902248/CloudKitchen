import { categories } from '@/data/foodData';

interface HeroBannerProps {
  activeCategory: string;
}

const HeroBanner = ({ activeCategory }: HeroBannerProps) => {
  const category = categories.find((c) => c.id === activeCategory);

  const bannerImages: Record<string, string> = {
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200',
    pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200',
    chicken: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=1200',
    biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200',
    dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200',
    drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200',
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bannerImages[activeCategory] || bannerImages.burger}
          alt={category?.name || 'Food'}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6">
            <span className="text-2xl">{category?.icon}</span>
            <span className="text-sm font-medium text-primary-foreground">{category?.name}</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-4">
            Delicious{' '}
            <span className="gradient-text">{category?.name}</span>
            <br />
            Delivered Fast
          </h1>
          
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-md">
            Order your favorite {category?.name?.toLowerCase()} from the best restaurants near you.
            Fresh, hot, and delivered in 30 minutes!
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all"
            >
              Order Now
            </button>
            <button 
              onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground font-semibold border border-primary-foreground/30 hover:bg-primary-foreground/30 transition-all"
            >
              View Offers
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">30+</p>
              <p className="text-sm text-primary-foreground/70">Restaurants</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">4.9★</p>
              <p className="text-sm text-primary-foreground/70">Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">30min</p>
              <p className="text-sm text-primary-foreground/70">Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
