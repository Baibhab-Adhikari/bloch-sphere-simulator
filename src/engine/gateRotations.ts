/**
 * Gate rotation definitions for physically accurate Bloch sphere animations.
 *
 * Each single-qubit gate corresponds to a rotation of the Bloch vector
 * around a specific axis by a specific angle. This module defines those
 * rotations and provides Rodrigues' rotation formula for computing the
 * Bloch vector position at any point during the animation.
 *
 * Rodrigues' rotation formula:
 *   R(n̂, θ, v) = v·cos(θ) + (n̂ × v)·sin(θ) + n̂·(n̂ · v)·(1 − cos(θ))
 *
 * This guarantees that the animated vector:
 *   1. Stays on the unit sphere surface at all times
 *   2. Follows the true physical rotation path of the gate
 *   3. Never cuts through the sphere interior
 */

import type { GateName, BlochCoordinates } from '../types';

// ─── Rotation Definitions ──────────────────────────────────────────────────

export interface GateRotation {
  /** Unit vector defining the rotation axis in Bloch coordinates */
  axis: BlochCoordinates;
  /** Total rotation angle in radians (positive = right-hand rule) */
  angle: number;
}

const SQRT2_INV = 1 / Math.SQRT2;

/**
 * Physical rotation parameters for each quantum gate.
 *
 * X  = Rx(π)      — 180° around X-axis
 * Y  = Ry(π)      — 180° around Y-axis
 * Z  = Rz(π)      — 180° around Z-axis
 * H  = R_{(X+Z)/√2}(π) — 180° around the (X+Z)/√2 diagonal
 * S  = Rz(π/2)    — 90° around Z-axis
 * T  = Rz(π/4)    — 45° around Z-axis
 * SX = Rx(π/2)    — 90° around X-axis
 */
export const GATE_ROTATIONS: Record<GateName, GateRotation> = {
  X:  { axis: { x: 1, y: 0, z: 0 },                     angle: Math.PI },
  Y:  { axis: { x: 0, y: 1, z: 0 },                     angle: Math.PI },
  Z:  { axis: { x: 0, y: 0, z: 1 },                     angle: Math.PI },
  H:  { axis: { x: SQRT2_INV, y: 0, z: SQRT2_INV },     angle: Math.PI },
  S:  { axis: { x: 0, y: 0, z: 1 },                     angle: Math.PI / 2 },
  T:  { axis: { x: 0, y: 0, z: 1 },                     angle: Math.PI / 4 },
  SX: { axis: { x: 1, y: 0, z: 0 },                     angle: Math.PI / 2 },
};

// ─── Rodrigues' Rotation ───────────────────────────────────────────────────

/**
 * Compute the Bloch vector at fraction t of a rotation.
 *
 * Applies Rodrigues' rotation formula to rotate vector `start` by
 * angle `(totalAngle * t)` around unit axis `axis`.
 *
 * @param start      - Starting Bloch vector (must be unit length)
 * @param axis       - Unit rotation axis in Bloch coordinates
 * @param totalAngle - Full rotation angle in radians
 * @param t          - Interpolation fraction [0, 1]
 * @returns          - Rotated Bloch vector (unit length, on sphere surface)
 */
export function rotateBlochVector(
  start: BlochCoordinates,
  axis: BlochCoordinates,
  totalAngle: number,
  t: number
): BlochCoordinates {
  const theta = totalAngle * t;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  // Dot product: n̂ · v
  const dot = axis.x * start.x + axis.y * start.y + axis.z * start.z;

  // Cross product: n̂ × v
  const crossX = axis.y * start.z - axis.z * start.y;
  const crossY = axis.z * start.x - axis.x * start.z;
  const crossZ = axis.x * start.y - axis.y * start.x;

  // Rodrigues' formula: v·cos(θ) + (n̂ × v)·sin(θ) + n̂·(n̂ · v)·(1 − cos(θ))
  const x = start.x * cosT + crossX * sinT + axis.x * dot * (1 - cosT);
  const y = start.y * cosT + crossY * sinT + axis.y * dot * (1 - cosT);
  const z = start.z * cosT + crossZ * sinT + axis.z * dot * (1 - cosT);

  // Re-normalize to guarantee unit length (guards against floating-point drift)
  const mag = Math.sqrt(x * x + y * y + z * z);
  if (mag < 1e-12) {
    return start; // Degenerate case: return start
  }

  return { x: x / mag, y: y / mag, z: z / mag };
}
