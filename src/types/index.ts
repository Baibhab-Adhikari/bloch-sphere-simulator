/**
 * Core type definitions for the Bloch Sphere Simulator.
 * All interfaces and type aliases used across the application.
 */

// ─── Gate Types ──────────────────────────────────────────────────────────────

/** Names of all supported quantum gates */
export type GateName = 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' | 'SX';

/** Names of all preset quantum states */
export type PresetName = '|0⟩' | '|1⟩' | '|+⟩' | '|−⟩' | '|i+⟩' | '|i−⟩';

// ─── Animation Types ─────────────────────────────────────────────────────────

/** Current status of the animation system */
export type AnimationStatus = 'idle' | 'playing' | 'paused';

/** Supported animation speed multipliers */
export type SpeedMultiplier = 0.25 | 0.5 | 1 | 2;

/** All available speed options */
export const SPEED_OPTIONS: SpeedMultiplier[] = [0.25, 0.5, 1, 2];

// ─── Coordinate Types ────────────────────────────────────────────────────────

/** Bloch sphere Cartesian coordinates */
export interface BlochCoordinates {
  x: number;
  y: number;
  z: number;
}

/** Bloch sphere angular coordinates */
export interface BlochAngles {
  theta: number; // polar angle [0, π]
  phi: number;   // azimuthal angle [0, 2π)
}

// ─── State & History Types ───────────────────────────────────────────────────

/** A single entry in the gate history timeline */
export interface HistoryEntry {
  step: number;
  label: string;
  stateAlphaReal: number;
  stateAlphaImag: number;
  stateBetaReal: number;
  stateBetaImag: number;
}

/** A gate queued for application */
export interface QueuedGate {
  id: string;       // unique ID for React keys
  name: GateName;
}

// ─── Animation State ─────────────────────────────────────────────────────────

/** Full animation state for the UI */
export interface AnimationState {
  status: AnimationStatus;
  progress: number;        // 0..1
  speed: SpeedMultiplier;
}

// ─── Educational Data Types ──────────────────────────────────────────────────

/** Educational information about a quantum gate */
export interface GateEducationData {
  name: string;
  symbol: string;
  matrixDisplay: string[][];  // 2x2 matrix as display strings
  meaning: string;
  blochInterpretation: string;
  rotationAxis?: string;
  rotationAngle?: string;
}

// ─── Complex Number Display ──────────────────────────────────────────────────

/** A complex number in display-friendly format */
export interface ComplexDisplay {
  real: number;
  imag: number;
  magnitude: number;
  phase: number;
  display: string;
}

/** Full quantum state display info */
export interface StateDisplayInfo {
  alpha: ComplexDisplay;
  beta: ComplexDisplay;
  bloch: BlochCoordinates;
  angles: BlochAngles;
  diracNotation: string;
}
