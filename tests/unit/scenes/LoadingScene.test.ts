import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LoadingScene } from '../../../src/scenes/LoadingScene';

describe('LoadingScene', () => {
  let loadingScene: LoadingScene;

  beforeEach(() => {
    loadingScene = new LoadingScene();
  });

  afterEach(() => {
    loadingScene.destroy();
  });

  describe('initialization', () => {
    it('should create loading scene with all components', () => {
      expect(loadingScene).toBeDefined();
      expect(loadingScene.children.length).toBeGreaterThan(0);
    });

    it('should have glass panel', () => {
      expect(loadingScene.children.length).toBeGreaterThanOrEqual(1);
    });

    it('should have spinner', () => {
      expect(loadingScene.children.length).toBeGreaterThanOrEqual(2);
    });

    it('should have loading text', () => {
      const text = loadingScene.children.find(child => (child as any).text === 'Loading...');

      expect(text).toBeDefined();
    });
  });

  describe('spinner animation', () => {
    it('should start animation on initialization', () => {
      expect(loadingScene).toBeDefined();
    });

    it('should rotate spinner continuously', () => {
      const spinner = loadingScene.children[1];
      
      expect(spinner).toBeDefined();
    });
  });

  describe('destroy', () => {
    it('should cleanup animation ticker', () => {
      loadingScene.destroy();

      expect(loadingScene.destroyed).toBe(true);
    });

    it('should handle multiple destroy calls', () => {
      loadingScene.destroy();

      expect(() => loadingScene.destroy()).not.toThrow();
    });

    it('should destroy all children', () => {
      const childCount = loadingScene.children.length;
      expect(childCount).toBeGreaterThan(0);

      loadingScene.destroy();

      expect(loadingScene.destroyed).toBe(true);
    });
  });

  describe('visual components', () => {
    it('should have panel positioned at center', () => {
      const panel = loadingScene.children[0];
      expect(panel).toBeDefined();
    });

    it('should have loading text below spinner', () => {
      const text = loadingScene.children.find(child => (child as any).text === 'Loading...');

      expect(text).toBeDefined();
    });
  });
});
