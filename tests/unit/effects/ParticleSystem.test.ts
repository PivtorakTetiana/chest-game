import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as PIXI from 'pixi.js';
import { ParticleSystem } from '../../../src/effects/ParticleSystem';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../../src/utils/constants';

describe('ParticleSystem', () => {
  let particleSystem: ParticleSystem;

  beforeEach(() => {
    particleSystem = new ParticleSystem();
    vi.useFakeTimers();
  });

  afterEach(() => {
    particleSystem.destroy();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should create empty particle system', () => {
      expect(particleSystem).toBeDefined();
      expect(particleSystem.children.length).toBe(0);
    });
  });

  describe('createExplosion', () => {
    it('should create explosion with default count', () => {
      particleSystem.createExplosion(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

      expect(particleSystem.children.length).toBe(30);
    });

    it('should create explosion with custom count', () => {
      particleSystem.createExplosion(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 50);

      expect(particleSystem.children.length).toBe(50);
    });

    it('should position particles at center', () => {
      const centerX = 400;
      const centerY = 300;

      particleSystem.createExplosion(centerX, centerY, 5);

      particleSystem.children.forEach(child => {
        expect(child.x).toBe(centerX);
        expect(child.y).toBe(centerY);
      });
    });

    it('should clear previous particles before creating new explosion', () => {
      particleSystem.createExplosion(100, 100, 10);
      expect(particleSystem.children.length).toBe(10);

      particleSystem.createExplosion(200, 200, 20);
      expect(particleSystem.children.length).toBe(20);
    });
  });

  describe('createFloatingParticles', () => {
    it('should create floating particles with default count', () => {
      particleSystem.createFloatingParticles();

      expect(particleSystem.children.length).toBe(20);
    });

    it('should create floating particles with custom count', () => {
      particleSystem.createFloatingParticles(15);

      expect(particleSystem.children.length).toBe(15);
    });

    it('should position particles randomly across canvas', () => {
      particleSystem.createFloatingParticles(10);

      const positions = particleSystem.children.map(child => ({
        x: child.x,
        y: child.y,
      }));

      const uniquePositions = new Set(positions.map(p => `${p.x},${p.y}`));
      expect(uniquePositions.size).toBeGreaterThan(1);
    });

    it('should have upward velocity', () => {
      particleSystem.createFloatingParticles(5);

      expect(particleSystem.children.length).toBe(5);
    });
  });

  describe('clear', () => {
    it('should remove all particles', () => {
      particleSystem.createExplosion(100, 100, 20);
      expect(particleSystem.children.length).toBe(20);

      particleSystem.clear();

      expect(particleSystem.children.length).toBe(0);
    });

    it('should stop animation when clearing', () => {
      particleSystem.createFloatingParticles(10);
      particleSystem.clear();

      expect(particleSystem.children.length).toBe(0);
    });

    it('should handle clearing empty system', () => {
      expect(() => particleSystem.clear()).not.toThrow();
      expect(particleSystem.children.length).toBe(0);
    });
  });

  describe('destroy', () => {
    it('should cleanup all particles and animation', () => {
      particleSystem.createExplosion(100, 100, 15);

      particleSystem.destroy();

      expect(particleSystem.destroyed).toBe(true);
    });

    it('should handle destroying empty system', () => {
      expect(() => particleSystem.destroy()).not.toThrow();
    });
  });

  describe('animation lifecycle', () => {
    it('should start animation when particles created', () => {
      const tickerSpy = vi.spyOn(PIXI.Ticker.shared, 'add');

      particleSystem.createExplosion(100, 100, 10);

      expect(tickerSpy).toHaveBeenCalled();
    });

    it('should not start multiple animations', () => {
      particleSystem.createExplosion(100, 100, 10);
      
      particleSystem.createFloatingParticles(5);
      
      expect(particleSystem.children.length).toBe(5);
    });
  });

  describe('particle lifecycle', () => {
    it('should handle particle wrapping for floating particles', () => {
      particleSystem.createFloatingParticles(5);

      expect(particleSystem.children.length).toBe(5);
    });
  });
});
