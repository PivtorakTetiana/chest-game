import { describe, it, expect, beforeEach } from 'vitest';
import { GlassPanel } from '../../../src/effects/GlassPanel';
import { COLORS } from '../../../src/utils/constants';

describe('GlassPanel', () => {
  let glassPanel: GlassPanel;

  beforeEach(() => {
    glassPanel = new GlassPanel({
      width: 200,
      height: 100,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: COLORS.NEON_PURPLE,
    });
  });

  describe('initialization', () => {
    it('should create glass panel with correct dimensions', () => {
      expect(glassPanel).toBeDefined();
      expect(glassPanel.children.length).toBeGreaterThan(0);
    });

    it('should apply default options when not provided', () => {
      const defaultPanel = new GlassPanel({
        width: 100,
        height: 50,
      });

      expect(defaultPanel).toBeDefined();
    });

    it('should create panel without inner glow when disabled', () => {
      const noGlowPanel = new GlassPanel({
        width: 100,
        height: 50,
        innerGlow: false,
      });

      expect(noGlowPanel).toBeDefined();
    });

    it('should handle custom glass color and alpha', () => {
      const customPanel = new GlassPanel({
        width: 100,
        height: 50,
        glassColor: 0xff0000,
        glassAlpha: 0.5,
      });

      expect(customPanel).toBeDefined();
    });
  });

  describe('updateShadowDistance', () => {
    it('should update shadow position', () => {
      glassPanel.updateShadowDistance(10);
      
      expect(glassPanel.children[0]?.x).toBe(10);
      expect(glassPanel.children[0]?.y).toBe(10);
    });

    it('should handle negative shadow distance', () => {
      glassPanel.updateShadowDistance(-5);

      expect(glassPanel.children[0]?.x).toBe(-5);
      expect(glassPanel.children[0]?.y).toBe(-5);
    });
  });

  describe('updateBorderGlow', () => {
    it('should update border alpha', () => {
      glassPanel.updateBorderGlow(0.5);

      const border = glassPanel.children[glassPanel.children.length - 1];
      expect(border?.alpha).toBe(0.5);
    });

    it('should handle alpha values greater than 1', () => {
      glassPanel.updateBorderGlow(1.5);

      const border = glassPanel.children[glassPanel.children.length - 1];
      expect(border?.alpha).toBe(1.5);
    });
  });

  describe('setGlassColor', () => {
    it('should update glass background color', () => {
      glassPanel.setGlassColor(0xff0000);

      expect(glassPanel.children.length).toBeGreaterThan(0);
    });

    it('should update glass background color and alpha', () => {
      glassPanel.setGlassColor(0x00ff00, 0.8);

      expect(glassPanel.children.length).toBeGreaterThan(0);
    });
  });

  describe('setBorderColor', () => {
    it('should update border color', () => {
      const initialChildCount = glassPanel.children.length;

      glassPanel.setBorderColor(COLORS.GOLD);

      expect(glassPanel.children.length).toBe(initialChildCount);
    });

    it('should handle multiple border color changes', () => {
      glassPanel.setBorderColor(COLORS.GOLD);
      glassPanel.setBorderColor(COLORS.WIN_GLOW);
      glassPanel.setBorderColor(COLORS.NEON_PURPLE);

      expect(glassPanel.children.length).toBeGreaterThan(0);
    });
  });

  describe('configuration options', () => {
    it('should handle minimum configuration', () => {
      const minPanel = new GlassPanel({
        width: 50,
        height: 50,
      });

      expect(minPanel.children.length).toBeGreaterThan(0);
    });

    it('should handle full configuration', () => {
      const fullPanel = new GlassPanel({
        width: 300,
        height: 150,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: COLORS.GOLD,
        glassColor: 0x000000,
        glassAlpha: 0.9,
        shadowBlur: 30,
        shadowDistance: 15,
        shadowAlpha: 0.8,
        innerGlow: true,
      });

      expect(fullPanel.children.length).toBe(4);
    });
  });
});
