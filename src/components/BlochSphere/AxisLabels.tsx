/**
 * AxisLabels — Billboard text labels for Bloch sphere axes.
 *
 * Uses Drei's Html component to render labels that always face the camera.
 * Shows |0⟩, |1⟩ at poles and X, Y, Z at axis endpoints.
 */

import { Html } from '@react-three/drei';

interface LabelConfig {
  position: [number, number, number];
  text: string;
  color: string;
  size: number;
  isBasis?: boolean;
}

const LABELS: LabelConfig[] = [
  // Poles
  { position: [0, 1.55, 0], text: '|0⟩', color: '#60a5fa', size: 15, isBasis: true },
  { position: [0, -1.55, 0], text: '|1⟩', color: '#60a5fa', size: 15, isBasis: true },

  // Axes
  { position: [1.55, 0, 0], text: 'X', color: '#ef4444', size: 13 },
  { position: [-1.55, 0, 0], text: '-X', color: '#ef4444', size: 11 },
  { position: [0, 0, 1.55], text: 'Y', color: '#22c55e', size: 13 },
  { position: [0, 0, -1.55], text: '-Y', color: '#22c55e', size: 11 },
];

export function AxisLabels() {
  return (
    <group>
      {LABELS.map((label) => (
        <Html
          key={label.text}
          position={label.position}
          center
          distanceFactor={5}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              fontFamily: label.isBasis ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
              fontSize: `${label.size}px`,
              fontWeight: label.isBasis ? 600 : 500,
              color: label.color,
              textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              letterSpacing: label.isBasis ? '0.02em' : '0.05em',
            }}
          >
            {label.text}
          </div>
        </Html>
      ))}
    </group>
  );
}
