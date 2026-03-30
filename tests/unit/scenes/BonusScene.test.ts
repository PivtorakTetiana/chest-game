import { describe, it, expect, beforeEach } from 'vitest';
import { BonusScene } from '../../../src/scenes/BonusScene';
import { CANVAS_WIDTH } from '../../../src/utils/constants';

describe('BonusScene', () => {
  let bonusScene: BonusScene;

  beforeEach(() => {
    bonusScene = new BonusScene();
  });

  describe('initialization', () => {
    it('should initialize as hidden', () => {
      expect(bonusScene.visible).toBe(false);
    });

    it('should create all components', () => {
      expect(bonusScene.children.length).toBeGreaterThan(0);
    });

    it('should have dark overlay', () => {
      expect(bonusScene.children[0]).toBeDefined();
    });

    it('should have radial glow', () => {
      const radialGlow = bonusScene.getRadialGlow();
      expect(radialGlow).toBeDefined();
    });

    it('should have text panel', () => {
      const textPanel = bonusScene.getTextPanel();
      expect(textPanel).toBeDefined();
    });

    it('should have amount panel', () => {
      const amountPanel = bonusScene.getAmountPanel();
      expect(amountPanel).toBeDefined();
    });

    it('should have animation text', () => {
      const animationText = bonusScene.getAnimationText();
      expect(animationText).toBeDefined();
      expect(animationText.text).toBe('BONUS WIN!');
    });

    it('should have amount text', () => {
      const amountText = bonusScene.getAmountText();
      expect(amountText).toBeDefined();
      expect(amountText.text).toBe('$0');
    });

    it('should have particle system', () => {
      const particleSystem = bonusScene.getParticleSystem();
      expect(particleSystem).toBeDefined();
    });
  });

  describe('getters', () => {
    it('getAnimationText should return text instance', () => {
      const text = bonusScene.getAnimationText();
      expect(text.text).toBe('BONUS WIN!');
    });

    it('getAmountText should return amount text instance', () => {
      const text = bonusScene.getAmountText();
      expect(text).toBeDefined();
    });

    it('getRadialGlow should return sprite', () => {
      const glow = bonusScene.getRadialGlow();
      expect(glow).toBeDefined();
    });

    it('getParticleSystem should return particle system instance', () => {
      const particles = bonusScene.getParticleSystem();
      expect(particles).toBeDefined();
    });

    it('getTextPanel should return glass panel', () => {
      const panel = bonusScene.getTextPanel();
      expect(panel).toBeDefined();
    });

    it('getAmountPanel should return glass panel', () => {
      const panel = bonusScene.getAmountPanel();
      expect(panel).toBeDefined();
    });
  });

  describe('setWinAmount', () => {
    it('should format amount with dollar sign', () => {
      bonusScene.setWinAmount(1500);

      const amountText = bonusScene.getAmountText();
      expect(amountText.text).toBe('$1500');
    });

    it('should handle zero amount', () => {
      bonusScene.setWinAmount(0);

      const amountText = bonusScene.getAmountText();
      expect(amountText.text).toBe('$0');
    });

    it('should handle large amounts', () => {
      bonusScene.setWinAmount(5000);

      const amountText = bonusScene.getAmountText();
      expect(amountText.text).toBe('$5000');
    });
  });

  describe('reset', () => {
    it('should reset alpha to 1', () => {
      bonusScene.alpha = 0.5;
      bonusScene.reset();

      expect(bonusScene.alpha).toBe(1);
    });

    it('should reset amount text to $0', () => {
      bonusScene.setWinAmount(3000);
      bonusScene.reset();

      expect(bonusScene.getAmountText().text).toBe('$0');
    });

    it('should reset animation text scale', () => {
      const animationText = bonusScene.getAnimationText();
      animationText.scale.set(2);

      bonusScene.reset();

      expect(animationText.scale.x).toBe(1);
      expect(animationText.scale.y).toBe(1);
    });

    it('should reset amount text scale', () => {
      const amountText = bonusScene.getAmountText();
      amountText.scale.set(1.5);

      bonusScene.reset();

      expect(amountText.scale.x).toBe(1);
      expect(amountText.scale.y).toBe(1);
    });

    it('should reset text panel scale', () => {
      const textPanel = bonusScene.getTextPanel();
      textPanel.scale.set(0.8);

      bonusScene.reset();

      expect(textPanel.scale.x).toBe(1);
      expect(textPanel.scale.y).toBe(1);
    });

    it('should reset amount panel scale', () => {
      const amountPanel = bonusScene.getAmountPanel();
      amountPanel.scale.set(0.5);

      bonusScene.reset();

      expect(amountPanel.scale.x).toBe(1);
      expect(amountPanel.scale.y).toBe(1);
    });

    it('should reset radial glow alpha to 0', () => {
      const radialGlow = bonusScene.getRadialGlow();
      radialGlow.alpha = 1;

      bonusScene.reset();

      expect(radialGlow.alpha).toBe(0);
    });

    it('should clear particle system', () => {
      const particleSystem = bonusScene.getParticleSystem();
      particleSystem.createExplosion(400, 300, 20);

      bonusScene.reset();

      expect(particleSystem.children.length).toBe(0);
    });

    it('should be callable multiple times', () => {
      bonusScene.setWinAmount(2000);
      bonusScene.reset();
      bonusScene.reset();

      expect(bonusScene.getAmountText().text).toBe('$0');
      expect(bonusScene.alpha).toBe(1);
    });
  });

  describe('positioning', () => {
    it('should center panels correctly', () => {
      const textPanel = bonusScene.getTextPanel();
      const amountPanel = bonusScene.getAmountPanel();

      expect(textPanel.x).toBeGreaterThan(0);
      expect(amountPanel.x).toBeGreaterThan(0);
    });

    it('should center texts correctly', () => {
      const animationText = bonusScene.getAnimationText();
      const amountText = bonusScene.getAmountText();

      expect(animationText.x).toBe(CANVAS_WIDTH / 2);
      expect(amountText.x).toBe(CANVAS_WIDTH / 2);
    });
  });
});
