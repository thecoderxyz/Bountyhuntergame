import React from 'react';

// Define the props the component expects
interface AudioControlsProps {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playClick: () => void;
  initializeAudio: () => void; // <-- Add initializeAudio
}

export function AudioControls({ 
  isMuted, 
  volume, 
  toggleMute, 
  setVolume, 
  playClick, 
  initializeAudio // <-- Get initializeAudio
}: AudioControlsProps) {

  const handleToggleMute = () => {
    initializeAudio(); // <-- FIX: Call on first interaction
    playClick();
    toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    initializeAudio(); // <-- FIX: Call on first interaction
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleToggleMute} className="text-amber-100 hover:text-white transition-colors">
        {isMuted ? (
          // Mute Icon
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        ) : (
          // Volume On Icon
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        disabled={isMuted}
        className="w-20 sm:w-24 h-1 bg-amber-800 rounded-full appearance-none cursor-pointer disabled:opacity-50"
      />
    </div>
  );
}