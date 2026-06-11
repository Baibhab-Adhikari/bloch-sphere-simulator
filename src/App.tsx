/**
 * App — Root application component.
 *
 * Wires together the quantum simulator, animation engine,
 * and all UI components.
 */

import { useCallback } from 'react';
import { AppLayout } from './components/Layout/AppLayout';
import { BlochSphereCanvas } from './components/BlochSphere/BlochSphereCanvas';
import { GateButtons } from './components/Controls/GateButtons';
import { GateSequence } from './components/Controls/GateSequence';
import { AnimationControls } from './components/Controls/AnimationControls';
import { PresetStates } from './components/Controls/PresetStates';
import { ResetUndo } from './components/Controls/ResetUndo';
import { StateDisplay } from './components/Display/StateDisplay';
import { GateInfo } from './components/Display/GateInfo';
import { GateHistory } from './components/Display/GateHistory';
import { useQuantumSimulator } from './hooks/useQuantumSimulator';
import { useAnimation } from './hooks/useAnimation';
import { GATE_MATRICES } from './engine/gates';
import type { GateName, PresetName } from './types';

function App() {
  const simulator = useQuantumSimulator();
  const animation = useAnimation();

  const isAnimating = animation.status !== 'idle';

  // ─── Gate Application ────────────────────────────────────────────────────

  const handleApplyGates = useCallback(() => {
    const queue = simulator.gateQueue;
    if (queue.length === 0) return;

    // Build animation configs for each gate in sequence
    let currentState = simulator.currentState;
    const configs = queue.map((gate) => {
      const from = currentState.getBlochCoordinates();
      const nextState = currentState.applyGate(GATE_MATRICES[gate.name]);
      const to = nextState.getBlochCoordinates();

      const gateName = gate.name;
      const targetState = nextState;
      currentState = nextState;

      return {
        from,
        to,
        onComplete: () => {
          simulator.commitState(targetState, gateName);
        },
        label: gateName,
      };
    });

    simulator.clearQueue();
    animation.queueAnimations(configs);
  }, [simulator, animation]);

  // ─── Preset States ───────────────────────────────────────────────────────

  const handlePreset = useCallback(
    (preset: PresetName) => {
      const { from, to } = simulator.setPreset(preset);
      const fromCoords = from.getBlochCoordinates();
      const toCoords = to.getBlochCoordinates();

      animation.startAnimation({
        from: fromCoords,
        to: toCoords,
        onComplete: () => {
          simulator.commitState(to, preset);
        },
      });
    },
    [simulator, animation]
  );

  // ─── Undo ────────────────────────────────────────────────────────────────

  const handleUndo = useCallback(() => {
    const result = simulator.undo();
    if (!result) return;

    const fromCoords = result.from.getBlochCoordinates();
    const toCoords = result.to.getBlochCoordinates();

    animation.startAnimation({
      from: fromCoords,
      to: toCoords,
      onComplete: () => {
        // State already committed by undo()
      },
    });
  }, [simulator, animation]);

  // ─── Reset ───────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    const { from, to } = simulator.reset();
    const fromCoords = from.getBlochCoordinates();
    const toCoords = to.getBlochCoordinates();

    animation.startAnimation({
      from: fromCoords,
      to: toCoords,
      onComplete: () => {
        // State already committed by reset()
      },
    });
  }, [simulator, animation]);

  // ─── History Jump ────────────────────────────────────────────────────────

  const handleJumpToStep = useCallback(
    (step: number) => {
      if (isAnimating) return;
      simulator.jumpToStep(step);
    },
    [simulator, isAnimating]
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <AppLayout
      leftPanel={
        <>
          <GateButtons
            onGateClick={(gate: GateName) => simulator.addGateToQueue(gate)}
            selectedGate={simulator.selectedGate}
            onGateSelect={simulator.setSelectedGate}
          />
          <GateSequence
            queue={simulator.gateQueue}
            onApply={handleApplyGates}
            onClear={simulator.clearQueue}
            onRemoveGate={simulator.removeGateFromQueue}
            isAnimating={isAnimating}
          />
          <AnimationControls
            status={animation.status}
            progress={animation.progress}
            speed={animation.speed}
            onPlay={animation.play}
            onPause={animation.pause}
            onRestart={animation.restart}
            onSpeedChange={animation.setSpeed}
          />
          <PresetStates
            onPresetClick={handlePreset}
            isAnimating={isAnimating}
          />
          <ResetUndo
            onReset={handleReset}
            onUndo={handleUndo}
            canUndo={simulator.history.length > 1}
            isAnimating={isAnimating}
          />
        </>
      }
      center={
        <BlochSphereCanvas
          position={animation.currentPosition}
          animationUpdate={animation.update}
        />
      }
      rightPanel={
        <>
          <StateDisplay state={simulator.currentState} />
          <GateInfo selectedGate={simulator.selectedGate} />
          <GateHistory
            history={simulator.history}
            currentStep={simulator.currentStep}
            onJumpToStep={handleJumpToStep}
            isAnimating={isAnimating}
          />
        </>
      }
    />
  );
}

export default App;
