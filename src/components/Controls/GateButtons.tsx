/**
 * GateButtons — Grid of quantum gate buttons.
 *
 * Each button adds the gate to the queue and selects it
 * for the educational panel.
 */

import { ALL_GATES, GATE_COLORS, GATE_EDUCATION } from '../../engine/gates';
import type { GateName } from '../../types';

interface GateButtonsProps {
  onGateClick: (gate: GateName) => void;
  selectedGate: GateName | null;
  onGateSelect: (gate: GateName | null) => void;
}

export function GateButtons({ onGateClick, selectedGate, onGateSelect }: GateButtonsProps) {
  return (
    <div>
      <div className="section-label">Quantum Gates</div>
      <div className="glass-panel-sm p-6">
        <div className="flex flex-wrap gap-4">
        {ALL_GATES.map((gate) => {
          const colors = GATE_COLORS[gate];
          const edu = GATE_EDUCATION[gate];
          const isSelected = selectedGate === gate;

          return (
            <button
              key={gate}
              id={`gate-btn-${gate}`}
              className={`gate-btn ${isSelected ? 'selected' : ''}`}
              style={{
                background: colors.bg,
                color: colors.text,
                borderColor: isSelected ? colors.text : colors.border,
                ['--gate-glow' as string]: colors.glow,
              }}
              onClick={() => {
                onGateClick(gate);
                onGateSelect(gate);
              }}
              onMouseEnter={() => onGateSelect(gate)}
              title={edu.name}
            >
              {edu.symbol}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
