import * as PIXI from 'pixi.js';
import { Chest } from './entities/Chest';
import { BonusScene } from './scenes/BonusScene';
import { ChestResult } from './types/index';
import { Tween } from './utils/Tweening';
import {
  ANIMATION_DURATION,
  ANIMATION_CONFIG,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from './utils/constants';

export class AnimationController {
  async playChestSpawnAnimation(chests: Chest[]): Promise<void> {
    const spawnPromises = chests.map((chest, index) => {
      return (async (): Promise<void> => {
        await Tween.wait(index * ANIMATION_CONFIG.CHEST_SPAWN_DELAY);

        chest.scale.set(0.7);
        chest.alpha = 0;

        await Promise.all([
          Tween.to(chest.scale, ANIMATION_DURATION.CHEST_SPAWN, { x: 1, y: 1 }, Tween.easeOutBack),
          Tween.to(chest, ANIMATION_DURATION.CHEST_SPAWN, { alpha: 1 }, Tween.easeOutCubic),
        ]);
      })();
    });

    await Promise.all(spawnPromises);
  }

  async playChestAnimation(chest: Chest, result: ChestResult, amount: number): Promise<void> {
    await Tween.to(chest.scale, 200, { x: 1.2, y: 1.2 }, Tween.easeOutCubic);
    await Tween.to(chest.scale, 200, { x: 1, y: 1 }, Tween.easeOutCubic);

    if (result === ChestResult.LOSE) {
      chest.setLoseState();
      await this.shakeAnimation(chest);
    } else if (result === ChestResult.WIN) {
      chest.setWinState(amount);
      await this.glowAnimation(chest);
    } else {
      chest.setBonusState();
      await this.smoothGlowAnimation(chest);
    }

    await Tween.wait(500);
  }

  async playBonusAnimation(bonusScene: BonusScene, amount: number): Promise<void> {
    bonusScene.alpha = 0;
    bonusScene.scale.set(1);
    bonusScene.getRadialGlow().alpha = 0;

    const textPanel = bonusScene.getTextPanel();
    const amountPanel = bonusScene.getAmountPanel();
    textPanel.scale.set(1);
    textPanel.alpha = 0;
    amountPanel.scale.set(1);
    amountPanel.alpha = 0;

    await Tween.to(bonusScene, ANIMATION_DURATION.FADE, { alpha: 1 }, Tween.easeOutCubic);

    await this.playBuildupAnimation(bonusScene);

    bonusScene.getParticleSystem().createExplosion(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 40);

    await Promise.all([
      Tween.to(textPanel, 800, { alpha: 1 }, Tween.easeInOutQuint),
      Tween.to(amountPanel, 800, { alpha: 1 }, Tween.easeInOutQuint),
    ]);

    bonusScene.getParticleSystem().createFloatingParticles(15);

    await this.animateCounter(bonusScene, amount, 2000);

    await Tween.wait(800);
    await Tween.to(bonusScene, ANIMATION_DURATION.FADE, { alpha: 0 }, Tween.easeInOutQuint);
  }

  private async playBuildupAnimation(bonusScene: BonusScene): Promise<void> {
    const radialGlow = bonusScene.getRadialGlow();
    radialGlow.scale.set(0.5);

    await Promise.all([
      Tween.to(radialGlow, ANIMATION_DURATION.BONUS_BUILDUP, { alpha: 1 }, Tween.easeInOutQuint),
      Tween.to(
        radialGlow.scale,
        ANIMATION_DURATION.BONUS_BUILDUP,
        { x: 1, y: 1 },
        Tween.easeOutCubic
      ),
    ]);
  }

  private async shakeAnimation(target: PIXI.Container): Promise<void> {
    const originalX = target.x;
    for (let i = 0; i < ANIMATION_CONFIG.SHAKE_ITERATIONS; i++) {
      await Tween.to(target, ANIMATION_DURATION.SHAKE, {
        x: originalX - ANIMATION_CONFIG.SHAKE_AMPLITUDE,
      });
      await Tween.to(target, ANIMATION_DURATION.SHAKE, {
        x: originalX + ANIMATION_CONFIG.SHAKE_AMPLITUDE,
      });
    }
    target.x = originalX;
  }

  private async glowAnimation(chest: Chest): Promise<void> {
    await Tween.to(chest, ANIMATION_DURATION.GLOW, { alpha: 0.7 }, Tween.easeInOutQuint);
    await Tween.to(chest, ANIMATION_DURATION.GLOW, { alpha: 1 }, Tween.easeInOutQuint);
    await Tween.to(chest, ANIMATION_DURATION.GLOW, { alpha: 0.7 }, Tween.easeInOutQuint);
    await Tween.to(chest, ANIMATION_DURATION.GLOW, { alpha: 1 }, Tween.easeInOutQuint);
  }

  private async smoothGlowAnimation(chest: Chest): Promise<void> {
    await Tween.to(chest.scale, 300, { x: 1.1, y: 1.1 }, Tween.easeOutBack);
    await Tween.to(chest.scale, 250, { x: 1, y: 1 }, Tween.easeOutCubic);

    await Tween.to(chest, 250, { alpha: 0.85 }, Tween.easeInOutQuint);
    await Tween.to(chest, 250, { alpha: 1 }, Tween.easeInOutQuint);
  }

  private async animateCounter(
    bonusScene: BonusScene,
    finalAmount: number,
    duration: number
  ): Promise<void> {
    return new Promise(resolve => {
      let current = 0;
      const startTime = Date.now();
      const amountText = bonusScene.getAmountText();

      const ticker = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = Tween.easeOutCubic(progress);
        current = Math.floor(finalAmount * easedProgress);

        amountText.text = `$${current}`;

        if (progress >= 1) {
          PIXI.Ticker.shared.remove(ticker);
          resolve();
        }
      };

      PIXI.Ticker.shared.add(ticker);
    });
  }

  destroy(): void {
    Tween.cancelAll();
  }
}
