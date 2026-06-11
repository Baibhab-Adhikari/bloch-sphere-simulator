/**
 * StateDisplay — Shows current quantum state information.
 *
 * Displays Dirac notation, α/β coefficients, Bloch coordinates,
 * and θ/φ angles in a formatted panel.
 */

import { QuantumState } from '../../engine/quantumState';

interface StateDisplayProps {
  state: QuantumState;
}

function formatAngle(radians: number): string {
  const degrees = (radians * 180) / Math.PI;
  return `${radians.toFixed(4)} rad (${degrees.toFixed(1)}°)`;
}

function formatCoord(value: number): string {
  return value.toFixed(4);
}

export function StateDisplay({ state }: StateDisplayProps) {
  const info = state.getDisplayInfo();

  return (
    <div>
      <div className="section-label">Quantum State</div>
      <div className="glass-panel-sm p-6 space-y-6">
        {/* Dirac Notation */}
        <div className="text-center py-2">
          <div className="math-text text-sm text-[var(--color-accent-cyan)]">
            {info.diracNotation}
          </div>
        </div>

        <div className="h-px bg-[var(--color-border-glass)]" />

        {/* Coefficients */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="math-label">α</span>
            <span className="math-text text-xs">{info.alpha.display}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="math-label">β</span>
            <span className="math-text text-xs">{info.beta.display}</span>
          </div>
        </div>

        <div className="h-px bg-[var(--color-border-glass)]" />

        {/* Probabilities */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="math-label">|α|²</span>
            <span className="math-text text-xs">{formatCoord(info.alpha.magnitude ** 2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="math-label">|β|²</span>
            <span className="math-text text-xs">{formatCoord(info.beta.magnitude ** 2)}</span>
          </div>
        </div>

        <div className="h-px bg-[var(--color-border-glass)]" />

        {/* Bloch Coordinates */}
        <div className="space-y-2">
          <div className="math-label mb-1">Bloch Vector</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-red-400 font-medium mb-0.5">x</div>
              <div className="math-text text-xs">{formatCoord(info.bloch.x)}</div>
            </div>
            <div>
              <div className="text-[10px] text-green-400 font-medium mb-0.5">y</div>
              <div className="math-text text-xs">{formatCoord(info.bloch.y)}</div>
            </div>
            <div>
              <div className="text-[10px] text-blue-400 font-medium mb-0.5">z</div>
              <div className="math-text text-xs">{formatCoord(info.bloch.z)}</div>
            </div>
          </div>
        </div>

        <div className="h-px bg-[var(--color-border-glass)]" />

        {/* Angles */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="math-label">θ</span>
            <span className="math-text text-[11px]">{formatAngle(info.angles.theta)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="math-label">φ</span>
            <span className="math-text text-[11px]">{formatAngle(info.angles.phi)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
