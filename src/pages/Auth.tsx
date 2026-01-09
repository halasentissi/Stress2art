import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Sparkles, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import heroMascot from "@/assets/hero-mascot.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back! 💕");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: username || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        toast.success("Account created! Let's start creating! 🎨");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.message?.includes("User already registered")) {
        toast.error("This email is already registered. Try logging in!");
      } else if (error.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase is not configured. Please check your environment variables.");
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      setResetEmailSent(true);
      toast.success("Password reset email sent! Check your inbox 📧");
    } catch (error: any) {
      console.error("Reset password error:", error);
      if (error.message?.includes("fetch") || error.message?.includes("network")) {
        toast.error("Network error. Please check your Supabase configuration in Vercel.");
      } else if (error.message?.includes("not configured")) {
        toast.error("Supabase is not configured. Please add environment variables in Vercel.");
      } else {
        toast.error(error.message || "Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blush/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Heart className="w-10 h-10 text-primary fill-primary/30" />
              <Sparkles className="w-5 h-5 text-accent absolute -top-1 -right-1 animate-sparkle" />
            </div>
            <span className="text-3xl font-bold text-foreground">
              Stress<span className="text-primary">2Art</span>
            </span>
          </div>
          <p className="text-muted-foreground">Transform your stress into beautiful art</p>
        </div>

        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <img 
            src={heroMascot} 
            alt="Cute mascot" 
            className="w-24 h-24 object-contain animate-float"
          />
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-3xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-center text-foreground mb-6">
            {showForgotPassword ? "Reset Password 🔑" : isLogin ? "Welcome Back! 💕" : "Join Us! 🎨"}
          </h2>
          
          {showForgotPassword && !resetEmailSent && (
            <p className="text-sm text-muted-foreground text-center mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          )}

          <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Username (optional)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
              />
            </div>

            {!showForgotPassword && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                />
              </div>
            )}

            {showForgotPassword && resetEmailSent ? (
              <div className="text-center py-4">
                <div className="mb-4">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-foreground font-medium mb-2">Check your email! 📧</p>
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                variant="cute"
                size="lg"
                className="w-full h-12"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {showForgotPassword ? "Sending..." : isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {showForgotPassword ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
                  </span>
                )}
              </Button>
            )}
          </form>

          {!showForgotPassword && isLogin && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowForgotPassword(true);
                  setPassword("");
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {showForgotPassword && !resetEmailSent && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setEmail("");
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Back to login
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setShowForgotPassword(false);
                setResetEmailSent(false);
              }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? (
                <span>Don't have an account? <span className="text-primary font-medium">Sign up</span></span>
              ) : (
                <span>Already have an account? <span className="text-primary font-medium">Sign in</span></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
