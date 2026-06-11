import { describe, it, expect } from 'vitest';
import { Complex } from '../complex';

describe('Complex', () => {
  describe('construction', () => {
    it('should create a complex number', () => {
      const c = new Complex(3, 4);
      expect(c.real).toBe(3);
      expect(c.imag).toBe(4);
    });

    it('should create from polar form', () => {
      const c = Complex.fromPolar(1, Math.PI / 2);
      expect(c.real).toBeCloseTo(0, 10);
      expect(c.imag).toBeCloseTo(1, 10);
    });
  });

  describe('arithmetic', () => {
    it('should add correctly', () => {
      const a = new Complex(1, 2);
      const b = new Complex(3, 4);
      const result = a.add(b);
      expect(result.real).toBe(4);
      expect(result.imag).toBe(6);
    });

    it('should subtract correctly', () => {
      const a = new Complex(5, 3);
      const b = new Complex(2, 1);
      const result = a.sub(b);
      expect(result.real).toBe(3);
      expect(result.imag).toBe(2);
    });

    it('should multiply correctly', () => {
      // (1+2i)(3+4i) = 3+4i+6i+8i² = 3+10i-8 = -5+10i
      const a = new Complex(1, 2);
      const b = new Complex(3, 4);
      const result = a.mul(b);
      expect(result.real).toBe(-5);
      expect(result.imag).toBe(10);
    });

    it('should scale correctly', () => {
      const c = new Complex(2, 3);
      const result = c.scale(2);
      expect(result.real).toBe(4);
      expect(result.imag).toBe(6);
    });

    it('should divide correctly', () => {
      // (1+2i)/(3+4i) = (1+2i)(3-4i)/(9+16) = (11+2i)/25
      const a = new Complex(1, 2);
      const b = new Complex(3, 4);
      const result = a.div(b);
      expect(result.real).toBeCloseTo(11 / 25);
      expect(result.imag).toBeCloseTo(2 / 25);
    });

    it('should throw on division by zero', () => {
      expect(() => Complex.ONE.div(Complex.ZERO)).toThrow('Division by zero');
    });
  });

  describe('unary operations', () => {
    it('should compute conjugate', () => {
      const c = new Complex(3, 4);
      const conj = c.conjugate();
      expect(conj.real).toBe(3);
      expect(conj.imag).toBe(-4);
    });

    it('should compute magnitude', () => {
      const c = new Complex(3, 4);
      expect(c.magnitude()).toBe(5);
    });

    it('should compute magnitude squared', () => {
      const c = new Complex(3, 4);
      expect(c.magnitudeSquared()).toBe(25);
    });

    it('should compute phase', () => {
      const c = new Complex(0, 1); // i has phase π/2
      expect(c.phase()).toBeCloseTo(Math.PI / 2);
    });

    it('should negate correctly', () => {
      const c = new Complex(3, -4);
      const neg = c.negate();
      expect(neg.real).toBe(-3);
      expect(neg.imag).toBe(4);
    });
  });

  describe('equality', () => {
    it('should detect equal complex numbers', () => {
      const a = new Complex(1, 2);
      const b = new Complex(1, 2);
      expect(a.equals(b)).toBe(true);
    });

    it('should detect unequal complex numbers', () => {
      const a = new Complex(1, 2);
      const b = new Complex(1, 3);
      expect(a.equals(b)).toBe(false);
    });

    it('should handle floating-point approximately', () => {
      const a = new Complex(0.1 + 0.2, 0);
      const b = new Complex(0.3, 0);
      expect(a.equals(b)).toBe(true);
    });
  });

  describe('display', () => {
    it('should format real-only numbers', () => {
      expect(new Complex(3, 0).toString()).toBe('3');
    });

    it('should format imaginary-only numbers', () => {
      expect(new Complex(0, 1).toString()).toBe('i');
      expect(new Complex(0, -1).toString()).toBe('-i');
      expect(new Complex(0, 2).toString()).toBe('2i');
    });

    it('should format full complex numbers', () => {
      expect(new Complex(3, 4).toString()).toBe('3 + 4i');
      expect(new Complex(3, -4).toString()).toBe('3 - 4i');
    });
  });

  describe('static constants', () => {
    it('ZERO should be 0+0i', () => {
      expect(Complex.ZERO.real).toBe(0);
      expect(Complex.ZERO.imag).toBe(0);
    });

    it('ONE should be 1+0i', () => {
      expect(Complex.ONE.real).toBe(1);
      expect(Complex.ONE.imag).toBe(0);
    });

    it('I should be 0+1i', () => {
      expect(Complex.I.real).toBe(0);
      expect(Complex.I.imag).toBe(1);
    });

    it('i*i should be -1', () => {
      const result = Complex.I.mul(Complex.I);
      expect(result.real).toBeCloseTo(-1);
      expect(result.imag).toBeCloseTo(0);
    });
  });
});
