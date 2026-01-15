import { Minus, Plus, Star, Clock, Flame, X } from 'lucide-react';
import { FoodItem } from '@/data/foodData';

interface ProductDetailProps {
  product: FoodItem | null;
  onClose: () => void;
  onAddToCart: (item: FoodItem, qty: number) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

const ProductDetail = ({
  product,
  onClose,
  onAddToCart,
  quantity,
  onQuantityChange,
}: ProductDetailProps) => {
  if (!product) {
    return (
      <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-soft text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Select a dish</h3>
        <p className="text-muted-foreground">Click on any item to see details</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card border border-border/50 shadow-soft overflow-hidden animate-scale-in">
      {/* Image */}
      <div className="relative h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        
        {/* Close Button - Mobile */}
        <button
          onClick={onClose}
          className="xl:hidden absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {product.isBestSeller && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold brand-gradient text-primary-foreground">
              Bestseller
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            product.isVeg 
              ? 'bg-green-500/90 text-primary-foreground' 
              : 'bg-red-500/90 text-primary-foreground'
          }`}>
            {product.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">{product.rating}</span>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">{product.description}</p>

        {/* Info Tags */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{product.prepTime}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{product.calories} cal</span>
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-3xl font-bold gradient-text">₹{product.price}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <Minus className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-xl font-bold text-foreground w-8 text-center">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center text-primary-foreground shadow-glow transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Total & Add Button */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">₹{product.price * quantity}</p>
          </div>
          <button
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 py-4 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
