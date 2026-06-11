import { describe, it, expect } from 'vitest';
import { GATE_MATRICES } from '../gates';
import { Complex } from '../complex';
import type { GateName } from '../../types';

describe('Gate matrices', () => {
  /** Check that a 2x2 matrix is unitary: U†U = I */
  function isUnitary(matrix: [[Complex, Complex], [Complex, Complex]]): boolean {
    const [[a, b], [c, d]] = matrix;
    
    // U†U where U† is conjugate transpose
    // U† = [[a*, c*], [b*, d*]]
    // U†U = [[a*a + c*c, a*b + c*d], [b*a + d*c, b*b + d*d]]
    const m00 = a.conjugate().mul(a).add(c.conjugate().mul(c));
    const m01 = a.conjugate().mul(b).add(c.conjugate().mul(d));
    const m10 = b.conjugate().mul(a).add(d.conjugate().mul(c));
    const m11 = b.conjugate().mul(b).add(d.conjugate().mul(d));

    return (
      m00.equals(Complex.ONE) &&
      m01.equals(Complex.ZERO) &&
      m10.equals(Complex.ZERO) &&
      m11.equals(Complex.ONE)
    );
  }

  const gateNames: GateName[] = ['X', 'Y', 'Z', 'H', 'S', 'T', 'SX'];

  for (const name of gateNames) {
    it(`${name} gate should be unitary`, () => {
      expect(isUnitary(GATE_MATRICES[name])).toBe(true);
    });
  }

  it('X gate should be self-inverse (X² = I)', () => {
    const X = GATE_MATRICES.X;
    const [[a, b], [c, d]] = X;
    const [[e, f], [g, h]] = X;
    // X²
    const r00 = a.mul(e).add(b.mul(g));
    const r01 = a.mul(f).add(b.mul(h));
    const r10 = c.mul(e).add(d.mul(g));
    const r11 = c.mul(f).add(d.mul(h));
    
    expect(r00.equals(Complex.ONE)).toBe(true);
    expect(r01.equals(Complex.ZERO)).toBe(true);
    expect(r10.equals(Complex.ZERO)).toBe(true);
    expect(r11.equals(Complex.ONE)).toBe(true);
  });

  it('H gate should be self-inverse (H² = I)', () => {
    const H = GATE_MATRICES.H;
    const [[a, b], [c, d]] = H;
    // H²
    const r00 = a.mul(a).add(b.mul(c));
    const r11 = c.mul(b).add(d.mul(d));
    
    expect(r00.equals(Complex.ONE)).toBe(true);
    expect(r11.equals(Complex.ONE)).toBe(true);
  });

  it('S² should equal Z', () => {
    const S = GATE_MATRICES.S;
    const [[a, b], [c, d]] = S;
    // S² diagonal elements
    const s00 = a.mul(a).add(b.mul(c));
    const s11 = c.mul(b).add(d.mul(d));
    
    expect(s00.equals(Complex.ONE)).toBe(true);
    expect(s11.equals(new Complex(-1, 0))).toBe(true);
  });

  it('T² should equal S', () => {
    const T = GATE_MATRICES.T;
    // T is diagonal, so T² is just squaring diagonal elements
    const t00sq = T[0][0].mul(T[0][0]);
    const t11sq = T[1][1].mul(T[1][1]);
    
    expect(t00sq.equals(Complex.ONE)).toBe(true);
    expect(t11sq.equals(Complex.I)).toBe(true); // e^(iπ/4)² = e^(iπ/2) = i
  });
});
