import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Play, Pause, Volume2, VolumeX, Upload } from "lucide-react";
import { toast } from "sonner";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [songName, setSongName] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setSongName(file.name);
      toast.success("Music added! Click play to start.");
    } else {
      toast.error("Please upload an audio file");
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioSrc) {
      toast.error("Please upload a song first!");
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <Card className="fixed bottom-6 right-6 p-4 bg-card/95 backdrop-blur-sm border-primary/20 shadow-[var(--glow-rose)] z-40">
      <div className="flex items-center gap-3">
        <Music className="w-5 h-5 text-primary animate-glow" />
        
        {!audioSrc ? (
          <label htmlFor="music-upload">
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer"
              onClick={() => document.getElementById('music-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Add Music
            </Button>
          </label>
        ) : (
          <>
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {songName}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="hover:bg-primary/10"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-primary" />
              ) : (
                <Play className="h-4 w-4 text-primary" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="hover:bg-primary/10"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-primary" />
              )}
            </Button>
          </>
        )}

        <input
          id="music-upload"
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        
        <audio ref={audioRef} src={audioSrc || undefined} />
      </div>
    </Card>
  );
};
