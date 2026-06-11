/**
 * useQuantumSimulator — Central state management hook.
 *
 * Manages the quantum state, gate queue, history, undo, presets,
 * and provides all actions needed by the UI.
 */

import { useState, useCallback, useRef } from 'react';
import { QuantumState } from '../engine/quantumState';
import { GATE_MATRICES } from '../engine/gates';
import type { GateName, PresetName, QueuedGate, HistoryEntry, BlochCoordinates } from '../types';

/** Map preset names to QuantumState instances */
const PRESET_MAP: Record<PresetName, QuantumState> = {
  '|0⟩': QuantumState.ZERO,
  '|1⟩': QuantumState.ONE,
  '|+⟩': QuantumState.PLUS,
  '|−⟩': QuantumState.MINUS,
  '|i+⟩': QuantumState.I_PLUS,
  '|i−⟩': QuantumState.I_MINUS,
};

let gateIdCounter = 0;

export interface QuantumSimulator {
  // Current state
  currentState: QuantumState;
  blochCoords: BlochCoordinates;

  // Gate queue
  gateQueue: QueuedGate[];
  addGateToQueue: (gate: GateName) => void;
  removeGateFromQueue: (id: string) => void;
  clearQueue: () => void;

  // Gate application (returns the target state for animation)
  applyNextGate: () => { from: QuantumState; to: QuantumState; gateName: GateName } | null;
  applyAllGates: () => { from: QuantumState; to: QuantumState; gateNames: GateName[] } | null;

  // Direct state setting (after animation completes)
  commitState: (state: QuantumState, label?: string) => void;

  // History
  history: HistoryEntry[];
  currentStep: number;
  jumpToStep: (step: number) => void;

  // Undo / Reset
  undo: () => { from: QuantumState; to: QuantumState } | null;
  reset: () => { from: QuantumState; to: QuantumState };

  // Presets
  setPreset: (preset: PresetName) => { from: QuantumState; to: QuantumState };

  // Selected gate for educational panel
  selectedGate: GateName | null;
  setSelectedGate: (gate: GateName | null) => void;
}

export function useQuantumSimulator(): QuantumSimulator {
  const [currentState, setCurrentState] = useState<QuantumState>(QuantumState.ZERO);
  const [gateQueue, setGateQueue] = useState<QueuedGate[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      step: 0,
      label: '|0⟩',
      stateAlphaReal: 1,
      stateAlphaImag: 0,
      stateBetaReal: 0,
      stateBetaImag: 0,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGate, setSelectedGate] = useState<GateName | null>(null);

  // Use ref for current state in callbacks to avoid stale closures
  const stateRef = useRef(currentState);
  stateRef.current = currentState;

  const blochCoords = currentState.getBlochCoordinates();

  // ─── Gate Queue ──────────────────────────────────────────────────────────

  const addGateToQueue = useCallback((gate: GateName) => {
    const id = `gate-${++gateIdCounter}`;
    setGateQueue((prev) => [...prev, { id, name: gate }]);
  }, []);

  const removeGateFromQueue = useCallback((id: string) => {
    setGateQueue((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setGateQueue([]);
  }, []);

  // ─── Gate Application ────────────────────────────────────────────────────

  const applyNextGate = useCallback(() => {
    const queue = gateQueue;
    if (queue.length === 0) return null;

    const gate = queue[0];
    const from = stateRef.current;
    const to = from.applyGate(GATE_MATRICES[gate.name]);

    setGateQueue((prev) => prev.slice(1));

    return { from, to, gateName: gate.name };
  }, [gateQueue]);

  const applyAllGates = useCallback(() => {
    const queue = gateQueue;
    if (queue.length === 0) return null;

    const from = stateRef.current;
    let state = from;
    const gateNames: GateName[] = [];
    for (const gate of queue) {
      state = state.applyGate(GATE_MATRICES[gate.name]);
      gateNames.push(gate.name);
    }

    setGateQueue([]);

    return { from, to: state, gateNames };
  }, [gateQueue]);

  // ─── Commit State (called after animation completes) ─────────────────────

  const commitState = useCallback(
    (state: QuantumState) => {
      setCurrentState(state);
      stateRef.current = state;
    },
    []
  );

  const addHistoryEntry = useCallback((label: string, state: QuantumState) => {
    setHistory((prev) => {
      const newStep = prev.length;
      setCurrentStep(newStep);
      return [
        ...prev,
        {
          step: newStep,
          label,
          stateAlphaReal: state.alpha.real,
          stateAlphaImag: state.alpha.imag,
          stateBetaReal: state.beta.real,
          stateBetaImag: state.beta.imag,
        },
      ];
    });
  }, []);

  // Expose addHistoryEntry via a ref so animation hook can call it
  const addHistoryEntryRef = useRef(addHistoryEntry);
  addHistoryEntryRef.current = addHistoryEntry;

  // Override commitState to also add history
  const commitStateWithHistory = useCallback(
    (state: QuantumState, label?: string) => {
      commitState(state);
      if (label) {
        addHistoryEntryRef.current(label, state);
      }
    },
    [commitState]
  );

  // ─── History Navigation ──────────────────────────────────────────────────

  const jumpToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= history.length) return;
      const entry = history[step];
      const state = QuantumState.fromComponents(
        entry.stateAlphaReal,
        entry.stateAlphaImag,
        entry.stateBetaReal,
        entry.stateBetaImag
      );
      setCurrentState(state);
      stateRef.current = state;
      setCurrentStep(step);
      // Trim history to this point
      setHistory((prev) => prev.slice(0, step + 1));
    },
    [history]
  );

  // ─── Undo / Reset ───────────────────────────────────────────────────────

  const undo = useCallback(() => {
    if (history.length <= 1) return null;
    const from = stateRef.current;
    const prevEntry = history[history.length - 2];
    const to = QuantumState.fromComponents(
      prevEntry.stateAlphaReal,
      prevEntry.stateAlphaImag,
      prevEntry.stateBetaReal,
      prevEntry.stateBetaImag
    );
    setCurrentState(to);
    stateRef.current = to;
    setHistory((prev) => prev.slice(0, -1));
    setCurrentStep((prev) => prev - 1);
    return { from, to };
  }, [history]);

  const reset = useCallback(() => {
    const from = stateRef.current;
    const to = QuantumState.ZERO;
    setCurrentState(to);
    stateRef.current = to;
    setGateQueue([]);
    setHistory([
      {
        step: 0,
        label: '|0⟩',
        stateAlphaReal: 1,
        stateAlphaImag: 0,
        stateBetaReal: 0,
        stateBetaImag: 0,
      },
    ]);
    setCurrentStep(0);
    return { from, to };
  }, []);

  // ─── Presets ─────────────────────────────────────────────────────────────

  const setPreset = useCallback(
    (preset: PresetName) => {
      const from = stateRef.current;
      const to = PRESET_MAP[preset];
      return { from, to };
    },
    []
  );

  return {
    currentState,
    blochCoords,
    gateQueue,
    addGateToQueue,
    removeGateFromQueue,
    clearQueue,
    applyNextGate,
    applyAllGates,
    commitState: commitStateWithHistory,
    history,
    currentStep,
    jumpToStep,
    undo,
    reset,
    setPreset,
    selectedGate,
    setSelectedGate,
  };
}
