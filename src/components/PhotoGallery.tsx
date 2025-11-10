import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export const PhotoGallery = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos((prev) => [...prev, e.target!.result as string]);
            toast.success("Media added successfully!");
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    toast.success("Media removed");
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
          Our Memories Together 📸
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Upload photos and videos to create a personalized gallery
        </p>

        <div className="mb-8 flex justify-center">
          <label htmlFor="file-upload">
            <Button
              variant="default"
              size="lg"
              className="cursor-pointer bg-primary hover:bg-primary/90 shadow-[var(--glow-rose)]"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Photos/Videos
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {photos.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-primary/30 bg-card/50">
            <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No memories uploaded yet. Start by adding your favorite moments!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <Card
                key={index}
                className="relative group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[var(--glow-rose)]"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square">
                  {photo.startsWith('data:video') ? (
                    <video
                      src={photo}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={photo}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}

        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="max-w-4xl max-h-[90vh]">
              {selectedPhoto.startsWith('data:video') ? (
                <video
                  src={selectedPhoto}
                  className="max-w-full max-h-[90vh] rounded-lg"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedPhoto}
                  alt="Selected memory"
                  className="max-w-full max-h-[90vh] rounded-lg"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
