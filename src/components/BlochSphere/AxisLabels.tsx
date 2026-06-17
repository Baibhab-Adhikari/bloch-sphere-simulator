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
  { position: [0, 1.55, 0], text: '|0⟩', color: '#1d4ed8', size: 18, isBasis: true },
  { position: [0, -1.55, 0], text: '|1⟩', color: '#1d4ed8', size: 18, isBasis: true },

  // Axes
  { position: [1.55, 0, 0], text: 'X', color: '#dc2626', size: 16 },
  { position: [-1.55, 0, 0], text: '-X', color: '#dc2626', size: 14 },
  { position: [0, 0, 1.55], text: 'Y', color: '#16a34a', size: 16 },
  { position: [0, 0, -1.55], text: '-Y', color: '#16a34a', size: 14 },
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
              fontWeight: 700,
              color: label.color,
              textShadow: '0 1px 3px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.6)',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              letterSpacing: label.isBasis ? '0.02em' : '0.08em',
            }}
          >
            {label.text}
          </div>
        </Html>
      ))}
    </group>
  );
}
