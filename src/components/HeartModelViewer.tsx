import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Center } from '@react-three/drei';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { HeartModel } from './HeartModel';

export const HeartModelViewer = () => {
  const { toast } = useToast();
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [glbBlob, setGlbBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        // Fetch the zip file
        const response = await fetch('/models/heart_model.zip');
        const blob = await response.blob();
        
        // Unzip the file
        const zip = new JSZip();
        const unzipped = await zip.loadAsync(blob);
        
        // Find the GLB file
        const glbFile = Object.keys(unzipped.files).find(
          filename => filename.toLowerCase().endsWith('.glb')
        );
        
        if (!glbFile) {
          throw new Error('No GLB file found in zip');
        }
        
        // Extract the GLB file
        const glbData = await unzipped.files[glbFile].async('blob');
        setGlbBlob(glbData);
        
        // Create a URL for the GLB file
        const url = URL.createObjectURL(glbData);
        setModelUrl(url);
        setIsLoading(false);
        
        toast({
          title: "Model loaded successfully",
          description: "3D heart model is ready to view",
        });
      } catch (error) {
        console.error('Error loading model:', error);
        setIsLoading(false);
        toast({
          title: "Error loading model",
          description: "Failed to extract and load the 3D model",
          variant: "destructive",
        });
      }
    };
    
    loadModel();
    
    // Cleanup
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, []);

  const handleSave = () => {
    if (glbBlob) {
      const url = URL.createObjectURL(glbBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'human_heart_3d_model.glb';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "3D model file is downloading",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden" style={{ height: '600px' }}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading 3D model...</p>
            </div>
          </div>
        ) : modelUrl ? (
          <Canvas>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={1}
                maxDistance={15}
                autoRotate={false}
              />
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <directionalLight position={[-10, -10, -5]} intensity={0.5} />
              <spotLight position={[0, 10, 0]} intensity={0.5} />
              <Environment preset="studio" />
              
              <Center>
                <HeartModel modelUrl={modelUrl} />
              </Center>
            </Suspense>
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-destructive">Failed to load model</p>
          </div>
        )}
      </div>

      {/* Save button - positioned subtly */}
      {modelUrl && (
        <Button
          onClick={handleSave}
          className="absolute bottom-6 right-6 shadow-lg"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Save Model
        </Button>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Use mouse to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </div>
  );
};
