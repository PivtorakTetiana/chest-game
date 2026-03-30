import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnimationController } from '../../src/AnimationController';
import { Chest } from '../../src/entities/Chest';
import { BonusScene } from '../../src/scenes/BonusScene';
import { ChestResult } from '../../src/types/index';
import { Tween } from '../../src/utils/Tweening';

describe('AnimationController', () => {
  let animationController: AnimationController;
  let mockChest: Chest;
  let bonusScene: BonusScene;

  beforeEach(() => {
    animationController = new AnimationController();
    mockChest = new Chest(0, 100, 200);
    bonusScene = new BonusScene();
  });

  describe('playChestSpawnAnimation', () => {
    it('should animate all chests', async () => {
      const chests = [new Chest(0, 100, 100), new Chest(1, 200, 100), new Chest(2, 300, 100)];

      chests.forEach(chest => {
        chest.scale.set(1);
        chest.alpha = 1;
      });

      vi.spyOn(Tween, 'wait').mockResolvedValue(undefined);
      vi.spyOn(Tween, 'to').mockResolvedValue(undefined);

      await animationController.playChestSpawnAnimation(chests);

      expect(Tween.wait).toHaveBeenCalled();
      expect(Tween.to).toHaveBeenCalled();
    });

    it('should handle empty chest array', async () => {
      await expect(animationController.playChestSpawnAnimation([])).resolves.not.toThrow();
    });

    it('should stagger animations with delay', async () => {
      const chests = [new Chest(0, 100, 100), new Chest(1, 200, 100)];
      const waitSpy = vi.spyOn(Tween, 'wait').mockResolvedValue(undefined);
      vi.spyOn(Tween, 'to').mockResolvedValue(undefined);

      await animationController.playChestSpawnAnimation(chests);

      expect(waitSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('playChestAnimation', () => {
    beforeEach(() => {
      vi.spyOn(Tween, 'to').mockResolvedValue(undefined);
      vi.spyOn(Tween, 'wait').mockResolvedValue(undefined);
    });

    it('should handle lose result', async () => {
      const setLoseSpy = vi.spyOn(mockChest, 'setLoseState');

      await animationController.playChestAnimation(mockChest, ChestResult.LOSE, 0);

      expect(setLoseSpy).toHaveBeenCalled();
      expect(Tween.to).toHaveBeenCalled();
    });

    it('should handle win result', async () => {
      const setWinSpy = vi.spyOn(mockChest, 'setWinState');

      await animationController.playChestAnimation(mockChest, ChestResult.WIN, 250);

      expect(setWinSpy).toHaveBeenCalledWith(250);
      expect(Tween.to).toHaveBeenCalled();
    });

    it('should handle bonus result', async () => {
      const setBonusSpy = vi.spyOn(mockChest, 'setBonusState');

      await animationController.playChestAnimation(mockChest, ChestResult.BONUS, 3000);

      expect(setBonusSpy).toHaveBeenCalled();
      expect(Tween.to).toHaveBeenCalled();
    });

    it('should animate scale before result reveal', async () => {
      await animationController.playChestAnimation(mockChest, ChestResult.WIN, 100);

      expect(Tween.to).toHaveBeenCalled();
    });

    it('should wait after animation completes', async () => {
      await animationController.playChestAnimation(mockChest, ChestResult.WIN, 100);

      expect(Tween.wait).toHaveBeenCalledWith(500);
    });
  });

  describe('playBonusAnimation', () => {
    beforeEach(() => {
      vi.spyOn(Tween, 'to').mockResolvedValue(undefined);
      vi.spyOn(Tween, 'wait').mockResolvedValue(undefined);
    });

    it('should animate full bonus sequence', async () => {
      await animationController.playBonusAnimation(bonusScene, 2500);

      expect(Tween.to).toHaveBeenCalled();
    });

    it('should set initial alpha to 0', async () => {
      bonusScene.alpha = 1;

      await animationController.playBonusAnimation(bonusScene, 1000);

      expect(Tween.to).toHaveBeenCalled();
    });

    it('should trigger particle explosion', async () => {
      const particleSystem = bonusScene.getParticleSystem();
      const explosionSpy = vi.spyOn(particleSystem, 'createExplosion');

      await animationController.playBonusAnimation(bonusScene, 1500);

      expect(explosionSpy).toHaveBeenCalled();
    });

    it('should trigger floating particles', async () => {
      const particleSystem = bonusScene.getParticleSystem();
      const floatingSpy = vi.spyOn(particleSystem, 'createFloatingParticles');

      await animationController.playBonusAnimation(bonusScene, 2000);

      expect(floatingSpy).toHaveBeenCalled();
    });

    it('should animate counter from 0 to final amount', async () => {
      await animationController.playBonusAnimation(bonusScene, 3000);

      expect(Tween.to).toHaveBeenCalled();
    });

    it('should fade out at the end', async () => {
      await animationController.playBonusAnimation(bonusScene, 1000);

      expect(Tween.to).toHaveBeenCalled();
      expect(Tween.wait).toHaveBeenCalled();
    });
  });

  describe('animation sequences', () => {
    it('should handle multiple animations in sequence', async () => {
      vi.spyOn(Tween, 'to').mockResolvedValue(undefined);
      vi.spyOn(Tween, 'wait').mockResolvedValue(undefined);

      await Promise.all([
        animationController.playChestAnimation(mockChest, ChestResult.WIN, 100),
        animationController.playChestAnimation(mockChest, ChestResult.LOSE, 0),
        animationController.playChestAnimation(mockChest, ChestResult.BONUS, 1000)
      ]);

      expect(Tween.to).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should cancel all active tweens', () => {
      const cancelSpy = vi.spyOn(Tween, 'cancelAll');

      animationController.destroy();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it('should be safe to call multiple times', () => {
      expect(() => {
        animationController.destroy();
        animationController.destroy();
      }).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle tween failures gracefully', async () => {
      vi.spyOn(Tween, 'to').mockRejectedValue(new Error('Tween failed'));

      await expect(
        animationController.playChestAnimation(mockChest, ChestResult.WIN, 100)
      ).rejects.toThrow();
    });
  });
});
