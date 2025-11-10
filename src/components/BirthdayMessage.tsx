import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const BirthdayMessage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <Card className="max-w-2xl w-full p-8 md:p-12 bg-card/95 backdrop-blur-sm border-primary/20 shadow-[var(--glow-rose)]">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6 animate-float">
            <Heart className="w-16 h-16 text-primary fill-primary animate-glow" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            Happy Birthday! 🎉
          </h1>
          
          <div className="space-y-4 text-lg text-muted-foreground animate-fade-in [animation-delay:200ms]">
            <p className="leading-relaxed">
              On this special day, I wanted to create something as unique as you are. 
              Every moment with you has been a gift, and today I celebrate you.
            </p>
            
            <p className="leading-relaxed">
              You light up every room you enter, and your smile makes everything better. 
              Here's to another year of amazing memories, laughter, and all the happiness you deserve.
            </p>
            
            <p className="leading-relaxed font-semibold text-primary">
              May this year bring you everything your heart desires. ✨
            </p>
          </div>

          <div className="pt-6 border-t border-primary/20 mt-8">
            <p className="text-sm text-muted-foreground italic">
              "Every day with you is a celebration, but today is extra special."
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
