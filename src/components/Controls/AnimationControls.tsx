/**
 * AnimationControls — Play/Pause/Restart buttons and speed slider.
 */

import type { AnimationStatus, SpeedMultiplier } from '../../types';
import { SPEED_OPTIONS } from '../../types';

interface AnimationControlsProps {
  status: AnimationStatus;
  progress: number;
  speed: SpeedMultiplier;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: SpeedMultiplier) => void;
}

export function AnimationControls({
  status,
  progress,
  speed,
  onPlay,
  onPause,
  onRestart,
  onSpeedChange,
}: AnimationControlsProps) {
  const isActive = status !== 'idle';

  return (
    <div>
      <div className="section-label">Animation</div>
      <div className="glass-panel-sm p-6 space-y-6">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, var(--color-accent-cyan), var(--color-accent-purple))',
            }}
          />
        </div>

        {/* Transport controls */}
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          {status === 'playing' ? (
            <button
              id="pause-btn"
              className="btn btn-ghost text-xs px-3"
              onClick={onPause}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              Pause
            </button>
          ) : (
            <button
              id="play-btn"
              className="btn btn-ghost text-xs px-3"
              onClick={onPlay}
              disabled={!isActive}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {status === 'paused' ? 'Resume' : 'Play'}
            </button>
          )}

          {/* Restart */}
          <button
            id="restart-btn"
            className="btn btn-ghost text-xs px-3"
            onClick={onRestart}
            disabled={progress === 0 && !isActive}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
            Restart
          </button>
        </div>

        {/* Speed slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Speed</span>
            <span className="text-xs font-mono text-[var(--color-accent-cyan)]">{speed}×</span>
          </div>
          <input
            type="range"
            id="speed-slider"
            className="speed-slider"
            min={0}
            max={SPEED_OPTIONS.length - 1}
            step={1}
            value={SPEED_OPTIONS.indexOf(speed)}
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              onSpeedChange(SPEED_OPTIONS[idx]);
            }}
          />
          <div className="flex justify-between">
            {SPEED_OPTIONS.map((s) => (
              <span
                key={s}
                className={`text-[9px] font-mono cursor-pointer transition-colors ${
                  s === speed ? 'text-[var(--color-accent-cyan)]' : 'text-[var(--color-text-muted)]'
                }`}
                onClick={() => onSpeedChange(s)}
              >
                {s}×
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
