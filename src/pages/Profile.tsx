import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Camera, Sparkles, Heart, Image, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [artworkCount, setArtworkCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchArtworkCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) {
      setProfile(data);
      setUsername(data.username || "");
      setBio(data.bio || "");
    }
  };

  const fetchArtworkCount = async () => {
    const { count, error } = await supabase
      .from("artworks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user!.id);

    if (!error && count !== null) {
      setArtworkCount(count);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user!.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast.success("Profile picture updated! 📸");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username, bio })
        .eq("id", user!.id);

      if (error) throw error;
      toast.success("Profile saved! 💕");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen gradient-soft">
      <Header />

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <main className="container relative z-10 px-4 py-8 max-w-2xl mx-auto">
        {/* Header */}
        <section className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-4">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Your profile</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My <span className="text-primary">Profile</span>
            <Sparkles className="inline w-8 h-8 text-accent ml-2 animate-sparkle" />
          </h1>
        </section>

        {/* Profile Card */}
        <div className="bg-card rounded-3xl shadow-card p-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-secondary text-4xl">
                  {username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-background" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-full">
                  <div className="w-8 h-8 border-4 border-background/30 border-t-background rounded-full animate-spin" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-3">Click to change photo</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-secondary rounded-2xl p-4 text-center">
              <Image className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{artworkCount}</p>
              <p className="text-sm text-muted-foreground">Artworks</p>
            </div>
            <div className="bg-secondary rounded-2xl p-4 text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{memberSince}</p>
              <p className="text-sm text-muted-foreground">Member since</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your creative name"
                className="h-12 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                value={user?.email || ""}
                disabled
                className="h-12 rounded-xl bg-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your creative journey..."
                className="w-full min-h-[100px] rounded-xl border border-input bg-background px-3 py-2 text-base resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button
              variant="cute"
              size="lg"
              className="w-full h-12"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save Profile
                </span>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
