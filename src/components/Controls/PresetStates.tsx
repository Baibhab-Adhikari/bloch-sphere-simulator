/**
 * PresetStates — Buttons for common quantum states.
 *
 * |0⟩, |1⟩, |+⟩, |−⟩, |i+⟩, |i−⟩
 */

import type { PresetName } from '../../types';

interface PresetStatesProps {
  onPresetClick: (preset: PresetName) => void;
  isAnimating: boolean;
}

interface PresetConfig {
  name: PresetName;
  display: string;
  description: string;
  color: string;
}

const PRESETS: PresetConfig[] = [
  { name: '|0⟩', display: '|0⟩', description: 'North pole', color: '#3b82f6' },
  { name: '|1⟩', display: '|1⟩', description: 'South pole', color: '#3b82f6' },
  { name: '|+⟩', display: '|+⟩', description: '+X axis', color: '#ef4444' },
  { name: '|−⟩', display: '|−⟩', description: '−X axis', color: '#ef4444' },
  { name: '|i+⟩', display: '|i+⟩', description: '+Y axis', color: '#22c55e' },
  { name: '|i−⟩', display: '|i−⟩', description: '−Y axis', color: '#22c55e' },
];

export function PresetStates({ onPresetClick, isAnimating }: PresetStatesProps) {
  return (
    <div>
      <div className="section-label">Preset States</div>
      <div className="glass-panel-sm p-6">
        <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            id={`preset-${preset.display.replace(/[|⟩+−]/g, '')}`}
            className="btn btn-ghost text-xs py-2 font-mono"
            style={{ color: preset.color }}
            onClick={() => onPresetClick(preset.name)}
            disabled={isAnimating}
            title={preset.description}
          >
            {preset.display}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}
