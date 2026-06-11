/**
 * ResetUndo — Reset and Undo action buttons.
 */

interface ResetUndoProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isAnimating: boolean;
}

export function ResetUndo({ onReset, onUndo, canUndo, isAnimating }: ResetUndoProps) {
  return (
    <div>
      <div className="section-label">Actions</div>
      <div className="glass-panel-sm p-6">
        <div className="flex gap-3">
          <button
        id="undo-btn"
        className="btn btn-ghost flex-1 text-xs"
        onClick={onUndo}
        disabled={!canUndo || isAnimating}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
        </svg>
        Undo
      </button>
      <button
        id="reset-btn"
        className="btn btn-ghost flex-1 text-xs"
        onClick={onReset}
        disabled={isAnimating}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
        Reset
          </button>
        </div>
      </div>
    </div>
  );
}
