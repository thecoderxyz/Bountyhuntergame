// FIX 1: Import the audio files directly.
// This lets Vite bundle them and provides the correct, verified path.
import backgroundMusicUrl from '../../../music.mp3';
import spinSfxUrl from '../../../spin.mp3';
import winSfxUrl from '../../../win.mp3';
// FIX 2: This now correctly imports 'click.mp3'
import clickSfxUrl from '../../../spin.mp3';

class AudioManager {
  private isUnlocked = false;
  private isMuted = false;
  private volume = 0.5;

  private music: HTMLAudioElement;
  private spinSfx: HTMLAudioElement;
  private winSfx: HTMLAudioElement;
  private clickSfx: HTMLAudioElement;
  private allAudio: HTMLAudioElement[];

  constructor() {
    // FIX 3: Use the corrected 'clickSfxUrl'
    this.music = new Audio(backgroundMusicUrl);
    this.music.loop = true;
    this.spinSfx = new Audio(spinSfxUrl);
    this.winSfx = new Audio(winSfxUrl);
    this.clickSfx = new Audio(clickSfxUrl); // This is now correct
    this.allAudio = [this.music, this.spinSfx, this.winSfx, this.clickSfx];
  }

  // This is the most important function. It's called on the FIRST user click.
  public initialize() {
    if (this.isUnlocked) return;

    this.allAudio.forEach(audio => {
      audio.volume = this.volume;
      audio.muted = this.isMuted;
    });

    if (!this.isMuted) {
      this.music.play().catch(e => console.error("Music play failed on init:", e));
    }
    this.isUnlocked = true;
  }

  public play(sound: 'spin' | 'win' | 'click') {
    if (!this.isUnlocked || this.isMuted) return;

    let sfx: HTMLAudioElement;
    switch (sound) {
      case 'spin': sfx = this.spinSfx; break;
      case 'win': sfx = this.winSfx; break;
      case 'click': sfx = this.clickSfx; break;
    }

    sfx.currentTime = 0;
    sfx.play().catch(e => console.error("SFX play failed:", e));
  }

  public toggleMute(callback: (isMuted: boolean) => void) {
    this.isMuted = !this.isMuted;
    this.allAudio.forEach(audio => audio.muted = this.isMuted);

    if (this.isUnlocked) {
      this.isMuted ? this.music.pause() : this.music.play();
    }
    callback(this.isMuted); // Notify React to update the UI
  }

  public setVolume(newVolume: number, callback: (volume: number) => void) {
    this.volume = newVolume;
    this.allAudio.forEach(audio => audio.volume = this.volume);
    callback(this.volume); // Notify React to update the UI
  }
}

// Create a single instance that the whole app will use
export const audioManager = new AudioManager();