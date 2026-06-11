/**
 * Quantum state representation: |ψ⟩ = α|0⟩ + β|1⟩
 *
 * This class encapsulates a single-qubit pure quantum state,
 * providing gate application, normalization, and Bloch sphere projections.
 */

import { Complex } from './complex';
import { stateToBloch, stateToAngles, blochAnglesToState } from './blochMath';
import type { BlochCoordinates, BlochAngles, ComplexDisplay, StateDisplayInfo } from '../types';

/** 2x2 complex matrix type used for quantum gates */
export type Matrix2x2 = [[Complex, Complex], [Complex, Complex]];

export class QuantumState {
  public readonly alpha: Complex;
  public readonly beta: Complex;

  constructor(alpha: Complex, beta: Complex) {
    // Always store in normalized form
    const norm = Math.sqrt(alpha.magnitudeSquared() + beta.magnitudeSquared());
    if (norm < 1e-15) {
      throw new Error('Cannot create a zero quantum state');
    }
    this.alpha = alpha.scale(1 / norm);
    this.beta = beta.scale(1 / norm);
  }

  // ─── Static Presets ──────────────────────────────────────────────────────

  /** |0⟩ state — north pole */
  static readonly ZERO = new QuantumState(Complex.ONE, Complex.ZERO);

  /** |1⟩ state — south pole */
  static readonly ONE = new QuantumState(Complex.ZERO, Complex.ONE);

  /** |+⟩ = (|0⟩ + |1⟩)/√2 — positive X axis */
  static readonly PLUS = new QuantumState(
    new Complex(1 / Math.SQRT2, 0),
    new Complex(1 / Math.SQRT2, 0)
  );

  /** |−⟩ = (|0⟩ - |1⟩)/√2 — negative X axis */
  static readonly MINUS = new QuantumState(
    new Complex(1 / Math.SQRT2, 0),
    new Complex(-1 / Math.SQRT2, 0)
  );

  /** |i+⟩ = (|0⟩ + i|1⟩)/√2 — positive Y axis */
  static readonly I_PLUS = new QuantumState(
    new Complex(1 / Math.SQRT2, 0),
    new Complex(0, 1 / Math.SQRT2)
  );

  /** |i−⟩ = (|0⟩ - i|1⟩)/√2 — negative Y axis */
  static readonly I_MINUS = new QuantumState(
    new Complex(1 / Math.SQRT2, 0),
    new Complex(0, -1 / Math.SQRT2)
  );

  // ─── Factory Methods ─────────────────────────────────────────────────────

  /** Create a state from Bloch sphere angles */
  static fromBlochAngles(theta: number, phi: number): QuantumState {
    const { alpha, beta } = blochAnglesToState(theta, phi);
    return new QuantumState(alpha, beta);
  }

  /** Reconstruct from serialized components */
  static fromComponents(
    alphaReal: number,
    alphaImag: number,
    betaReal: number,
    betaImag: number
  ): QuantumState {
    return new QuantumState(
      new Complex(alphaReal, alphaImag),
      new Complex(betaReal, betaImag)
    );
  }

  // ─── Gate Application ────────────────────────────────────────────────────

  /**
   * Apply a 2x2 unitary gate matrix to this state.
   * |ψ'⟩ = U|ψ⟩
   *
   * [ u00  u01 ] [ α ]   [ u00·α + u01·β ]
   * [ u10  u11 ] [ β ] = [ u10·α + u11·β ]
   */
  applyGate(matrix: Matrix2x2): QuantumState {
    const [[u00, u01], [u10, u11]] = matrix;
    const newAlpha = u00.mul(this.alpha).add(u01.mul(this.beta));
    const newBeta = u10.mul(this.alpha).add(u11.mul(this.beta));
    return new QuantumState(newAlpha, newBeta);
  }

  // ─── Bloch Sphere Projections ────────────────────────────────────────────

  /** Get Bloch sphere Cartesian coordinates */
  getBlochCoordinates(): BlochCoordinates {
    return stateToBloch(this.alpha, this.beta);
  }

  /** Get Bloch sphere angular coordinates */
  getBlochAngles(): BlochAngles {
    return stateToAngles(this.alpha, this.beta);
  }

  // ─── Display ─────────────────────────────────────────────────────────────

  /** Get Dirac notation string */
  toDiracNotation(): string {
    const a = this.alpha.toString(3);
    const b = this.beta.toString(3);

    // Handle special cases for cleaner display
    if (this.beta.magnitude() < 1e-6) return `|ψ⟩ = ${a}|0⟩`;
    if (this.alpha.magnitude() < 1e-6) return `|ψ⟩ = ${b}|1⟩`;

    return `|ψ⟩ = (${a})|0⟩ + (${b})|1⟩`;
  }

  /** Get full display information for the UI */
  getDisplayInfo(): StateDisplayInfo {
    const bloch = this.getBlochCoordinates();
    const angles = this.getBlochAngles();

    return {
      alpha: this.formatComplex(this.alpha),
      beta: this.formatComplex(this.beta),
      bloch,
      angles,
      diracNotation: this.toDiracNotation(),
    };
  }

  /** Check approximate equality with another state (up to global phase) */
  equals(other: QuantumState, epsilon: number = 1e-6): boolean {
    // Two states are equivalent if their Bloch vectors are the same
    const thisBloch = this.getBlochCoordinates();
    const otherBloch = other.getBlochCoordinates();
    return (
      Math.abs(thisBloch.x - otherBloch.x) < epsilon &&
      Math.abs(thisBloch.y - otherBloch.y) < epsilon &&
      Math.abs(thisBloch.z - otherBloch.z) < epsilon
    );
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private formatComplex(c: Complex): ComplexDisplay {
    return {
      real: c.real,
      imag: c.imag,
      magnitude: c.magnitude(),
      phase: c.phase(),
      display: c.toString(4),
    };
  }
}
