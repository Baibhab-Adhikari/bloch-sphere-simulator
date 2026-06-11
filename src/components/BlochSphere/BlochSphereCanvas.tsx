/**
 * BlochSphereCanvas — Main 3D scene containing the Bloch sphere visualization.
 *
 * Wraps all 3D components in an R3F Canvas with orbit controls,
 * lighting, and camera setup.
 */

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Sphere } from './Sphere';
import { StateVector } from './StateVector';
import { Axes } from './Axes';
import { AxisLabels } from './AxisLabels';
import type { BlochCoordinates } from '../../types';

interface BlochSphereCanvasProps {
  position: BlochCoordinates;
  animationUpdate: (deltaMs: number) => void;
}

/** Inner scene component that has access to useFrame */
function Scene({ position, animationUpdate }: BlochSphereCanvasProps) {
  const lastTimeRef = useRef<number | null>(null);

  useFrame((state) => {
    const now = state.clock.getElapsedTime() * 1000;
    if (lastTimeRef.current !== null) {
      const delta = now - lastTimeRef.current;
      animationUpdate(delta);
    }
    lastTimeRef.current = now;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#8b5cf6" />
      <directionalLight position={[0, 5, 0]} intensity={0.2} />

      {/* Bloch sphere components */}
      <Sphere />
      <Axes />
      <AxisLabels />
      <StateVector position={position} />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.5}
        maxDistance={6}
        rotateSpeed={0.5}
      />
    </>
  );
}

export function BlochSphereCanvas({ position, animationUpdate }: BlochSphereCanvasProps) {
  return (
    <div className="w-full h-full" id="bloch-sphere-canvas">
      <Canvas
        camera={{ position: [2.2, 1.8, 2.2], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene position={position} animationUpdate={animationUpdate} />
      </Canvas>
    </div>
  );
}
