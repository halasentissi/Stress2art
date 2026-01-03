import { Header } from "@/components/Header";
import { ArtworkGallery } from "@/components/ArtworkGallery";
import { useArtworks } from "@/hooks/useArtworks";
import { Heart, Sparkles, Image } from "lucide-react";
import { toast } from "sonner";

const Gallery = () => {
  const { artworks, loading, deleteArtwork } = useArtworks();

  const handleDelete = async (id: string) => {
    const success = await deleteArtwork(id);
    if (success) {
      toast.success("Artwork removed 💔");
    } else {
      toast.error("Failed to delete artwork");
    }
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <main className="container relative z-10 px-4 py-8">
        {/* Header */}
        <section className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-4">
            <Heart className="w-4 h-4 text-primary fill-primary/30" />
            <span className="text-sm font-medium text-secondary-foreground">Your creative memories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My <span className="text-primary">Gallery</span>
            <Sparkles className="inline w-8 h-8 text-accent ml-2 animate-sparkle" />
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Every artwork tells a story. Here are all the moments you've transformed into art 💖
          </p>
          
          {/* Stats */}
          <div className="inline-flex items-center gap-3 mt-6 px-5 py-3 bg-card rounded-2xl shadow-card">
            <Image className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">{artworks.length}</span>
            <span className="text-muted-foreground">artwork{artworks.length !== 1 ? "s" : ""} saved</span>
          </div>
        </section>

        {/* Gallery */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <p className="text-muted-foreground">Loading your creations...</p>
              </div>
            </div>
          ) : (
            <ArtworkGallery artworks={artworks} onDelete={handleDelete} />
          )}
        </section>
      </main>
    </div>
  );
};

export default Gallery;
