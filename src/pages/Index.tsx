import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ConfidenceDisplay } from '@/components/ConfidenceDisplay';
import { HeartModelViewer } from '@/components/HeartModelViewer';
import { Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setConfidence(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      console.log('Sending image to AI for analysis...');

      // Call edge function for heart detection
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-heart-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      console.log('Analysis result:', data);

      setConfidence(data.confidence);
      
      toast({
        title: "Analysis Complete",
        description: `Heart detection confidence: ${data.confidence}%`,
      });

    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Failed to analyze image',
        variant: "destructive",
      });
      setConfidence(null);
    } finally {
      setIsProcessing(false);
    }
  };
  const showModel = confidence !== null && confidence > 55;
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Medical Image Analysis</h1>
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Upload Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Upload Medical Image
              </h2>
              
            </div>
            <ImageUpload onImageUpload={handleImageUpload} isProcessing={isProcessing} />
          </section>

          {/* Confidence Display */}
          {(confidence !== null || isProcessing) && <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ConfidenceDisplay confidence={confidence} isProcessing={isProcessing} />
            </section>}

          {/* 3D Model Viewer */}
          {showModel && <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">3D Model</h2>
                <p className="text-muted-foreground">
                  Interactive visualization based on analysis results
                </p>
              </div>
              <HeartModelViewer />
            </section>}

          {/* Info Note */}
          {confidence === null && !isProcessing && <section className="max-w-2xl mx-auto">
              <div className="bg-muted/30 rounded-xl p-6 border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  🤖 AI-Powered Heart Detection
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a medical image to detect if it contains a human heart using advanced AI vision analysis.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Powered by Gemini 2.5 Flash vision model</li>
                  <li>Analyzes anatomical hearts and medical imaging</li>
                  <li>Shows 3D model for confidence above 55%</li>
                </ul>
              </div>
            </section>}
        </div>
      </main>
    </div>;
};
export default Index;