/**
 * useAnimation — Animation engine hook.
 *
 * Drives smooth Bloch vector transitions using spherical linear interpolation
 * with cubic ease-in-out easing. Manages play/pause/restart and speed control.
 */

import { useState, useCallback, useRef } from 'react';
import { slerpBloch } from '../engine/blochMath';
import type { AnimationStatus, SpeedMultiplier, BlochCoordinates } from '../types';

/** Base animation duration in milliseconds */
const BASE_DURATION_MS = 1000;

/** Cubic ease-in-out easing function */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export interface AnimationConfig {
  from: BlochCoordinates;
  to: BlochCoordinates;
  onComplete: () => void;
  label?: string;
}

export interface AnimationControls {
  // State
  status: AnimationStatus;
  progress: number;
  speed: SpeedMultiplier;
  currentPosition: BlochCoordinates;

  // Start a new animation
  startAnimation: (config: AnimationConfig) => void;

  // Queue multiple animations (for gate sequences)
  queueAnimations: (configs: AnimationConfig[]) => void;

  // Controls
  play: () => void;
  pause: () => void;
  restart: () => void;
  setSpeed: (speed: SpeedMultiplier) => void;

  // Frame update (call from useFrame)
  update: (deltaMs: number) => void;
}

export function useAnimation(): AnimationControls {
  const [status, setStatus] = useState<AnimationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [speed, setSpeedState] = useState<SpeedMultiplier>(1);
  const [currentPosition, setCurrentPosition] = useState<BlochCoordinates>({ x: 0, y: 0, z: 1 });

  // Use refs for values accessed in the animation loop to avoid stale closures
  const statusRef = useRef<AnimationStatus>('idle');
  const progressRef = useRef(0);
  const speedRef = useRef<SpeedMultiplier>(1);
  const configRef = useRef<AnimationConfig | null>(null);
  const queueRef = useRef<AnimationConfig[]>([]);

  // ─── Start Animation ─────────────────────────────────────────────────────

  const startAnimation = useCallback((config: AnimationConfig) => {
    configRef.current = config;
    progressRef.current = 0;
    statusRef.current = 'playing';
    setProgress(0);
    setStatus('playing');
    setCurrentPosition(config.from);
  }, []);

  const queueAnimations = useCallback((configs: AnimationConfig[]) => {
    if (configs.length === 0) return;
    queueRef.current = configs.slice(1);
    startAnimation(configs[0]);
  }, [startAnimation]);

  // ─── Controls ────────────────────────────────────────────────────────────

  const play = useCallback(() => {
    if (statusRef.current === 'paused') {
      statusRef.current = 'playing';
      setStatus('playing');
    }
  }, []);

  const pause = useCallback(() => {
    if (statusRef.current === 'playing') {
      statusRef.current = 'paused';
      setStatus('paused');
    }
  }, []);

  const restart = useCallback(() => {
    if (configRef.current) {
      progressRef.current = 0;
      statusRef.current = 'playing';
      setProgress(0);
      setStatus('playing');
      setCurrentPosition(configRef.current.from);
    }
  }, []);

  const setSpeed = useCallback((newSpeed: SpeedMultiplier) => {
    speedRef.current = newSpeed;
    setSpeedState(newSpeed);
  }, []);

  // ─── Frame Update ────────────────────────────────────────────────────────

  const update = useCallback((deltaMs: number) => {
    if (statusRef.current !== 'playing' || !configRef.current) return;

    const config = configRef.current;
    const duration = BASE_DURATION_MS / speedRef.current;
    const dt = deltaMs / duration;

    progressRef.current = Math.min(1, progressRef.current + dt);
    const t = progressRef.current;
    const easedT = easeInOutCubic(t);

    // Interpolate position on the Bloch sphere
    const pos = slerpBloch(config.from, config.to, easedT);
    setCurrentPosition(pos);
    setProgress(t);

    // Animation complete
    if (t >= 1) {
      setCurrentPosition(config.to);
      if (config.onComplete) {
        config.onComplete();
        // Prevent double-commit if the user restarts this animation
        config.onComplete = undefined as any; 
      }

      // Check if there are queued animations
      if (queueRef.current.length > 0) {
        const next = queueRef.current[0];
        queueRef.current = queueRef.current.slice(1);
        configRef.current = next;
        progressRef.current = 0;
        setProgress(0);
        setCurrentPosition(next.from);
        // Status stays 'playing'
      } else {
        statusRef.current = 'idle';
        setStatus('idle');
        // Keep configRef.current intact so the user can click Restart to replay it
      }
    }
  }, []);

  return {
    status,
    progress,
    speed,
    currentPosition,
    startAnimation,
    queueAnimations,
    play,
    pause,
    restart,
    setSpeed,
    update,
  };
}
