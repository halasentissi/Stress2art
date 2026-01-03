import { DrawingCanvas } from "@/components/DrawingCanvas";
import { Header } from "@/components/Header";
import { useArtworks } from "@/hooks/useArtworks";
import { Sparkles, Heart, Cloud } from "lucide-react";
import heroMascot from "@/assets/hero-mascot.png";
import { toast } from "sonner";

const Index = () => {
  const { saveArtwork } = useArtworks();

  const handleSave = async (imageData: string) => {
    const result = await saveArtwork(imageData);
    if (result) {
      toast.success("💖 Your artwork has been saved!");
    } else {
      toast.error("Failed to save artwork");
    }
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blush/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <main className="container relative z-10 px-4 py-8">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-8 mb-8">
          <div className="flex-1 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">Your cozy creative corner</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Feeling <span className="text-primary">stressed</span>?
              <br />
              Let it all out! 
              <Heart className="inline w-10 h-10 text-accent fill-accent/30 ml-2 animate-pulse-soft" />
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
              Draw, scribble, color, make a beautiful mess – whatever helps you breathe easier. 
              Your creations are saved with love! 💕
            </p>
          </div>
          
          <div className="w-48 h-48 lg:w-64 lg:h-64 animate-float">
            <img 
              src={heroMascot} 
              alt="Cute mascot" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </section>

        {/* Canvas Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <DrawingCanvas onSave={handleSave} />
        </section>

        {/* Fun tips */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          {[
            { icon: Heart, title: "No rules!", text: "There's no right or wrong here" },
            { icon: Cloud, title: "Be free", text: "Express whatever you're feeling" },
            { icon: Sparkles, title: "Keep it", text: "Your art is saved in your gallery" },
          ].map((tip, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-card transition-bounce hover:scale-[1.02]"
            >
              <div className="p-3 bg-secondary rounded-xl">
                <tip.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.text}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
