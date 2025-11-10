import { useState } from "react";
import { GiftBox } from "@/components/GiftBox";
import { BirthdayMessage } from "@/components/BirthdayMessage";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Gift, ArrowDown } from "lucide-react";

const Index = () => {
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleGiftOpen = () => {
    if (!isGiftOpened) {
      setIsGiftOpened(true);
      setTimeout(() => setShowContent(true), 1500);
    }
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
        <div className="animate-fade-in">
          <BirthdayMessage />
          <PhotoGallery />
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default Index;
