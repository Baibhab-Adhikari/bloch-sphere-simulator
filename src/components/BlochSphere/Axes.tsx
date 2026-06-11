/**
 * Axes — X, Y, Z axes through the Bloch sphere with color coding.
 *
 * X = red, Y = green, Z = blue (standard convention).
 * Each axis extends from -1.3 to +1.3 with small endpoint markers.
 */

import { useMemo } from 'react';
import * as THREE from 'three';

interface AxisConfig {
  direction: THREE.Vector3;
  color: string;
  opacity: number;
}

const AXIS_LENGTH = 1.35;

const AXES: AxisConfig[] = [
  { direction: new THREE.Vector3(1, 0, 0), color: '#ef4444', opacity: 0.5 },  // X — red
  { direction: new THREE.Vector3(0, 1, 0), color: '#3b82f6', opacity: 0.5 },  // Y (mapped to Z in Bloch) — blue
  { direction: new THREE.Vector3(0, 0, 1), color: '#22c55e', opacity: 0.5 },  // Z (mapped to Y in Bloch) — green
];

export function Axes() {
  const axisGeometries = useMemo(() => {
    return AXES.map(({ direction }) => {
      const points = [
        direction.clone().multiplyScalar(-AXIS_LENGTH),
        direction.clone().multiplyScalar(AXIS_LENGTH),
      ];
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  return (
    <group>
      {AXES.map(({ direction, color, opacity }, i) => (
        <group key={`axis-${i}`}>
          {/* Axis line */}
          {/* @ts-expect-error - R3F <line> clashes with React's SVG <line> type */}
          <line geometry={axisGeometries[i]}>
            <lineBasicMaterial color={color} transparent opacity={opacity} />
          </line>

          {/* Positive endpoint sphere */}
          <mesh position={direction.clone().multiplyScalar(AXIS_LENGTH)}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>

          {/* Negative endpoint sphere */}
          <mesh position={direction.clone().multiplyScalar(-AXIS_LENGTH)}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
