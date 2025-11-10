import { useState } from "react";
import { GiftBox } from "@/components/GiftBox";
import { BirthdayScene3D } from "@/components/BirthdayScene3D";
import { BirthdayMessage } from "@/components/BirthdayMessage";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, ArrowDown, Upload, Camera } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleGiftOpen = () => {
    if (!isGiftOpened) {
      setIsGiftOpened(true);
      setTimeout(() => setShowContent(true), 1500);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos((prev) => [...prev, e.target!.result as string]);
            toast.success("Photo added to the scene!");
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-background via-cream to-blush min-h-screen overflow-x-hidden">
      {/* Initial Gift View */}
      {!showContent && (
        <div className="relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="text-center space-y-6 px-6 animate-fade-in">
              <Gift className="w-16 h-16 mx-auto text-primary animate-float" />
              <h1 className="text-5xl md:text-7xl font-bold text-foreground">
                DelNyal
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-md">
                A Special Birthday Surprise
              </p>
              {!isGiftOpened && (
                <div className="pointer-events-auto">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--glow-rose)] animate-scale-in"
                    onClick={handleGiftOpen}
                  >
                    Click to Open Your Gift
                  </Button>
                  <div className="mt-4 animate-bounce">
                    <ArrowDown className="w-6 h-6 mx-auto text-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <GiftBox onOpen={handleGiftOpen} isOpened={isGiftOpened} />
        </div>
      )}

      {/* Content After Opening */}
      {showContent && (
        <div className="relative animate-fade-in">
          <BirthdayScene3D photos={photos} birthdayName="Sarah" />
          
          {/* Upload Button Overlay */}
          <div className="absolute top-6 left-6 z-10">
            <Card className="p-4 bg-card/95 backdrop-blur-sm border-primary/20 shadow-[var(--glow-rose)]">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-primary" />
                <label htmlFor="photo-upload">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Add Photos
                  </Button>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              {photos.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {photos.length} photo{photos.length > 1 ? 's' : ''} on table
                </p>
              )}
            </Card>
          </div>

          {/* Instructions Overlay */}
          <div className="absolute top-6 right-6 z-10">
            <Card className="p-3 bg-card/95 backdrop-blur-sm border-primary/20 text-sm text-muted-foreground max-w-xs">
              <p className="font-semibold text-foreground mb-1">🎂 Interactive Scene</p>
              <p>• Drag to rotate</p>
              <p>• Scroll to zoom</p>
              <p>• Add photos to see them on table</p>
            </Card>
          </div>

          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default Index;
