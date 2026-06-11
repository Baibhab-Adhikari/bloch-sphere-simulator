/**
 * GateInfo — Educational panel showing gate details.
 *
 * Displays the gate's matrix, physical meaning, and
 * Bloch sphere interpretation when a gate is selected.
 */

import { GATE_EDUCATION, GATE_COLORS } from '../../engine/gates';
import type { GateName } from '../../types';

interface GateInfoProps {
  selectedGate: GateName | null;
}

export function GateInfo({ selectedGate }: GateInfoProps) {
  if (!selectedGate) {
    return (
      <div>
        <div className="section-label">Gate Info</div>
        <div className="glass-panel-sm p-3 text-center text-sm text-[var(--color-text-muted)] italic">
          Hover or click a gate to learn about it
        </div>
      </div>
    );
  }

  const edu = GATE_EDUCATION[selectedGate];
  const colors = GATE_COLORS[selectedGate];

  return (
    <div className="animate-fade-in">
      <div className="section-label">Gate Info</div>
      <div className="glass-panel-sm p-6 space-y-6">
        {/* Gate name */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {edu.symbol}
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">
              {edu.name}
            </div>
            {edu.rotationAxis && (
              <div className="text-[10px] text-[var(--color-text-muted)]">
                Rotation: {edu.rotationAngle} around {edu.rotationAxis}
              </div>
            )}
          </div>
        </div>

        {/* Matrix */}
        <div>
          <div className="math-label mb-1.5">Matrix</div>
          <div className="flex items-center gap-1 justify-center">
            <span className="matrix-bracket-left">⌈</span>
            <div className="matrix-grid min-w-[120px]">
              <span className="py-1 text-[var(--color-text-primary)]">{edu.matrixDisplay[0][0]}</span>
              <span className="py-1 text-[var(--color-text-primary)]">{edu.matrixDisplay[0][1]}</span>
              <span className="py-1 text-[var(--color-text-primary)]">{edu.matrixDisplay[1][0]}</span>
              <span className="py-1 text-[var(--color-text-primary)]">{edu.matrixDisplay[1][1]}</span>
            </div>
            <span className="matrix-bracket-right">⌉</span>
          </div>
        </div>

        {/* Meaning */}
        <div>
          <div className="math-label mb-1">Physical Meaning</div>
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {edu.meaning}
          </p>
        </div>

        {/* Bloch interpretation */}
        <div>
          <div className="math-label mb-1">Bloch Interpretation</div>
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {edu.blochInterpretation}
          </p>
        </div>
      </div>
    </div>
  );
}
