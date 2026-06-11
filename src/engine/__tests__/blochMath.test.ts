import { describe, it, expect } from 'vitest';
import { stateToBloch, blochAnglesToState, blochToAngles, slerpBloch } from '../blochMath';
import { Complex } from '../complex';

describe('blochMath', () => {
  describe('stateToBloch', () => {
    it('|0⟩ → (0, 0, 1)', () => {
      const bloch = stateToBloch(Complex.ONE, Complex.ZERO);
      expect(bloch.x).toBeCloseTo(0);
      expect(bloch.y).toBeCloseTo(0);
      expect(bloch.z).toBeCloseTo(1);
    });

    it('|1⟩ → (0, 0, -1)', () => {
      const bloch = stateToBloch(Complex.ZERO, Complex.ONE);
      expect(bloch.x).toBeCloseTo(0);
      expect(bloch.y).toBeCloseTo(0);
      expect(bloch.z).toBeCloseTo(-1);
    });

    it('|+⟩ → (1, 0, 0)', () => {
      const s = 1 / Math.SQRT2;
      const bloch = stateToBloch(new Complex(s, 0), new Complex(s, 0));
      expect(bloch.x).toBeCloseTo(1);
      expect(bloch.y).toBeCloseTo(0);
      expect(bloch.z).toBeCloseTo(0);
    });

    it('|i+⟩ → (0, 1, 0)', () => {
      const s = 1 / Math.SQRT2;
      const bloch = stateToBloch(new Complex(s, 0), new Complex(0, s));
      expect(bloch.x).toBeCloseTo(0);
      expect(bloch.y).toBeCloseTo(1);
      expect(bloch.z).toBeCloseTo(0);
    });
  });

  describe('blochAnglesToState', () => {
    it('theta=0 → |0⟩', () => {
      const { alpha, beta } = blochAnglesToState(0, 0);
      expect(alpha.magnitude()).toBeCloseTo(1);
      expect(beta.magnitude()).toBeCloseTo(0);
    });

    it('theta=π → |1⟩', () => {
      const { alpha, beta } = blochAnglesToState(Math.PI, 0);
      expect(alpha.magnitude()).toBeCloseTo(0, 5);
      expect(beta.magnitude()).toBeCloseTo(1);
    });
  });

  describe('blochToAngles', () => {
    it('north pole → theta=0', () => {
      const angles = blochToAngles({ x: 0, y: 0, z: 1 });
      expect(angles.theta).toBeCloseTo(0);
    });

    it('south pole → theta=π', () => {
      const angles = blochToAngles({ x: 0, y: 0, z: -1 });
      expect(angles.theta).toBeCloseTo(Math.PI);
    });

    it('positive X → theta=π/2, phi=0', () => {
      const angles = blochToAngles({ x: 1, y: 0, z: 0 });
      expect(angles.theta).toBeCloseTo(Math.PI / 2);
      expect(angles.phi).toBeCloseTo(0);
    });

    it('positive Y → theta=π/2, phi=π/2', () => {
      const angles = blochToAngles({ x: 0, y: 1, z: 0 });
      expect(angles.theta).toBeCloseTo(Math.PI / 2);
      expect(angles.phi).toBeCloseTo(Math.PI / 2);
    });
  });

  describe('round-trip conversions', () => {
    it('angles → state → bloch → angles should be consistent', () => {
      const theta = Math.PI / 3;
      const phi = Math.PI / 4;
      const { alpha, beta } = blochAnglesToState(theta, phi);
      const bloch = stateToBloch(alpha, beta);
      const recovered = blochToAngles(bloch);
      expect(recovered.theta).toBeCloseTo(theta, 6);
      expect(recovered.phi).toBeCloseTo(phi, 6);
    });
  });

  describe('slerpBloch', () => {
    it('t=0 should return start', () => {
      const start = { x: 0, y: 0, z: 1 };
      const end = { x: 1, y: 0, z: 0 };
      const result = slerpBloch(start, end, 0);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(0);
      expect(result.z).toBeCloseTo(1);
    });

    it('t=1 should return end', () => {
      const start = { x: 0, y: 0, z: 1 };
      const end = { x: 1, y: 0, z: 0 };
      const result = slerpBloch(start, end, 1);
      expect(result.x).toBeCloseTo(1);
      expect(result.y).toBeCloseTo(0);
      expect(result.z).toBeCloseTo(0);
    });

    it('interpolated point should be on unit sphere', () => {
      const start = { x: 0, y: 0, z: 1 };
      const end = { x: 1, y: 0, z: 0 };
      for (const t of [0.1, 0.25, 0.5, 0.75, 0.9]) {
        const result = slerpBloch(start, end, t);
        const mag = Math.sqrt(result.x ** 2 + result.y ** 2 + result.z ** 2);
        expect(mag).toBeCloseTo(1, 6);
      }
    });

    it('identical start and end should return them unchanged', () => {
      const p = { x: 0, y: 1, z: 0 };
      const result = slerpBloch(p, p, 0.5);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(1);
      expect(result.z).toBeCloseTo(0);
    });
  });
});
