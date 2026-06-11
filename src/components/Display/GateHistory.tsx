/**
 * GateHistory — Timeline of applied gates.
 *
 * Shows each step with the gate name and allows jumping
 * back to any historical state by clicking.
 */

import { GATE_COLORS } from '../../engine/gates';
import type { HistoryEntry, GateName } from '../../types';

interface GateHistoryProps {
  history: HistoryEntry[];
  currentStep: number;
  onJumpToStep: (step: number) => void;
  isAnimating: boolean;
}

export function GateHistory({
  history,
  currentStep,
  onJumpToStep,
  isAnimating,
}: GateHistoryProps) {
  return (
    <div>
      <div className="section-label">History</div>
      <div className="glass-panel-sm p-5 max-h-[200px] overflow-y-auto space-y-2">
        {history.map((entry) => {
          const isActive = entry.step === currentStep;
          const isGate = entry.step > 0;
          const gateColor = isGate
            ? GATE_COLORS[entry.label as GateName]?.text
            : undefined;

          return (
            <button
              key={entry.step}
              className={`history-step w-full text-left ${isActive ? 'active' : ''}`}
              onClick={() => !isAnimating && onJumpToStep(entry.step)}
              disabled={isAnimating}
            >
              <div className={`history-dot ${isActive ? 'active' : ''}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                    {entry.step}
                  </span>
                  <span
                    className="text-xs font-mono font-medium truncate"
                    style={{ color: gateColor || 'var(--color-text-primary)' }}
                  >
                    {entry.label}
                  </span>
                </div>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
