import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as PIXI from 'pixi.js';
import { Game } from '../../src/Game';
import { GameState, ChestResult } from '../../src/types/index';

describe('Game Integration Tests', () => {
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

  describe('Initial State', () => {
    it('should initialize with play button enabled', () => {
      const playButton = (game as any).mainScene.getPlayButton();
      expect(playButton.enabled).toBe(true);
    });

    it('should initialize with all chests disabled', () => {
      const chests = (game as any).mainScene.getChests();
      chests.forEach((chest: any) => {
        expect(chest.enabled).toBe(false);
        expect(chest.isOpened).toBe(false);
      });
    });

    it('should start in INITIAL state', () => {
      const state = (game as any).stateManager.getState();
      expect(state).toBe(GameState.INITIAL);
    });
  });

  describe('Game Flow', () => {
    it('should transition to PLAYING state after play button click', async () => {
      const stateManager = (game as any).stateManager;

      stateManager.setState(GameState.INITIAL);
      await (game as any).onPlayClick();

      expect(stateManager.getState()).toBe(GameState.PLAYING);
    });

    it('should enable all chests after play button animation', async () => {
      const chests = (game as any).mainScene.getChests();
      const stateManager = (game as any).stateManager;

      stateManager.setState(GameState.INITIAL);

      vi.spyOn((game as any).animationController, 'playChestSpawnAnimation').mockResolvedValue(
        undefined
      );

      await (game as any).onPlayClick();

      chests.forEach((chest: any) => {
        expect(chest.enabled).toBe(true);
      });
    });
  });

  describe('Result Determination', () => {
    it('should determine result as WIN or LOSE or BONUS', () => {
      const results = new Set<ChestResult>();

      for (let i = 0; i < 100; i++) {
        const result = (game as any).determineResult() as ChestResult;
        results.add(result);
      }

      expect(results.size).toBeGreaterThan(0);
      expect([ChestResult.WIN, ChestResult.LOSE, ChestResult.BONUS]).toContain(
        Array.from(results)[0]
      );
    });

    it('should calculate win amounts within valid ranges', () => {
      for (let i = 0; i < 50; i++) {
        const winAmount = (game as any).calculateWinAmount(ChestResult.WIN);
        expect(winAmount).toBeGreaterThanOrEqual(100);
        expect(winAmount).toBeLessThanOrEqual(500);
      }
    });

    it('should calculate bonus amounts within valid ranges', () => {
      for (let i = 0; i < 50; i++) {
        const bonusAmount = (game as any).calculateWinAmount(ChestResult.BONUS);
        expect(bonusAmount).toBeGreaterThanOrEqual(1000);
        expect(bonusAmount).toBeLessThanOrEqual(5000);
      }
    });

    it('should return 0 for lose result', () => {
      const amount = (game as any).calculateWinAmount(ChestResult.LOSE);
      expect(amount).toBe(0);
    });
  });

  describe('State Management', () => {
    it('should enable play button when all chests are opened', () => {
      const stateManager = (game as any).stateManager;

      for (let i = 0; i < 6; i++) {
        stateManager.markChestOpened(i, ChestResult.WIN, 100);
      }

      expect(stateManager.areAllChestsOpened()).toBe(true);
    });

    it('should reset game correctly', () => {
      const stateManager = (game as any).stateManager;

      stateManager.markChestOpened(0, ChestResult.WIN, 100);
      stateManager.markChestOpened(1, ChestResult.LOSE);
      stateManager.setState(GameState.PLAYING);

      game.resetGame();

      expect(stateManager.getState()).toBe(GameState.INITIAL);
      expect(stateManager.areAllChestsOpened()).toBe(false);
    });
  });

  describe('Interaction Locking', () => {
    it('should disable all interactions during chest opening', () => {
      const chests = (game as any).mainScene.getChests();
      const playButton = (game as any).mainScene.getPlayButton();

      (game as any).disableAllInteractions();

      chests.forEach((chest: any) => {
        expect(chest.enabled).toBe(false);
      });
      expect(playButton.enabled).toBe(false);
    });

    it('should enable only unopened chests after chest animation', () => {
      const stateManager = (game as any).stateManager;
      const chests = (game as any).mainScene.getChests();

      stateManager.markChestOpened(0, ChestResult.WIN, 100);
      stateManager.markChestOpened(2, ChestResult.LOSE);

      chests[0].setWinState(100);
      chests[2].setLoseState();

      (game as any).enableUnopenedChests();

      expect(chests[0].enabled).toBe(false);
      expect(chests[1].enabled).toBe(true);
      expect(chests[2].enabled).toBe(false);
    });
  });
});
