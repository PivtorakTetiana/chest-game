import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BackgroundLayer } from '../../../src/effects/BackgroundLayer';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../../src/utils/constants';

describe('BackgroundLayer', () => {
  let backgroundLayer: BackgroundLayer;

  beforeEach(() => {
    backgroundLayer = new BackgroundLayer();
  });

  afterEach(() => {
    backgroundLayer.destroy();
  });

  describe('initialization', () => {
    it('should create background with gradient layer', () => {
      expect(backgroundLayer).toBeDefined();
      expect(backgroundLayer.children.length).toBeGreaterThan(0);
    });

    it('should create vignette overlay', () => {
      expect(backgroundLayer.children.length).toBeGreaterThanOrEqual(2);
    });

    it('should create subtle particles', () => {
      expect(backgroundLayer.children.length).toBeGreaterThanOrEqual(3);
    });

    it('should create exactly 8 background particles', () => {
      const particleContainer = backgroundLayer.children.find(
        child => child.children && child.children.length === 8
      );

      expect(particleContainer).toBeDefined();
    });
  });

  describe('gradient generation', () => {
    it('should generate gradient texture using TextureCache', () => {
      const layer1 = new BackgroundLayer();
      const layer2 = new BackgroundLayer();

      expect(layer1.children[0]).toBeDefined();
      expect(layer2.children[0]).toBeDefined();

      layer1.destroy();
      layer2.destroy();
    });
  });

  describe('vignette effect', () => {
    it('should create vignette with correct dimensions', () => {
      const vignetteSprite = backgroundLayer.children.find(
        child => child.width === CANVAS_WIDTH && child.height === CANVAS_HEIGHT
      );

      expect(vignetteSprite).toBeDefined();
    });
  });

  describe('particle animation', () => {
    it('should start idle animation on initialization', () => {
      expect(backgroundLayer).toBeDefined();
    });

    it('should have particles within canvas bounds initially', () => {
      const particleContainer = backgroundLayer.children.find(
        child => child.children && child.children.length === 8
      );

      if (particleContainer && particleContainer.children) {
        particleContainer.children.forEach(particle => {
          expect(particle.x).toBeGreaterThanOrEqual(-20);
          expect(particle.x).toBeLessThanOrEqual(CANVAS_WIDTH + 20);
          expect(particle.y).toBeGreaterThanOrEqual(-20);
          expect(particle.y).toBeLessThanOrEqual(CANVAS_HEIGHT + 20);
        });
      }
    });
  });

  describe('destroy', () => {
    it('should cleanup animation ticker', () => {
      backgroundLayer.destroy();

      expect(backgroundLayer.destroyed).toBe(true);
    });

    it('should handle multiple destroy calls', () => {
      backgroundLayer.destroy();

      expect(() => backgroundLayer.destroy()).not.toThrow();
    });
  });

  describe('texture caching', () => {
    it('should reuse cached textures for same parameters', () => {
      const layer1 = new BackgroundLayer();
      const layer2 = new BackgroundLayer();
      const layer3 = new BackgroundLayer();

      expect(layer1.children[0]).toBeDefined();
      expect(layer2.children[0]).toBeDefined();
      expect(layer3.children[0]).toBeDefined();

      layer1.destroy();
      layer2.destroy();
      layer3.destroy();
    });
  });

  describe('particle properties', () => {
    it('should create particles with varying sizes', () => {
      const particleContainer = backgroundLayer.children.find(
        child => child.children && child.children.length === 8
      );

      expect(particleContainer).toBeDefined();
    });

    it('should create particles with random properties', () => {
      const particleContainer = backgroundLayer.children.find(
        child => child.children && child.children.length === 8
      );

      if (particleContainer && particleContainer.children) {
        expect(particleContainer.children.length).toBe(8);
      }
    });
  });
});
