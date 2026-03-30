import { describe, it, expect, beforeEach } from 'vitest';
import { PlayButton } from '../../../src/entities/PlayButton';

describe('PlayButton', () => {
  let playButton: PlayButton;

  beforeEach(() => {
    playButton = new PlayButton();
  });

  describe('initialization', () => {
    it('should initialize as enabled', () => {
      expect(playButton.enabled).toBe(true);
    });

    it('should be interactive after enable', () => {
      playButton.enable();
      expect(playButton.cursor).toBe('pointer');
    });
  });

  describe('enable/disable', () => {
    it('should enable button', () => {
      playButton.disable();
      playButton.enable();

      expect(playButton.enabled).toBe(true);
      expect(playButton.alpha).toBe(1);
      expect(playButton.eventMode).toBe('static');
      expect(playButton.cursor).toBe('pointer');
    });

    it('should disable button', () => {
      playButton.disable();

      expect(playButton.enabled).toBe(false);
      expect(playButton.alpha).toBe(0.5);
      expect(playButton.eventMode).toBe('none');
      expect(playButton.cursor).toBe('default');
    });
  });
});
