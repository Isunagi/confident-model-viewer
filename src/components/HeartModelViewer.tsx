import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const HeartModelViewer = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Download initiated",
      description: "3D model file is being prepared for download",
    });
    // In production, this would download the GLB file from the zip
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden" style={{ height: '600px' }}>
        <Canvas>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
            />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            <Environment preset="studio" />
            
            {/* Placeholder heart shape using basic geometry */}
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial 
                color="#e63946"
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[0.5, 0.5, 0]}>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial 
                color="#d62828"
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[-0.5, 0.5, 0]}>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial 
                color="#d62828"
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
          </Suspense>
        </Canvas>
      </div>

      {/* Save button - positioned subtly */}
      <Button
        onClick={handleSave}
        className="absolute bottom-6 right-6 shadow-lg"
        size="lg"
      >
        <Download className="w-4 h-4 mr-2" />
        Save Model
      </Button>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Use mouse to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </div>
  );
};
