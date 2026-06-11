/**
 * Bloch sphere coordinate mathematics.
 * Converts between quantum state amplitudes and Bloch sphere coordinates.
 *
 * The Bloch sphere maps a qubit state |ψ⟩ = α|0⟩ + β|1⟩ to a point
 * on the unit sphere via:
 *   x = 2 Re(α* β)
 *   y = 2 Im(α* β)
 *   z = |α|² - |β|²
 *
 * Equivalently, using angles θ (polar) and φ (azimuthal):
 *   α = cos(θ/2)
 *   β = e^(iφ) sin(θ/2)
 */

import { Complex } from './complex';
import type { BlochCoordinates, BlochAngles } from '../types';

/**
 * Convert quantum state amplitudes to Bloch sphere Cartesian coordinates.
 * @param alpha - coefficient of |0⟩
 * @param beta  - coefficient of |1⟩
 * @returns Bloch sphere (x, y, z) coordinates
 */
export function stateToBloch(alpha: Complex, beta: Complex): BlochCoordinates {
  // α* β (conjugate of alpha times beta)
  const alphaConjBeta = alpha.conjugate().mul(beta);

  const x = 2 * alphaConjBeta.real;
  const y = 2 * alphaConjBeta.imag;
  const z = alpha.magnitudeSquared() - beta.magnitudeSquared();

  return { x, y, z };
}

/**
 * Convert Bloch angles to quantum state amplitudes.
 * @param theta - polar angle [0, π]
 * @param phi   - azimuthal angle [0, 2π)
 * @returns { alpha, beta } complex amplitudes
 */
export function blochAnglesToState(
  theta: number,
  phi: number
): { alpha: Complex; beta: Complex } {
  const alpha = new Complex(Math.cos(theta / 2), 0);
  const beta = Complex.fromPolar(Math.sin(theta / 2), phi);
  return { alpha, beta };
}

/**
 * Convert Bloch Cartesian coordinates to angular form.
 * @param coords - Bloch sphere (x, y, z)
 * @returns { theta, phi } angles
 */
export function blochToAngles(coords: BlochCoordinates): BlochAngles {
  const { x, y, z } = coords;

  // θ = arccos(z), but clamp z to [-1, 1] for numerical safety
  const theta = Math.acos(Math.max(-1, Math.min(1, z)));

  // φ = atan2(y, x)
  let phi = Math.atan2(y, x);
  if (phi < 0) phi += 2 * Math.PI;

  return { theta, phi };
}

/**
 * Convert quantum state amplitudes to Bloch angles.
 * @param alpha - coefficient of |0⟩
 * @param beta  - coefficient of |1⟩
 * @returns { theta, phi } angles
 */
export function stateToAngles(alpha: Complex, beta: Complex): BlochAngles {
  return blochToAngles(stateToBloch(alpha, beta));
}

/**
 * Linearly interpolate between two sets of Bloch coordinates along
 * the great circle (spherical linear interpolation on the unit sphere).
 * @param start - starting Bloch coordinates
 * @param end   - ending Bloch coordinates
 * @param t     - interpolation parameter [0, 1]
 * @returns interpolated Bloch coordinates (on the unit sphere)
 */
export function slerpBloch(
  start: BlochCoordinates,
  end: BlochCoordinates,
  t: number
): BlochCoordinates {
  // Compute the angle between the two vectors via dot product
  const dot = Math.max(
    -1,
    Math.min(1, start.x * end.x + start.y * end.y + start.z * end.z)
  );

  const omega = Math.acos(dot);

  // If vectors are nearly identical, use linear interpolation
  if (Math.abs(omega) < 1e-8) {
    return {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
      z: start.z + (end.z - start.z) * t,
    };
  }

  // If vectors are nearly opposite, pick an intermediate via a perpendicular
  if (Math.abs(omega - Math.PI) < 1e-8) {
    // Find a perpendicular vector
    const perp = findPerpendicular(start);
    const halfT = t < 0.5 ? t * 2 : (t - 0.5) * 2;

    if (t < 0.5) {
      return slerpBloch(start, perp, halfT);
    } else {
      return slerpBloch(perp, end, halfT);
    }
  }

  const sinOmega = Math.sin(omega);
  const a = Math.sin((1 - t) * omega) / sinOmega;
  const b = Math.sin(t * omega) / sinOmega;

  return {
    x: a * start.x + b * end.x,
    y: a * start.y + b * end.y,
    z: a * start.z + b * end.z,
  };
}

/**
 * Find a unit vector perpendicular to the given vector.
 * Used for slerp when start and end are antipodal.
 */
function findPerpendicular(v: BlochCoordinates): BlochCoordinates {
  // Choose the axis with smallest component for cross product stability
  const absX = Math.abs(v.x);
  const absY = Math.abs(v.y);
  const absZ = Math.abs(v.z);

  let crossWith: BlochCoordinates;
  if (absX <= absY && absX <= absZ) {
    crossWith = { x: 1, y: 0, z: 0 };
  } else if (absY <= absZ) {
    crossWith = { x: 0, y: 1, z: 0 };
  } else {
    crossWith = { x: 0, y: 0, z: 1 };
  }

  // Cross product
  const cx = v.y * crossWith.z - v.z * crossWith.y;
  const cy = v.z * crossWith.x - v.x * crossWith.z;
  const cz = v.x * crossWith.y - v.y * crossWith.x;

  // Normalize
  const mag = Math.sqrt(cx * cx + cy * cy + cz * cz);
  return { x: cx / mag, y: cy / mag, z: cz / mag };
}
