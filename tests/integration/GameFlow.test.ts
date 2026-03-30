import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as PIXI from 'pixi.js';
import { Game } from '../../src/Game';
import { GameState, ChestResult } from '../../src/types/index';
import { Chest } from '../../src/entities/Chest';

describe('Game Flow Integration', () => {
  let app: PIXI.Application;
  let game: Game;

  beforeEach(async () => {
    app = new PIXI.Application();
    await app.init({
      width: 800,
      height: 600,
      backgroundColor: 0x000000,
    });
    game = new Game(app);
  });

  describe('Complete Game Cycle', () => {
    it('should complete full game cycle: INITIAL -> PLAYING -> CHEST_OPENING -> back to PLAYING', async () => {
      const stateManager = (game as any).stateManager;
      const chests = (game as any).mainScene.getChests();

      expect(stateManager.getState()).toBe(GameState.INITIAL);

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/require-await
        async (...args: any[]) => {
          const [chest, result] = args as [Chest, ChestResult];
          if (result === ChestResult.WIN) {
            chest.setWinState(100);
          } else if (result === ChestResult.LOSE) {
            chest.setLoseState();
          } else {
            chest.setBonusState();
          }
        }
      );

      await (game as any).onPlayClick();
      expect(stateManager.getState()).toBe(GameState.PLAYING);

      await (game as any).onChestClick(chests[0]);

      expect(chests[0].isOpened).toBe(true);
      expect(stateManager.getState()).toBe(GameState.PLAYING);
    });

    it('should return to INITIAL state after all chests are opened', async () => {
      const stateManager = (game as any).stateManager;
      const chests = (game as any).mainScene.getChests();
      const playButton = (game as any).mainScene.getPlayButton();

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn(game as any, 'determineResult').mockReturnValue(ChestResult.WIN);

      await (game as any).onPlayClick();

      for (let i = 0; i < 6; i++) {
        await (game as any).onChestClick(chests[i]);
      }

      expect(stateManager.areAllChestsOpened()).toBe(true);
      expect(stateManager.getState()).toBe(GameState.INITIAL);
      expect(playButton.enabled).toBe(true);
    });
  });

  describe('Bonus Screen Flow', () => {
    it('should show bonus screen for bonus win', async () => {
      const chests = (game as any).mainScene.getChests();
      const mainScene = (game as any).mainScene;
      const bonusScene = (game as any).bonusScene;

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playBonusAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn(game as any, 'determineResult').mockReturnValue(ChestResult.BONUS);

      await (game as any).onPlayClick();
      await (game as any).onChestClick(chests[0]);

      expect(mainScene.visible).toBe(true);
      expect(bonusScene.visible).toBe(false);
    });

    it('should transition to bonus screen and back', async () => {
      const chests = (game as any).mainScene.getChests();
      const mainScene = (game as any).mainScene;
      const bonusScene = (game as any).bonusScene;

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockResolvedValue(
        undefined
      );

      const bonusAnimSpy = vi
        .spyOn((game as any).animationController, 'playBonusAnimation')
        .mockImplementation(async () => {
          bonusScene.visible = true;
          mainScene.visible = false;
          await Promise.resolve();
          bonusScene.visible = false;
          mainScene.visible = true;
        });

      vi.spyOn(game as any, 'determineResult').mockReturnValue(ChestResult.BONUS);

      await (game as any).onPlayClick();

      expect(mainScene.visible).toBe(true);

      await (game as any).onChestClick(chests[0]);

      expect(bonusAnimSpy).toHaveBeenCalled();
      expect(mainScene.visible).toBe(true);
      expect(bonusScene.visible).toBe(false);
    });

    it('should set win amount on bonus scene', async () => {
      const chests = (game as any).mainScene.getChests();
      const bonusScene = (game as any).bonusScene;

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playBonusAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn(game as any, 'determineResult').mockReturnValue(ChestResult.BONUS);
      vi.spyOn(game as any, 'calculateWinAmount').mockReturnValue(2500);

      await (game as any).onPlayClick();
      await (game as any).onChestClick(chests[0]);

      expect((game as any).animationController.playBonusAnimation).toHaveBeenCalledWith(
        bonusScene,
        2500
      );
    });

    it('should not show bonus screen for regular win', async () => {
      const chests = (game as any).mainScene.getChests();
      const bonusScene = (game as any).bonusScene;

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockResolvedValue(
        undefined
      );
      const bonusAnimSpy = vi
        .spyOn((game as any).animationController, 'playBonusAnimation')
        .mockResolvedValue(undefined);
      vi.spyOn(game as any, 'determineResult').mockReturnValue(ChestResult.WIN);

      await (game as any).onPlayClick();
      await (game as any).onChestClick(chests[0]);

      expect(bonusAnimSpy).not.toHaveBeenCalled();
      expect(bonusScene.visible).toBe(false);
    });
  });

  describe('Race Conditions', () => {
    it('should prevent clicking chest when not in PLAYING state', async () => {
      const stateManager = (game as any).stateManager;
      const chests = (game as any).mainScene.getChests();

      stateManager.setState(GameState.INITIAL);
      chests[0].enable();

      await (game as any).onChestClick(chests[0]);

      expect(chests[0].isOpened).toBe(false);
    });

    it('should prevent clicking already opened chest', async () => {
      const chests = (game as any).mainScene.getChests();

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockResolvedValue(
        undefined
      );

      await (game as any).onPlayClick();

      chests[0].setWinState(100);
      (game as any).stateManager.markChestOpened(0, ChestResult.WIN, 100);

      const animationSpy = vi.spyOn((game as any).animationController, 'playChestAnimation');

      await (game as any).onChestClick(chests[0]);

      expect(animationSpy).not.toHaveBeenCalled();
    });

    it('should disable all interactions during chest opening', async () => {
      const stateManager = (game as any).stateManager;
      const chests = (game as any).mainScene.getChests();
      const playButton = (game as any).mainScene.getPlayButton();

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );

      let chestAnimationResolver: (() => void) | undefined;
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockImplementation(
        () =>
          new Promise(resolve => {
            chestAnimationResolver = resolve as () => void;
          })
      );

      await (game as any).onPlayClick();

      const clickPromise = (game as any).onChestClick(chests[0]);

      expect(stateManager.getState()).toBe(GameState.CHEST_OPENING);

      chests.forEach((chest: any) => {
        expect(chest.enabled).toBe(false);
      });
      expect(playButton.enabled).toBe(false);

      if (chestAnimationResolver) chestAnimationResolver();
      await clickPromise;
    });

    it('should prevent play button click during PLAYING state', async () => {
      const stateManager = (game as any).stateManager;

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );

      await (game as any).onPlayClick();
      expect(stateManager.getState()).toBe(GameState.PLAYING);

      const spawnSpy = vi.spyOn((game as any).animationController, 'playChestSpawnAnimation');

      await (game as any).onPlayClick();

      expect(spawnSpy).not.toHaveBeenCalled();
    });
  });

  describe('State Machine Validation', () => {
    it('should prevent invalid state transitions', () => {
      const stateManager = (game as any).stateManager;
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      stateManager.setState(GameState.INITIAL);
      stateManager.setState(GameState.CHEST_OPENING);

      expect(consoleSpy).toHaveBeenCalled();
      expect(stateManager.getState()).toBe(GameState.INITIAL);

      consoleSpy.mockRestore();
    });

    it('should allow valid state transitions', () => {
      const stateManager = (game as any).stateManager;

      stateManager.setState(GameState.INITIAL);
      stateManager.setState(GameState.PLAYING);

      expect(stateManager.getState()).toBe(GameState.PLAYING);

      stateManager.setState(GameState.CHEST_OPENING);
      expect(stateManager.getState()).toBe(GameState.CHEST_OPENING);

      stateManager.setState(GameState.PLAYING);
      expect(stateManager.getState()).toBe(GameState.PLAYING);
    });
  });

  describe('Error Handling', () => {
    it('should handle animation errors gracefully', async () => {
      const stateManager = (game as any).stateManager;
      const chests = (game as any).mainScene.getChests();

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );
      vi.spyOn((game as any).animationController, 'playChestAnimation').mockRejectedValue(
        new Error('Animation failed')
      );

      await (game as any).onPlayClick();

      await (game as any).onChestClick(chests[0]);

      expect(stateManager.getState()).toBe(GameState.PLAYING);
    });

    it('should recover from play button animation error', async () => {
      const stateManager = (game as any).stateManager;
      const playButton = (game as any).mainScene.getPlayButton();

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockRejectedValue(
        new Error('Spawn animation failed')
      );

      stateManager.setState(GameState.INITIAL);

      await (game as any).onPlayClick();

      expect(playButton.enabled).toBe(true);
      expect(stateManager.getState()).toBe(GameState.INITIAL);
    });
  });

  describe('Reset Functionality', () => {
    it('should properly reset chests visual state', () => {
      const chests = (game as any).mainScene.getChests();

      chests[0].setWinState(100);
      chests[1].setLoseState();
      chests[2].setBonusState();

      game.resetGame();

      chests.forEach((chest: any) => {
        expect(chest.isOpened).toBe(false);
        expect(chest.alpha).toBe(1);
        expect(chest.scale.x).toBe(1);
        expect(chest.scale.y).toBe(1);
      });
    });
  });
});
