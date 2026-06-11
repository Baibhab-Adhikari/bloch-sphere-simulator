/**
 * StateVector — Animated arrow showing the qubit state on the Bloch sphere.
 *
 * Renders a cylinder (shaft) + cone (head) arrow from the origin to the
 * current Bloch coordinate. Position is driven by the animation system.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BlochCoordinates } from '../../types';

interface StateVectorProps {
  position: BlochCoordinates;
}

const ARROW_COLOR = '#06b6d4';
const GLOW_COLOR = '#22d3ee';
const SHAFT_RADIUS = 0.018;
const HEAD_RADIUS = 0.055;
const HEAD_LENGTH = 0.12;

export function StateVector({ position }: StateVectorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Compute the direction and length
  const { direction, length, quaternion } = useMemo(() => {
    const dir = new THREE.Vector3(position.x, position.z, position.y); // Bloch→Three.js mapping
    const len = dir.length();
    const q = new THREE.Quaternion();

    if (len > 1e-8) {
      const normalized = dir.clone().normalize();
      q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalized);
    }

    return { direction: dir, length: len, quaternion: q };
  }, [position.x, position.y, position.z]);

  // Animate glow pulsing
  useFrame((_, delta) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const t = (Date.now() % 2000) / 2000;
      mat.opacity = 0.15 + 0.1 * Math.sin(t * Math.PI * 2);
    }
  });

  if (length < 1e-8) return null;

  const shaftLength = Math.max(0, length - HEAD_LENGTH);

  return (
    <group ref={groupRef} quaternion={quaternion}>
      {/* Shaft (cylinder along Y) */}
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, shaftLength, 12]} />
        <meshStandardMaterial
          color={ARROW_COLOR}
          emissive={ARROW_COLOR}
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Arrow head (cone) */}
      <mesh position={[0, shaftLength + HEAD_LENGTH / 2, 0]}>
        <coneGeometry args={[HEAD_RADIUS, HEAD_LENGTH, 16]} />
        <meshStandardMaterial
          color={ARROW_COLOR}
          emissive={ARROW_COLOR}
          emissiveIntensity={0.4}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, length / 2, 0]}>
        <cylinderGeometry args={[SHAFT_RADIUS * 3, SHAFT_RADIUS * 3, length, 8]} />
        <meshBasicMaterial
          color={GLOW_COLOR}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Endpoint dot */}
      <mesh position={[0, length, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={GLOW_COLOR}
          emissive={GLOW_COLOR}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
