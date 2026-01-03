import { Heart, Palette, Sparkles, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url, username")
      .eq("id", user!.id)
      .maybeSingle();

    if (data) {
      setAvatarUrl(data.avatar_url);
      setUsername(data.username);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Heart className="w-8 h-8 text-primary fill-primary/30 group-hover:scale-110 transition-bounce" />
            <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-sparkle" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Stress<span className="text-primary">2Art</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-bounce",
              location.pathname === "/"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </Link>
          <Link
            to="/gallery"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-bounce",
              location.pathname === "/gallery"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Gallery</span>
          </Link>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-2 focus:outline-none">
              <Avatar className="w-10 h-10 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-secondary text-sm">
                  {username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={signOut}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};
