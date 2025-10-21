import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface HeartModelProps {
  modelUrl: string;
}

export const HeartModel = ({ modelUrl }: HeartModelProps) => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    if (groupRef.current) {
      // Center and scale the model
      groupRef.current.rotation.y = Math.PI / 4;
    }
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2} />
    </group>
  );
};
