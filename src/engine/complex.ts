/**
 * Complex number class for quantum state calculations.
 * Provides all arithmetic operations needed for gate matrices and state manipulation.
 */
export class Complex {
  public readonly real: number;
  public readonly imag: number;

  constructor(real: number, imag: number) {
    this.real = real;
    this.imag = imag;
  }

  // ─── Static Constructors ─────────────────────────────────────────────────

  /** Complex zero: 0 + 0i */
  static readonly ZERO = new Complex(0, 0);

  /** Complex one: 1 + 0i */
  static readonly ONE = new Complex(1, 0);

  /** Imaginary unit: 0 + 1i */
  static readonly I = new Complex(0, 1);

  /** Negative imaginary unit: 0 - 1i */
  static readonly NEG_I = new Complex(0, -1);

  /** Create from polar form: r * e^(iθ) */
  static fromPolar(r: number, theta: number): Complex {
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }

  // ─── Arithmetic Operations ───────────────────────────────────────────────

  /** Addition: this + other */
  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  /** Subtraction: this - other */
  sub(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  /** Multiplication: this * other */
  mul(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  /** Scalar multiplication: this * scalar */
  scale(scalar: number): Complex {
    return new Complex(this.real * scalar, this.imag * scalar);
  }

  /** Division: this / other */
  div(other: Complex): Complex {
    const denom = other.real * other.real + other.imag * other.imag;
    if (denom === 0) throw new Error('Division by zero');
    return new Complex(
      (this.real * other.real + this.imag * other.imag) / denom,
      (this.imag * other.real - this.real * other.imag) / denom
    );
  }

  // ─── Unary Operations ────────────────────────────────────────────────────

  /** Complex conjugate: a - bi */
  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  /** Negation: -a - bi */
  negate(): Complex {
    return new Complex(-this.real, -this.imag);
  }

  /** Magnitude (absolute value): |z| = √(a² + b²) */
  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  /** Squared magnitude: |z|² = a² + b² */
  magnitudeSquared(): number {
    return this.real * this.real + this.imag * this.imag;
  }

  /** Phase angle: arg(z) = atan2(b, a) */
  phase(): number {
    return Math.atan2(this.imag, this.real);
  }

  // ─── Comparison ──────────────────────────────────────────────────────────

  /** Check approximate equality within epsilon */
  equals(other: Complex, epsilon: number = 1e-10): boolean {
    return (
      Math.abs(this.real - other.real) < epsilon &&
      Math.abs(this.imag - other.imag) < epsilon
    );
  }

  // ─── Display ─────────────────────────────────────────────────────────────

  /** Format as a human-readable string */
  toString(precision: number = 4): string {
    const r = roundTo(this.real, precision);
    const i = roundTo(this.imag, precision);

    if (i === 0) return `${r}`;
    if (r === 0) {
      if (i === 1) return 'i';
      if (i === -1) return '-i';
      return `${i}i`;
    }

    const sign = i > 0 ? '+' : '-';
    const absI = Math.abs(i);
    const iStr = absI === 1 ? 'i' : `${absI}i`;
    return `${r} ${sign} ${iStr}`;
  }
}

/** Round a number to N decimal places */
function roundTo(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}
