import { Plus, Star } from 'lucide-react';
import { FoodItem } from '@/data/foodData';

interface FoodCardProps {
  item: FoodItem;
  onSelect: (item: FoodItem) => void;
  onAddToCart: (item: FoodItem, qty: number) => void;
  isSelected: boolean;
}

const FoodCard = ({ item, onSelect, onAddToCart, isSelected }: FoodCardProps) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`relative group cursor-pointer rounded-3xl bg-card border overflow-hidden transition-all duration-300 card-hover ${
        isSelected ? 'border-primary shadow-glow' : 'border-border/50'
      }`}
    >
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.isBestSeller && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold brand-gradient text-primary-foreground">
              Bestseller
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            item.isVeg 
              ? 'bg-green-500/90 text-primary-foreground' 
              : 'bg-red-500/90 text-primary-foreground'
          }`}>
            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item, 1);
          }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full brand-gradient flex items-center justify-center text-primary-foreground shadow-glow opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold gradient-text">₹{item.price}</p>
          <span className="text-xs text-muted-foreground">{item.prepTime}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
