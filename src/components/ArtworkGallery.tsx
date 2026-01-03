import { Artwork } from "@/types/artwork";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Heart, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface ArtworkGalleryProps {
  artworks: Artwork[];
  onDelete: (id: string) => void;
}

export const ArtworkGallery = ({ artworks, onDelete }: ArtworkGalleryProps) => {
  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="relative">
          <Heart className="w-16 h-16 text-primary/30 animate-pulse-soft" />
          <Sparkles className="w-6 h-6 text-accent absolute -top-1 -right-1 animate-sparkle" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-foreground">No artworks yet</h3>
        <p className="mt-2 text-muted-foreground text-center max-w-sm">
          Create your first masterpiece! Draw, scribble, or color - whatever helps you feel better 💖
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {artworks.map((artwork, index) => (
        <div
          key={artwork.id}
          className="group relative bg-card rounded-2xl shadow-card overflow-hidden transition-bounce hover:shadow-glow hover:scale-[1.02]"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden bg-secondary">
            <img
              src={artwork.imageData}
              alt={artwork.title || "Artwork"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {format(artwork.createdAt, "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>

          {/* Delete button */}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth scale-90 group-hover:scale-100"
            onClick={() => onDelete(artwork.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {/* Cute corner decoration */}
          <div className="absolute top-3 left-3">
            <Heart className="w-5 h-5 text-primary/60 fill-primary/30" />
          </div>
        </div>
      ))}
    </div>
  );
};
