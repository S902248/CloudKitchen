import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { FoodItem } from '@/data/foodData';
import { useAuth } from '@/hooks/useAuth';

export interface CartItem extends FoodItem {
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onAuthClick: () => void;
  onCheckout: () => void;
}

const CartSidebar = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onAuthClick,
  onCheckout,
}: CartSidebarProps) => {
  const { user } = useAuth();
  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-card z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Cart</h2>
              <p className="text-sm text-muted-foreground">{items.length} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">₹{item.price} each</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-card hover:bg-card/80 flex items-center justify-center border border-border/50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-foreground" />
                        </button>
                        <span className="font-semibold text-foreground w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center transition-all hover:scale-105"
                        >
                          <Plus className="w-4 h-4 text-primary-foreground" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold gradient-text">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border/50 bg-card">
            {/* Promo Code */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              />
              <button className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 font-semibold text-foreground transition-colors">
                Apply
              </button>
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-primary">Add ₹{500 - subtotal} more for free delivery!</p>
              )}
              <div className="flex justify-between text-xl font-bold text-foreground pt-3 border-t border-border/50">
                <span>Total</span>
                <span className="gradient-text">₹{total}</span>
              </div>
            </div>

            {/* Checkout Button */}
            {user ? (
              <button
                onClick={onCheckout}
                className="w-full py-4 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all"
              >
                Proceed to Checkout
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="w-full py-4 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all"
              >
                Login to Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
