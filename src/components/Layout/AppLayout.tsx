/**
 * AppLayout — Three-column responsive layout for the Bloch Sphere Simulator.
 *
 * Left panel: Controls (gates, sequence, presets, animation, undo/reset)
 * Center: 3D Bloch sphere canvas
 * Right panel: State display, educational info, history
 */

import type { ReactNode } from 'react';

interface AppLayoutProps {
  leftPanel: ReactNode;
  center: ReactNode;
  rightPanel: ReactNode;
}

export function AppLayout({ leftPanel, center, rightPanel }: AppLayoutProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Proper Header */}
      <header className="flex-shrink-0 border-b border-[var(--color-border-glass)] bg-[var(--color-bg-glass)] backdrop-blur-md z-10 relative shadow-sm">
        <div style={{ padding: '24px 40px' }} className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                 style={{ background: 'linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple))' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 0 20" strokeDasharray="4 4" />
                <line x1="12" y1="12" x2="12" y2="4" />
                <circle cx="12" cy="4" r="3" fill="white" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                Quantum Bloch Sphere
              </h1>
              <p className="text-xs text-[var(--color-text-muted)] tracking-widest uppercase font-semibold mt-1">
                Interactive Single-Qubit Simulator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-glass)] text-xs font-mono font-bold text-[var(--color-text-secondary)]">
              v1.0.0
            </div>
          </div>
        </div>
      </header>

      {/* Main content with universal padding */}
      <div className="flex-1 flex min-h-0 p-6 gap-6">
        {/* Left panel — Controls */}
        <aside className="w-[360px] flex-shrink-0 rounded-2xl border border-[var(--color-border-glass)] overflow-y-auto bg-[var(--color-bg-secondary)]/50 shadow-sm">
          <div style={{ padding: '32px' }} className="space-y-10 flex flex-col">
            {leftPanel}
          </div>
        </aside>

        {/* Center — 3D Canvas */}
        <main className="flex-1 min-w-0 relative rounded-2xl border border-[var(--color-border-glass)] shadow-sm overflow-hidden bg-white/30">
          {center}
        </main>

        {/* Right panel — Display */}
        <aside className="w-[380px] flex-shrink-0 rounded-2xl border border-[var(--color-border-glass)] overflow-y-auto bg-[var(--color-bg-secondary)]/50 shadow-sm">
          <div style={{ padding: '32px' }} className="space-y-10 flex flex-col">
            {rightPanel}
          </div>
        </aside>
      </div>
    </div>
  );
}
