import { describe, it, expect } from 'vitest';
import { QuantumState } from '../quantumState';
import { Complex } from '../complex';
import { GATE_MATRICES } from '../gates';

describe('QuantumState', () => {
  describe('construction & normalization', () => {
    it('should auto-normalize on construction', () => {
      const state = new QuantumState(new Complex(3, 0), new Complex(4, 0));
      const normSq = state.alpha.magnitudeSquared() + state.beta.magnitudeSquared();
      expect(normSq).toBeCloseTo(1, 10);
    });

    it('should reject zero state', () => {
      expect(() => new QuantumState(Complex.ZERO, Complex.ZERO)).toThrow();
    });
  });

  describe('presets', () => {
    it('|0⟩ should be at north pole (z=1)', () => {
      const bloch = QuantumState.ZERO.getBlochCoordinates();
      expect(bloch.x).toBeCloseTo(0);
      expect(bloch.y).toBeCloseTo(0);
      expect(bloch.z).toBeCloseTo(1);
    });

    it('|1⟩ should be at south pole (z=-1)', () => {
      const bloch = QuantumState.ONE.getBlochCoordinates();
      expect(bloch.x).toBeCloseTo(0);
      expect(bloch.y).toBeCloseTo(0);
      expect(bloch.z).toBeCloseTo(-1);
    });

    it('|+⟩ should be on positive X axis', () => {
      const bloch = QuantumState.PLUS.getBlochCoordinates();
      expect(bloch.x).toBeCloseTo(1);
      expect(bloch.y).toBeCloseTo(0);
      expect(bloch.z).toBeCloseTo(0);
    });

    it('|−⟩ should be on negative X axis', () => {
      const bloch = QuantumState.MINUS.getBlochCoordinates();
      expect(bloch.x).toBeCloseTo(-1);
      expect(bloch.y).toBeCloseTo(0);
      expect(bloch.z).toBeCloseTo(0);
    });

    it('|i+⟩ should be on positive Y axis', () => {
      const bloch = QuantumState.I_PLUS.getBlochCoordinates();
      expect(bloch.x).toBeCloseTo(0);
      expect(bloch.y).toBeCloseTo(1);
      expect(bloch.z).toBeCloseTo(0);
    });

    it('|i−⟩ should be on negative Y axis', () => {
      const bloch = QuantumState.I_MINUS.getBlochCoordinates();
      expect(bloch.x).toBeCloseTo(0);
      expect(bloch.y).toBeCloseTo(-1);
      expect(bloch.z).toBeCloseTo(0);
    });
  });

  describe('gate application', () => {
    it('X|0⟩ = |1⟩', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.X);
      expect(result.equals(QuantumState.ONE)).toBe(true);
    });

    it('X|1⟩ = |0⟩', () => {
      const result = QuantumState.ONE.applyGate(GATE_MATRICES.X);
      expect(result.equals(QuantumState.ZERO)).toBe(true);
    });

    it('H|0⟩ = |+⟩', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.H);
      expect(result.equals(QuantumState.PLUS)).toBe(true);
    });

    it('H|1⟩ = |−⟩', () => {
      const result = QuantumState.ONE.applyGate(GATE_MATRICES.H);
      expect(result.equals(QuantumState.MINUS)).toBe(true);
    });

    it('Z|+⟩ = |−⟩', () => {
      const result = QuantumState.PLUS.applyGate(GATE_MATRICES.Z);
      expect(result.equals(QuantumState.MINUS)).toBe(true);
    });

    it('Y|0⟩ should go to south pole', () => {
      const result = QuantumState.ZERO.applyGate(GATE_MATRICES.Y);
      const bloch = result.getBlochCoordinates();
      expect(bloch.z).toBeCloseTo(-1);
    });

    it('S gate should rotate |+⟩ to |i+⟩', () => {
      const result = QuantumState.PLUS.applyGate(GATE_MATRICES.S);
      expect(result.equals(QuantumState.I_PLUS)).toBe(true);
    });

    it('applying a gate preserves normalization', () => {
      let state = QuantumState.ZERO;
      for (const gateName of ['H', 'T', 'S', 'X', 'Y', 'Z'] as const) {
        state = state.applyGate(GATE_MATRICES[gateName]);
        const normSq = state.alpha.magnitudeSquared() + state.beta.magnitudeSquared();
        expect(normSq).toBeCloseTo(1, 10);
      }
    });

    it('SX gate applied twice equals X gate', () => {
      const state = QuantumState.ZERO;
      const afterSX2 = state.applyGate(GATE_MATRICES.SX).applyGate(GATE_MATRICES.SX);
      const afterX = state.applyGate(GATE_MATRICES.X);
      expect(afterSX2.equals(afterX)).toBe(true);
    });
  });

  describe('fromBlochAngles', () => {
    it('theta=0 should give |0⟩', () => {
      const state = QuantumState.fromBlochAngles(0, 0);
      expect(state.equals(QuantumState.ZERO)).toBe(true);
    });

    it('theta=π should give |1⟩', () => {
      const state = QuantumState.fromBlochAngles(Math.PI, 0);
      expect(state.equals(QuantumState.ONE)).toBe(true);
    });

    it('theta=π/2, phi=0 should give |+⟩', () => {
      const state = QuantumState.fromBlochAngles(Math.PI / 2, 0);
      expect(state.equals(QuantumState.PLUS)).toBe(true);
    });
  });

  describe('display', () => {
    it('should produce Dirac notation', () => {
      const notation = QuantumState.ZERO.toDiracNotation();
      expect(notation).toContain('|0⟩');
    });

    it('should produce display info', () => {
      const info = QuantumState.PLUS.getDisplayInfo();
      expect(info.bloch.x).toBeCloseTo(1);
      expect(info.angles.theta).toBeCloseTo(Math.PI / 2);
    });
  });
});
