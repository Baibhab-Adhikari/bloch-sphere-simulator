/**
 * GateSequence — Visual display of queued gates with apply/clear actions.
 *
 * Shows gate chips in a horizontal strip with an apply button.
 */

import { GATE_COLORS, GATE_EDUCATION } from '../../engine/gates';
import type { QueuedGate } from '../../types';

interface GateSequenceProps {
  queue: QueuedGate[];
  onApply: () => void;
  onClear: () => void;
  onRemoveGate: (id: string) => void;
  isAnimating: boolean;
}

export function GateSequence({
  queue,
  onApply,
  onClear,
  onRemoveGate,
  isAnimating,
}: GateSequenceProps) {
  if (queue.length === 0) {
    return (
      <div>
        <div className="section-label">Gate Sequence</div>
        <div className="text-sm text-[var(--color-text-muted)] italic py-3 text-center glass-panel-sm px-3">
          Click gates above to build a sequence
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-label">Gate Sequence</div>
      <div className="glass-panel-sm p-6 space-y-6">
        {/* Gate chips */}
        <div className="flex flex-wrap gap-1.5">
          {queue.map((gate) => {
            const colors = GATE_COLORS[gate.name];
            const edu = GATE_EDUCATION[gate.name];
            return (
              <button
                key={gate.id}
                className="gate-chip group relative"
                style={{
                  background: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
                onClick={() => onRemoveGate(gate.id)}
                title="Click to remove"
              >
                {edu.symbol}
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500/80 rounded-full text-[8px] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </span>
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            id="apply-gates-btn"
            className="btn btn-primary flex-1 text-xs"
            onClick={onApply}
            disabled={isAnimating}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Apply {queue.length > 1 ? `(${queue.length})` : ''}
          </button>
          <button
            id="clear-gates-btn"
            className="btn btn-ghost text-xs"
            onClick={onClear}
            disabled={isAnimating}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
