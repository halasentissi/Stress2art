import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Eraser, Paintbrush, Trash2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

const CUTE_COLORS = [
  "#FFB6C1", // Light pink
  "#FF69B4", // Hot pink
  "#FF91A4", // Salmon pink
  "#FFC0CB", // Pink
  "#FFD1DC", // Pastel pink
  "#FF6B6B", // Coral red
  "#FFA07A", // Light salmon
  "#FFE4B5", // Moccasin
  "#98D8C8", // Mint
  "#87CEEB", // Sky blue
  "#DDA0DD", // Plum
  "#E6E6FA", // Lavender
  "#F0E68C", // Khaki
  "#FFFFFF", // White
  "#2D2D2D", // Dark gray
];

interface DrawingCanvasProps {
  onSave: (imageData: string) => void;
}

export const DrawingCanvas = ({ onSave }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState(CUTE_COLORS[1]);
  const [brushSize, setBrushSize] = useState(8);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = Math.min(container.clientWidth - 32, 800);
    const height = Math.min(window.innerHeight - 300, 500);

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#FFFFFF",
      isDrawingMode: true,
    });

    const brush = new PencilBrush(canvas);
    brush.color = activeColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    setFabricCanvas(canvas);
    toast.success("✨ Let your feelings flow! Draw anything you want!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas || !fabricCanvas.freeDrawingBrush) return;
    
    fabricCanvas.freeDrawingBrush.color = isEraser ? "#FFFFFF" : activeColor;
    fabricCanvas.freeDrawingBrush.width = brushSize;
  }, [activeColor, brushSize, isEraser, fabricCanvas]);

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#FFFFFF";
    fabricCanvas.renderAll();
    toast("🧹 Canvas cleared! Fresh start!");
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    onSave(dataURL);
    handleClear();
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
    toast(isEraser ? "🖌️ Brush mode" : "✨ Eraser mode");
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-2xl shadow-card">
        {/* Colors */}
        <div className="flex flex-wrap gap-2">
          {CUTE_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                setActiveColor(color);
                setIsEraser(false);
              }}
              className={`w-8 h-8 rounded-full transition-bounce hover:scale-110 ${
                activeColor === color && !isEraser
                  ? "ring-2 ring-primary ring-offset-2 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: color, border: color === "#FFFFFF" ? "2px solid #FFB6C1" : "none" }}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border hidden sm:block" />

        {/* Brush Size */}
        <div className="flex items-center gap-3 min-w-[150px]">
          <Paintbrush className="w-5 h-5 text-primary" />
          <Slider
            value={[brushSize]}
            onValueChange={(v) => setBrushSize(v[0])}
            min={2}
            max={50}
            step={1}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground font-medium w-6">{brushSize}</span>
        </div>

        {/* Tools */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant={isEraser ? "cute" : "soft"}
            size="icon"
            onClick={toggleEraser}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </Button>
          <Button
            variant="soft"
            size="icon"
            onClick={handleClear}
            title="Clear canvas"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button
            variant="cute"
            size="lg"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="w-5 h-5" />
            <span className="hidden sm:inline">Save Artwork</span>
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex justify-center p-4 bg-card rounded-3xl shadow-card overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="rounded-2xl shadow-soft cursor-crosshair"
          style={{ touchAction: "none" }}
        />
      </div>

      {/* Encouragement */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary animate-pulse-soft" />
        <p className="text-sm font-medium">Express yourself freely. There's no wrong way to create! 💕</p>
        <Sparkles className="w-4 h-4 text-accent animate-pulse-soft" />
      </div>
    </div>
  );
};
