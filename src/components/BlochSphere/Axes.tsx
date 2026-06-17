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
  { direction: new THREE.Vector3(1, 0, 0), color: '#dc2626', opacity: 1.0 },  // X — bold red
  { direction: new THREE.Vector3(0, 1, 0), color: '#2563eb', opacity: 1.0 },  // Z-axis (vertical) — bold blue
  { direction: new THREE.Vector3(0, 0, 1), color: '#16a34a', opacity: 1.0 },  // Y-axis (depth) — bold green
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
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={1.0} />
          </mesh>

          {/* Negative endpoint sphere */}
          <mesh position={direction.clone().multiplyScalar(-AXIS_LENGTH)}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
