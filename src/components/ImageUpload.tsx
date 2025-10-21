import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

export const ImageUpload = ({ onImageUpload, isProcessing }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageUpload(file);
  };

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
            dragActive
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept="image/*"
            disabled={isProcessing}
          />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Upload className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">
                Upload Medical Image
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to select
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, JPEG
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain bg-muted"
          />
          {!isProcessing && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4"
              onClick={clearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
