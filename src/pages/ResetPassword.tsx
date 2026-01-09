import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Sparkles, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import heroMascot from "@/assets/hero-mascot.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the hash fragments automatically
    // Check if user has a valid session (from the reset link)
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
        }
        
        if (session) {
          setIsValidSession(true);
          return;
        }

        // Try to get session from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");
        
        if (type === "recovery" && accessToken) {
          const refreshToken = hashParams.get("refresh_token");
          if (refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error("Error setting session:", error);
              toast.error(error.message || "Invalid or expired reset link");
              setTimeout(() => navigate("/auth"), 2000);
            } else {
              setIsValidSession(true);
            }
          } else {
            toast.error("Invalid reset link - missing refresh token");
            setTimeout(() => navigate("/auth"), 2000);
          }
        } else {
          // Check if there's a hash at all
          if (window.location.hash) {
            // Wait a bit for Supabase to process the hash
            setTimeout(() => {
              supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                  setIsValidSession(true);
                } else {
                  toast.error("Invalid or expired reset link");
                  setTimeout(() => navigate("/auth"), 2000);
                }
              });
            }, 500);
          } else {
            toast.error("Invalid reset link");
            setTimeout(() => navigate("/auth"), 2000);
          }
        }
      } catch (error: any) {
        console.error("Failed to check session:", error);
        toast.error("Failed to verify reset link. Please try again.");
        setTimeout(() => navigate("/auth"), 2000);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      // Verify we have a valid session before updating password
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("No active session. Please use the reset link from your email.");
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      
      setSuccess(true);
      toast.success("Password reset successfully! 🎉");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      if (error.message?.includes("fetch")) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.message || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession && !success) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="bg-card rounded-3xl shadow-card p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Verifying reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="bg-card rounded-3xl shadow-card p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Password Reset! 🎉
              </h2>
              <p className="text-muted-foreground">
                Your password has been successfully updated.
              </p>
            </div>
            <Button
              onClick={() => navigate("/auth")}
              variant="cute"
              size="lg"
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-muted-foreground">Create a new password</p>
        </div>

        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <img 
            src={heroMascot} 
            alt="Cute mascot" 
            className="w-24 h-24 object-contain animate-float"
          />
        </div>

        {/* Reset Password Card */}
        <div className="bg-card rounded-3xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-center text-foreground mb-6">
            Reset Password 🔑
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
              />
            </div>

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
                  Resetting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Reset Password
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/auth")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

