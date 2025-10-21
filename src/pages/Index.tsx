import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ConfidenceDisplay } from '@/components/ConfidenceDisplay';
import { HeartModelViewer } from '@/components/HeartModelViewer';
import { Activity } from 'lucide-react';
import { analyzeImageForHeart } from '@/lib/imageAnalysis';
import { toast } from '@/hooks/use-toast';
const Index = () => {
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setConfidence(null);

    try {
      // Use browser-based AI vision model to analyze the image
      const detectedConfidence = await analyzeImageForHeart(file);
      setConfidence(detectedConfidence);
      
      if (detectedConfidence > 55) {
        toast({
          title: "Heart detected!",
          description: `Confidence: ${detectedConfidence}%`,
        });
      } else {
        toast({
          title: "Low confidence",
          description: "Image may not contain a clear heart structure",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
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

          {/* Integration Note */}
          {confidence === null && !isProcessing && <section className="max-w-2xl mx-auto">
              <div className="bg-muted/30 rounded-xl p-6 border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  🔧 Model Integration Required
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The PyTorch model (my_model.pt) needs backend integration. Options:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Convert to ONNX format for browser-based inference</li>
                  <li>Set up Python API endpoint with PyTorch</li>
                  <li>Use cloud ML services (AWS SageMaker, Google Vertex AI)</li>
                </ul>
              </div>
            </section>}
        </div>
      </main>
    </div>;
};
export default Index;