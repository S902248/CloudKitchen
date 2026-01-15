import { useState } from 'react';
import { X, MapPin, Phone, CreditCard, Banknote, CheckCircle, Loader2 } from 'lucide-react';
import { CartItem } from './CartSidebar';
import { toast } from '@/hooks/use-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

const CheckoutModal = ({ isOpen, onClose, items, onOrderComplete }: CheckoutModalProps) => {
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullAddress: '',
    landmark: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullAddress.trim() || !address.phone.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setStep('success');
  };

  const handleClose = () => {
    if (step === 'success') {
      onOrderComplete();
    }
    onClose();
    setStep('address');
    setAddress({ fullAddress: '', landmark: '', phone: '' });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {step === 'address' && 'Delivery Address'}
                {step === 'payment' && 'Payment'}
                {step === 'success' && 'Order Placed!'}
              </h2>
              {step !== 'success' && (
                <p className="text-sm text-muted-foreground">
                  Step {step === 'address' ? '1' : '2'} of 2
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {/* Address Step */}
            {step === 'address' && (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                    <textarea
                      placeholder="Enter your full address..."
                      value={address.fullAddress}
                      onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near park, opposite mall, etc."
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6 p-4 rounded-2xl bg-secondary/50 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-muted-foreground">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-border/50 pt-2 mt-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery</span>
                        <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground mb-3">Select Payment Method</h3>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Banknote className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive</p>
                    </div>
                    {paymentMethod === 'cod' && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground">UPI Payment</p>
                      <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                    </div>
                    {paymentMethod === 'upi' && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                    </div>
                    {paymentMethod === 'card' && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </button>
                </div>

                {/* Delivery Address Preview */}
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 mt-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Delivering to:</p>
                      <p className="text-sm text-muted-foreground">{address.fullAddress}</p>
                      {address.landmark && (
                        <p className="text-sm text-muted-foreground">Near: {address.landmark}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/30">
                  <span className="font-semibold text-foreground">Total Amount</span>
                  <span className="text-2xl font-bold gradient-text">₹{total}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="flex-1 py-4 rounded-2xl bg-secondary hover:bg-secondary/80 font-semibold text-foreground transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 py-4 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Place Order
                  </button>
                </div>
              </div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="text-center py-8">
                <div className="w-24 h-24 rounded-full brand-gradient flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <CheckCircle className="w-12 h-12 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h3>
                <p className="text-muted-foreground mb-6">
                  Your order has been placed successfully. You'll receive a confirmation shortly.
                </p>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Estimated Delivery</p>
                  <p className="text-xl font-bold text-foreground">30-40 minutes</p>
                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Order Total</p>
                  <p className="text-2xl font-bold gradient-text">₹{total}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Card'}
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-4 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
