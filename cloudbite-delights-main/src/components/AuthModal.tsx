import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully logged in.',
          });
          onClose();
        }
      } else {
        if (!formData.name.trim()) {
          toast({
            title: 'Name Required',
            description: 'Please enter your name.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          toast({
            title: 'Registration Failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Account Created!',
            description: 'Welcome to CloudBite!',
          });
          onClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="relative p-8 pb-6 brand-gradient">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <h2 className="text-2xl font-bold text-primary-foreground">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-primary-foreground/80 mt-2">
                {isLogin
                  ? 'Sign in to continue ordering'
                  : 'Join CloudBite for exclusive offers'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 pt-6">
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <button
                type="button"
                className="text-sm text-primary hover:underline mt-3 block ml-auto"
              >
                Forgot Password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 rounded-2xl brand-gradient text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="mt-6 text-center">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
