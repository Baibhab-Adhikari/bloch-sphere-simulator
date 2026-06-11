/**
 * Quantum gate definitions.
 * Each gate is defined by its unitary matrix, name, and educational information.
 *
 * All matrices follow the standard quantum computing convention:
 *   U|ψ⟩ where |ψ⟩ = α|0⟩ + β|1⟩
 */

import { Complex } from './complex';
import type { Matrix2x2 } from './quantumState';
import type { GateName, GateEducationData } from '../types';

// ─── Gate Matrices ─────────────────────────────────────────────────────────

const SQRT2_INV = 1 / Math.SQRT2;

/** Pauli-X (NOT) gate: [[0,1],[1,0]] */
const X_MATRIX: Matrix2x2 = [
  [Complex.ZERO, Complex.ONE],
  [Complex.ONE, Complex.ZERO],
];

/** Pauli-Y gate: [[0,-i],[i,0]] */
const Y_MATRIX: Matrix2x2 = [
  [Complex.ZERO, Complex.NEG_I],
  [Complex.I, Complex.ZERO],
];

/** Pauli-Z gate: [[1,0],[0,-1]] */
const Z_MATRIX: Matrix2x2 = [
  [Complex.ONE, Complex.ZERO],
  [Complex.ZERO, new Complex(-1, 0)],
];

/** Hadamard gate: [[1,1],[1,-1]] / √2 */
const H_MATRIX: Matrix2x2 = [
  [new Complex(SQRT2_INV, 0), new Complex(SQRT2_INV, 0)],
  [new Complex(SQRT2_INV, 0), new Complex(-SQRT2_INV, 0)],
];

/** S (Phase) gate: [[1,0],[0,i]] */
const S_MATRIX: Matrix2x2 = [
  [Complex.ONE, Complex.ZERO],
  [Complex.ZERO, Complex.I],
];

/** T gate: [[1,0],[0,e^(iπ/4)]] */
const T_MATRIX: Matrix2x2 = [
  [Complex.ONE, Complex.ZERO],
  [Complex.ZERO, Complex.fromPolar(1, Math.PI / 4)],
];

/** SX (√X) gate: [[1+i, 1-i],[1-i, 1+i]] / 2 */
const SX_MATRIX: Matrix2x2 = [
  [new Complex(0.5, 0.5), new Complex(0.5, -0.5)],
  [new Complex(0.5, -0.5), new Complex(0.5, 0.5)],
];

// ─── Gate Map ──────────────────────────────────────────────────────────────

/** Map from gate name to its unitary matrix */
export const GATE_MATRICES: Record<GateName, Matrix2x2> = {
  X: X_MATRIX,
  Y: Y_MATRIX,
  Z: Z_MATRIX,
  H: H_MATRIX,
  S: S_MATRIX,
  T: T_MATRIX,
  SX: SX_MATRIX,
};

// ─── Gate Colors (for UI) ──────────────────────────────────────────────────

/** Color scheme for each gate button */
export const GATE_COLORS: Record<GateName, { bg: string; text: string; border: string; glow: string }> = {
  X: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)', glow: 'rgba(239, 68, 68, 0.2)' },
  Y: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)', glow: 'rgba(34, 197, 94, 0.2)' },
  Z: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)', glow: 'rgba(59, 130, 246, 0.2)' },
  H: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.3)', glow: 'rgba(168, 85, 247, 0.2)' },
  S: { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308', border: 'rgba(234, 179, 8, 0.3)', glow: 'rgba(234, 179, 8, 0.2)' },
  T: { bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.3)', glow: 'rgba(236, 72, 153, 0.2)' },
  SX: { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)', glow: 'rgba(6, 182, 212, 0.2)' },
};

// ─── Educational Data ──────────────────────────────────────────────────────

export const GATE_EDUCATION: Record<GateName, GateEducationData> = {
  X: {
    name: 'Pauli-X Gate',
    symbol: 'X',
    matrixDisplay: [['0', '1'], ['1', '0']],
    meaning: 'The quantum NOT gate. Flips |0⟩ to |1⟩ and vice versa. It is the quantum equivalent of a classical NOT operation.',
    blochInterpretation: 'Rotates the state by π (180°) around the X-axis of the Bloch sphere.',
    rotationAxis: 'X',
    rotationAngle: 'π',
  },
  Y: {
    name: 'Pauli-Y Gate',
    symbol: 'Y',
    matrixDisplay: [['0', '-i'], ['i', '0']],
    meaning: 'Maps |0⟩ to i|1⟩ and |1⟩ to -i|0⟩. Equivalent to combining bit-flip (X) and phase-flip (Z) operations, up to a global phase.',
    blochInterpretation: 'Rotates the state by π (180°) around the Y-axis of the Bloch sphere.',
    rotationAxis: 'Y',
    rotationAngle: 'π',
  },
  Z: {
    name: 'Pauli-Z Gate',
    symbol: 'Z',
    matrixDisplay: [['1', '0'], ['0', '-1']],
    meaning: 'The phase-flip gate. Leaves |0⟩ unchanged but flips the phase of |1⟩ to -|1⟩. Has no effect on computational basis measurements.',
    blochInterpretation: 'Rotates the state by π (180°) around the Z-axis of the Bloch sphere.',
    rotationAxis: 'Z',
    rotationAngle: 'π',
  },
  H: {
    name: 'Hadamard Gate',
    symbol: 'H',
    matrixDisplay: [['1/√2', '1/√2'], ['1/√2', '-1/√2']],
    meaning: 'Creates an equal superposition from a basis state. Maps |0⟩ to |+⟩ and |1⟩ to |−⟩. Fundamental for quantum algorithms.',
    blochInterpretation: 'Rotates the state by π (180°) around the axis halfway between X and Z (the X+Z diagonal).',
    rotationAxis: '(X+Z)/√2',
    rotationAngle: 'π',
  },
  S: {
    name: 'S Gate (Phase Gate)',
    symbol: 'S',
    matrixDisplay: [['1', '0'], ['0', 'i']],
    meaning: 'Applies a π/2 phase shift to |1⟩. Equivalent to the square root of the Z gate (S² = Z).',
    blochInterpretation: 'Rotates the state by π/2 (90°) around the Z-axis of the Bloch sphere.',
    rotationAxis: 'Z',
    rotationAngle: 'π/2',
  },
  T: {
    name: 'T Gate',
    symbol: 'T',
    matrixDisplay: [['1', '0'], ['0', 'e^(iπ/4)']],
    meaning: 'Applies a π/4 phase shift to |1⟩. Square root of the S gate (T² = S). Essential for universal quantum computation.',
    blochInterpretation: 'Rotates the state by π/4 (45°) around the Z-axis of the Bloch sphere.',
    rotationAxis: 'Z',
    rotationAngle: 'π/4',
  },
  SX: {
    name: '√X Gate',
    symbol: '√X',
    matrixDisplay: [['(1+i)/2', '(1-i)/2'], ['(1-i)/2', '(1+i)/2']],
    meaning: 'The square root of the X gate. Applying it twice produces the X gate (SX² = X). Creates a halfway rotation.',
    blochInterpretation: 'Rotates the state by π/2 (90°) around the X-axis of the Bloch sphere.',
    rotationAxis: 'X',
    rotationAngle: 'π/2',
  },
};

/** Ordered list of all gate names for UI rendering */
export const ALL_GATES: GateName[] = ['H', 'X', 'Y', 'Z', 'S', 'T', 'SX'];
