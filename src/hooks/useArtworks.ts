import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Artwork } from "@/types/artwork";

export const useArtworks = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchArtworks();
    } else {
      setArtworks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchArtworks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching artworks:", error);
    } else {
      setArtworks(
        data.map((a) => ({
          id: a.id,
          imageData: a.image_data,
          createdAt: new Date(a.created_at),
          title: a.title || undefined,
          mood: a.mood || undefined,
        }))
      );
    }
    setLoading(false);
  };

  const saveArtwork = async (imageData: string, title?: string, mood?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("artworks")
      .insert({
        user_id: user.id,
        image_data: imageData,
        title,
        mood,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving artwork:", error);
      return null;
    }

    const newArtwork: Artwork = {
      id: data.id,
      imageData: data.image_data,
      createdAt: new Date(data.created_at),
      title: data.title || undefined,
      mood: data.mood || undefined,
    };

    setArtworks((prev) => [newArtwork, ...prev]);
    return newArtwork;
  };

  const deleteArtwork = async (id: string) => {
    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting artwork:", error);
      return false;
    }

    setArtworks((prev) => prev.filter((a) => a.id !== id));
    return true;
  };

  return { artworks, loading, saveArtwork, deleteArtwork, refetch: fetchArtworks };
};
