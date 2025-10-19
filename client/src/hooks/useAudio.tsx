import { useState, useCallback } from 'react';
// FIX: Import the new audioManager
import { audioManager } from '../lib/audioManager';

export function useAudio() {
  // These states are ONLY for the UI (the speaker icon and slider)
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // The hook now exposes the manager's functions directly
  const initializeAudio = useCallback(() => {
    audioManager.initialize();
  }, []);

  const playClick = useCallback(() => {
    audioManager.play('click');
  }, []);

  const playSpin = useCallback(() => {
    audioManager.play('spin');
  }, []);

  const playWin = useCallback(() => {
    audioManager.play('win');
  }, []);

  const toggleMute = useCallback(() => {
    // The manager will update its internal state, and then call setIsMuted
    // to update our UI state.
    audioManager.toggleMute(setIsMuted);
  }, []);

  const handleSetVolume = useCallback((newVolume: number) => {
    audioManager.setVolume(newVolume, setVolume);
  }, []);

  return {
    isMuted,
    volume,
    toggleMute,
    setVolume: handleSetVolume,
    playClick,
    playSpin,
    playWin,
    initializeAudio,
  };
}