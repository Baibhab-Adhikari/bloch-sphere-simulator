/**
 * TrajectoryTrail — Renders the rotation arc on the Bloch sphere surface.
 *
 * During gate animations, draws a glowing line tracing the path the state
 * vector has taken so far. For rotation-based animations, this is the true
 * rotation arc around the gate's axis. For slerp-based animations (presets,
 * undo, reset), it traces the shortest great-circle arc.
 *
 * Uses Drei's <Line> component (backed by Line2) to support actual thick
 * lines, since WebGL's native linewidth is capped at 1px on most platforms.
 */

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { rotateBlochVector } from '../../engine/gateRotations';
import { slerpBloch } from '../../engine/blochMath';
import type { TrailData } from '../../hooks/useAnimation';

interface TrajectoryTrailProps {
  trailData: TrailData | null;
}

/** Number of sample points along the trail arc */
const TRAIL_SEGMENTS = 80;

/**
 * Convert Bloch coordinates to Three.js coordinates.
 * Bloch: X→right, Y→depth, Z→up
 * Three.js: X→right, Y→up, Z→depth
 */
function blochToThreeJs(b: { x: number; y: number; z: number }): [number, number, number] {
  return [b.x, b.z, b.y];
}

export function TrajectoryTrail({ trailData }: TrajectoryTrailProps) {
  const points = useMemo(() => {
    if (!trailData || trailData.easedProgress < 0.005) return null;

    const result: [number, number, number][] = [];
    const numPoints = Math.max(2, Math.ceil(TRAIL_SEGMENTS * trailData.easedProgress));

    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * trailData.easedProgress;

      let blochPos;
      if (trailData.rotationAxis && trailData.rotationAngle !== undefined) {
        // Gate animation: compute point along the rotation arc
        blochPos = rotateBlochVector(
          trailData.from,
          trailData.rotationAxis,
          trailData.rotationAngle,
          t
        );
      } else {
        // Slerp fallback: compute point along the great-circle arc
        blochPos = slerpBloch(trailData.from, trailData.to, t);
      }

      result.push(blochToThreeJs(blochPos));
    }

    return result;
  }, [trailData]);

  if (!points || points.length < 2) return null;

  return (
    <group>
      {/* Main bold trail line */}
      <Line
        points={points}
        color="#ea580c"
        lineWidth={4}
        transparent
        opacity={1.0}
      />

      {/* Wider glow trail behind */}
      <Line
        points={points}
        color="#f97316"
        lineWidth={4}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </group>
  );
}
