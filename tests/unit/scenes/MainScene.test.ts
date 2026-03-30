import { describe, it, expect, beforeEach } from 'vitest';
import { MainScene } from '../../../src/scenes/MainScene';
import { CANVAS_WIDTH } from '../../../src/utils/constants';

describe('MainScene', () => {
  let mainScene: MainScene;

  beforeEach(() => {
    mainScene = new MainScene();
  });

  describe('initialization', () => {
    it('should create main scene with all components', () => {
      expect(mainScene).toBeDefined();
      expect(mainScene.children.length).toBeGreaterThan(0);
    });

    it('should create background layer', () => {
      expect(mainScene.children[0]).toBeDefined();
    });

    it('should create title text', () => {
      const title = mainScene.children.find(child => (child as any).text === 'Chest Game');

      expect(title).toBeDefined();
    });

    it('should position title at top center', () => {
      const title = mainScene.children.find(child => (child as any).text === 'Chest Game');

      if (title) {
        expect(title.x).toBe(CANVAS_WIDTH / 2);
        expect(title.y).toBe(30);
      }
    });
  });

  describe('chests', () => {
    it('should create exactly 6 chests', () => {
      const chests = mainScene.getChests();
      expect(chests.length).toBe(6);
    });

    it('should initialize chests in 2x3 grid', () => {
      const chests = mainScene.getChests();

      expect(chests[0].id).toBe(0);
      expect(chests[1].id).toBe(1);
      expect(chests[2].id).toBe(2);
      expect(chests[3].id).toBe(3);
      expect(chests[4].id).toBe(4);
      expect(chests[5].id).toBe(5);
    });

    it('should position chests correctly', () => {
      const chests = mainScene.getChests();
      
      chests.forEach(_chest => {
        expect(_chest.x).toBeGreaterThan(0);
        expect(_chest.y).toBeGreaterThan(0);
      });
    });

    it('should have unique positions for each chest', () => {
      const chests = mainScene.getChests();
      const positions = chests.map(c => `${c.x},${c.y}`);
      const uniquePositions = new Set(positions);

      expect(uniquePositions.size).toBe(6);
    });
  });

  describe('play button', () => {
    it('should create play button', () => {
      const playButton = mainScene.getPlayButton();
      expect(playButton).toBeDefined();
    });

    it('should initialize play button as enabled', () => {
      const playButton = mainScene.getPlayButton();
      expect(playButton.enabled).toBe(true);
    });
  });

  describe('getChests', () => {
    it('should return array of all chests', () => {
      const chests = mainScene.getChests();

      expect(Array.isArray(chests)).toBe(true);
      expect(chests.length).toBe(6);
    });

    it('should return the same chests on multiple calls', () => {
      const chests1 = mainScene.getChests();
      const chests2 = mainScene.getChests();

      expect(chests1).toBe(chests2);
    });
  });

  describe('getPlayButton', () => {
    it('should return play button instance', () => {
      const button = mainScene.getPlayButton();

      expect(button).toBeDefined();
      expect(button.enabled).toBe(true);
    });

    it('should return the same button on multiple calls', () => {
      const button1 = mainScene.getPlayButton();
      const button2 = mainScene.getPlayButton();

      expect(button1).toBe(button2);
    });
  });

  describe('resetChests', () => {
    it('should reset all chests to initial state', () => {
      const chests = mainScene.getChests();

      chests[0].setWinState(100);
      chests[1].setLoseState();
      chests[2].setBonusState();

      mainScene.resetChests();

      chests.forEach(chest => {
        expect(chest.isOpened).toBe(false);
        expect(chest.alpha).toBe(1);
        expect(chest.scale.x).toBe(1);
        expect(chest.scale.y).toBe(1);
      });
    });

    it('should handle resetting already reset chests', () => {
      expect(() => mainScene.resetChests()).not.toThrow();

      mainScene.resetChests();

      const chests = mainScene.getChests();
      chests.forEach(chest => {
        expect(chest.isOpened).toBe(false);
      });
    });
  });

  describe('component hierarchy', () => {
    it('should have correct child order', () => {
      expect(mainScene.children.length).toBeGreaterThanOrEqual(9);
    });

    it('should contain all chests as children', () => {
      const chests = mainScene.getChests();

      chests.forEach(chest => {
        expect(mainScene.children.includes(chest)).toBe(true);
      });
    });
  });
});
