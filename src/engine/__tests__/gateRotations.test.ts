/**
 * Comprehensive verification of quantum gate correctness.
 *
 * Tests three layers of the system:
 *   1. Gate matrices produce the correct final quantum state
 *   2. Bloch coordinate formulas map states to correct sphere positions
 *   3. Rodrigues' rotation matches the matrix result at t=1
 *
 * Every test case comes directly from the physics specification.
 */

import { describe, it, expect } from 'vitest';
import { QuantumState } from '../quantumState';
import { GATE_MATRICES } from '../gates';
import { GATE_ROTATIONS, rotateBlochVector } from '../gateRotations';
import { stateToBloch } from '../blochMath';
import type { BlochCoordinates } from '../../types';
import type { GateName } from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function expectBlochNear(actual: BlochCoordinates, expected: BlochCoordinates, _label: string) {
  expect(actual.x).toBeCloseTo(expected.x, 5);
  expect(actual.y).toBeCloseTo(expected.y, 5);
  expect(actual.z).toBeCloseTo(expected.z, 5);
}

function blochOf(state: QuantumState): BlochCoordinates {
  return stateToBloch(state.alpha, state.beta);
}

/** Named starting states */
const STATES: Record<string, { state: QuantumState; bloch: BlochCoordinates }> = {
  '|0⟩': { state: QuantumState.ZERO,    bloch: { x: 0, y: 0, z: 1 } },
  '|1⟩': { state: QuantumState.ONE,     bloch: { x: 0, y: 0, z: -1 } },
  '|+⟩': { state: QuantumState.PLUS,    bloch: { x: 1, y: 0, z: 0 } },
  '|−⟩': { state: QuantumState.MINUS,   bloch: { x: -1, y: 0, z: 0 } },
  '|i+⟩': { state: QuantumState.I_PLUS,  bloch: { x: 0, y: 1, z: 0 } },
  '|i−⟩': { state: QuantumState.I_MINUS, bloch: { x: 0, y: -1, z: 0 } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 1: Bloch coordinates of preset states
// ═══════════════════════════════════════════════════════════════════════════════

describe('Bloch coordinates of basis states', () => {
  for (const [name, { state, bloch }] of Object.entries(STATES)) {
    it(`${name} maps to correct Bloch vector`, () => {
      expectBlochNear(blochOf(state), bloch, name);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 2: Gate matrix application → correct final states
// ═══════════════════════════════════════════════════════════════════════════════

describe('Gate matrix application', () => {

  // ── Pauli-X ──────────────────────────────────────────────────────────────
  describe('Pauli-X gate', () => {
    it('|0⟩ → |1⟩', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.X);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: -1 }, 'X|0⟩');
    });
    it('|1⟩ → |0⟩', () => {
      const result = QuantumState.ONE.applyGate(GATE_MATRICES.X);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: 1 }, 'X|1⟩');
    });
    it('|+⟩ remains unchanged (on rotation axis)', () => {
      const result = QuantumState.PLUS.applyGate(GATE_MATRICES.X);
      expectBlochNear(blochOf(result), { x: 1, y: 0, z: 0 }, 'X|+⟩');
    });
    it('|i+⟩ → |i−⟩', () => {
      const result = QuantumState.I_PLUS.applyGate(GATE_MATRICES.X);
      expectBlochNear(blochOf(result), { x: 0, y: -1, z: 0 }, 'X|i+⟩');
    });
  });

  // ── Pauli-Y ──────────────────────────────────────────────────────────────
  describe('Pauli-Y gate', () => {
    it('|0⟩ → |1⟩ on Bloch sphere (global phase ignored)', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.Y);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: -1 }, 'Y|0⟩');
    });
    it('|+⟩ ↔ |−⟩', () => {
      const result = QuantumState.PLUS.applyGate(GATE_MATRICES.Y);
      expectBlochNear(blochOf(result), { x: -1, y: 0, z: 0 }, 'Y|+⟩');
    });
    it('|i+⟩ remains unchanged (on rotation axis)', () => {
      const result = QuantumState.I_PLUS.applyGate(GATE_MATRICES.Y);
      expectBlochNear(blochOf(result), { x: 0, y: 1, z: 0 }, 'Y|i+⟩');
    });
  });

  // ── Pauli-Z ──────────────────────────────────────────────────────────────
  describe('Pauli-Z gate', () => {
    it('|0⟩ remains fixed (on rotation axis)', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.Z);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: 1 }, 'Z|0⟩');
    });
    it('|1⟩ remains fixed (on rotation axis)', () => {
      const result = QuantumState.ONE.applyGate(GATE_MATRICES.Z);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: -1 }, 'Z|1⟩');
    });
    it('|+⟩ ↔ |−⟩', () => {
      const result = QuantumState.PLUS.applyGate(GATE_MATRICES.Z);
      expectBlochNear(blochOf(result), { x: -1, y: 0, z: 0 }, 'Z|+⟩');
    });
    it('|i+⟩ ↔ |i−⟩', () => {
      const result = QuantumState.I_PLUS.applyGate(GATE_MATRICES.Z);
      expectBlochNear(blochOf(result), { x: 0, y: -1, z: 0 }, 'Z|i+⟩');
    });
  });

  // ── Hadamard ─────────────────────────────────────────────────────────────
  describe('Hadamard gate', () => {
    it('|0⟩ → |+⟩', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.H);
      expectBlochNear(blochOf(result), { x: 1, y: 0, z: 0 }, 'H|0⟩');
    });
    it('|1⟩ → |−⟩', () => {
      const result = QuantumState.ONE.applyGate(GATE_MATRICES.H);
      expectBlochNear(blochOf(result), { x: -1, y: 0, z: 0 }, 'H|1⟩');
    });
    it('|+⟩ → |0⟩', () => {
      const result = QuantumState.PLUS.applyGate(GATE_MATRICES.H);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: 1 }, 'H|+⟩');
    });
    it('|−⟩ → |1⟩', () => {
      const result = QuantumState.MINUS.applyGate(GATE_MATRICES.H);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: -1 }, 'H|−⟩');
    });
  });

  // ── S Gate ───────────────────────────────────────────────────────────────
  describe('S gate', () => {
    it('|+⟩ → |i+⟩', () => {
      const result = QuantumState.PLUS.applyGate(GATE_MATRICES.S);
      expectBlochNear(blochOf(result), { x: 0, y: 1, z: 0 }, 'S|+⟩');
    });
    it('|i+⟩ → |−⟩', () => {
      const result = QuantumState.I_PLUS.applyGate(GATE_MATRICES.S);
      expectBlochNear(blochOf(result), { x: -1, y: 0, z: 0 }, 'S|i+⟩');
    });
    it('|0⟩ remains fixed', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.S);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: 1 }, 'S|0⟩');
    });
  });

  // ── T Gate ───────────────────────────────────────────────────────────────
  describe('T gate', () => {
    it('|+⟩ rotates 45° toward |i+⟩', () => {
      const result = QuantumState.PLUS.applyGate(GATE_MATRICES.T);
      const expected = { x: Math.cos(Math.PI / 4), y: Math.sin(Math.PI / 4), z: 0 };
      expectBlochNear(blochOf(result), expected, 'T|+⟩');
    });
    it('|0⟩ remains fixed', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.T);
      expectBlochNear(blochOf(result), { x: 0, y: 0, z: 1 }, 'T|0⟩');
    });
  });

  // ── √X Gate ──────────────────────────────────────────────────────────────
  describe('√X gate', () => {
    it('|0⟩ → |i−⟩ (−Y on Bloch sphere)', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.SX);
      expectBlochNear(blochOf(result), { x: 0, y: -1, z: 0 }, '√X|0⟩');
    });
    it('|1⟩ → |i+⟩ (+Y on Bloch sphere)', () => {
      const result = QuantumState.ONE.applyGate(GATE_MATRICES.SX);
      expectBlochNear(blochOf(result), { x: 0, y: 1, z: 0 }, '√X|1⟩');
    });
    it('Applying twice equals X gate', () => {
      const once = QuantumState.ZERO.applyGate(GATE_MATRICES.SX);
      const twice = once.applyGate(GATE_MATRICES.SX);
      expectBlochNear(blochOf(twice), { x: 0, y: 0, z: -1 }, '(√X)²|0⟩');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 3: Rodrigues' rotation matches matrix result at t=1
// ═══════════════════════════════════════════════════════════════════════════════

describe('Rodrigues rotation matches matrix application', () => {
  const gateNames: GateName[] = ['X', 'Y', 'Z', 'H', 'S', 'T', 'SX'];
  const stateNames = Object.keys(STATES);

  for (const gate of gateNames) {
    describe(`${gate} gate`, () => {
      for (const stateName of stateNames) {
        it(`${gate} on ${stateName}: rotation at t=1 matches matrix result`, () => {
          const { state, bloch: startBloch } = STATES[stateName];
          const rotation = GATE_ROTATIONS[gate];

          // Matrix result
          const matrixResult = state.applyGate(GATE_MATRICES[gate]);
          const matrixBloch = blochOf(matrixResult);

          // Rodrigues' rotation result at t=1
          const rotationBloch = rotateBlochVector(
            startBloch,
            rotation.axis,
            rotation.angle,
            1.0
          );

          expectBlochNear(rotationBloch, matrixBloch,
            `${gate} on ${stateName}`);
        });
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 4: Animation path stays on the unit sphere
// ═══════════════════════════════════════════════════════════════════════════════

describe('Animation path stays on unit sphere', () => {
  const gateNames: GateName[] = ['X', 'Y', 'Z', 'H', 'S', 'T', 'SX'];

  for (const gate of gateNames) {
    it(`${gate} gate: all intermediate points have unit length`, () => {
      const startBloch = STATES['|0⟩'].bloch;
      const rotation = GATE_ROTATIONS[gate];

      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const pos = rotateBlochVector(startBloch, rotation.axis, rotation.angle, t);
        const mag = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
        expect(mag).toBeCloseTo(1.0, 5);
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER 5: Points on rotation axis remain fixed
// ═══════════════════════════════════════════════════════════════════════════════

describe('Points on rotation axis are fixed points', () => {
  it('X gate: |+⟩ (+X axis) stays fixed', () => {
    const rotation = GATE_ROTATIONS.X;
    const result = rotateBlochVector(STATES['|+⟩'].bloch, rotation.axis, rotation.angle, 1.0);
    expectBlochNear(result, STATES['|+⟩'].bloch, 'X on |+⟩');
  });

  it('Y gate: |i+⟩ (+Y axis) stays fixed', () => {
    const rotation = GATE_ROTATIONS.Y;
    const result = rotateBlochVector(STATES['|i+⟩'].bloch, rotation.axis, rotation.angle, 1.0);
    expectBlochNear(result, STATES['|i+⟩'].bloch, 'Y on |i+⟩');
  });

  it('Z gate: |0⟩ (+Z axis) stays fixed', () => {
    const rotation = GATE_ROTATIONS.Z;
    const result = rotateBlochVector(STATES['|0⟩'].bloch, rotation.axis, rotation.angle, 1.0);
    expectBlochNear(result, STATES['|0⟩'].bloch, 'Z on |0⟩');
  });

  it('Z gate: |1⟩ (-Z axis) stays fixed', () => {
    const rotation = GATE_ROTATIONS.Z;
    const result = rotateBlochVector(STATES['|1⟩'].bloch, rotation.axis, rotation.angle, 1.0);
    expectBlochNear(result, STATES['|1⟩'].bloch, 'Z on |1⟩');
  });
});
