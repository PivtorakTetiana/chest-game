import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StateManager } from '../../src/StateManager';
import { GameState, ChestResult } from '../../src/types/index';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  describe('initial state', () => {
    it('should initialize with INITIAL state', () => {
      expect(stateManager.getState()).toBe(GameState.INITIAL);
    });

    it('should initialize with 6 closed chests', () => {
      expect(stateManager.areAllChestsOpened()).toBe(false);
      for (let i = 0; i < 6; i++) {
        const chestData = stateManager.getChestData(i);
        expect(chestData?.isOpened).toBe(false);
      }
    });
  });

  describe('setState', () => {
    it('should update the game state', () => {
      stateManager.setState(GameState.PLAYING);
      expect(stateManager.getState()).toBe(GameState.PLAYING);

      stateManager.setState(GameState.CHEST_OPENING);
      expect(stateManager.getState()).toBe(GameState.CHEST_OPENING);
    });
  });

  describe('markChestOpened', () => {
    it('should mark a chest as opened with win result', () => {
      stateManager.markChestOpened(0, ChestResult.WIN, 250);

      const chestData = stateManager.getChestData(0);
      expect(chestData?.isOpened).toBe(true);
      expect(chestData?.result).toBe(ChestResult.WIN);
      expect(chestData?.winAmount).toBe(250);
    });

    it('should mark a chest as opened with lose result', () => {
      stateManager.markChestOpened(1, ChestResult.LOSE);

      const chestData = stateManager.getChestData(1);
      expect(chestData?.isOpened).toBe(true);
      expect(chestData?.result).toBe(ChestResult.LOSE);
      expect(chestData?.winAmount).toBeUndefined();
    });

    it('should mark a chest as opened with bonus result', () => {
      stateManager.markChestOpened(2, ChestResult.BONUS, 3000);

      const chestData = stateManager.getChestData(2);
      expect(chestData?.isOpened).toBe(true);
      expect(chestData?.result).toBe(ChestResult.BONUS);
      expect(chestData?.winAmount).toBe(3000);
    });
  });

  describe('areAllChestsOpened', () => {
    it('should return false when no chests are opened', () => {
      expect(stateManager.areAllChestsOpened()).toBe(false);
    });

    it('should return false when some chests are opened', () => {
      stateManager.markChestOpened(0, ChestResult.WIN, 100);
      stateManager.markChestOpened(1, ChestResult.LOSE);
      expect(stateManager.areAllChestsOpened()).toBe(false);
    });

    it('should return true when all chests are opened', () => {
      for (let i = 0; i < 6; i++) {
        stateManager.markChestOpened(i, ChestResult.WIN, 100);
      }
      expect(stateManager.areAllChestsOpened()).toBe(true);
    });
  });

  describe('resetGame', () => {
    it('should reset all chests to closed state', () => {
      for (let i = 0; i < 3; i++) {
        stateManager.markChestOpened(i, ChestResult.WIN, 200);
      }

      stateManager.resetGame();

      for (let i = 0; i < 6; i++) {
        const chestData = stateManager.getChestData(i);
        expect(chestData?.isOpened).toBe(false);
        expect(chestData?.result).toBeUndefined();
        expect(chestData?.winAmount).toBeUndefined();
      }
    });

    it('should reset game state to INITIAL', () => {
      stateManager.setState(GameState.PLAYING);
      stateManager.resetGame();
      expect(stateManager.getState()).toBe(GameState.INITIAL);
    });
  });

  describe('getChestData', () => {
    it('should return chest data for valid id', () => {
      const chestData = stateManager.getChestData(3);
      expect(chestData).toBeDefined();
      expect(chestData?.id).toBe(3);
    });

    it('should return undefined for invalid id', () => {
      const chestData = stateManager.getChestData(10);
      expect(chestData).toBeUndefined();
    });
  });

  describe('state machine validation', () => {
    it('should allow valid transition from INITIAL to PLAYING', () => {
      stateManager.setState(GameState.PLAYING);
      expect(stateManager.getState()).toBe(GameState.PLAYING);
    });

    it('should allow valid transition from PLAYING to CHEST_OPENING', () => {
      stateManager.setState(GameState.PLAYING);
      stateManager.setState(GameState.CHEST_OPENING);
      expect(stateManager.getState()).toBe(GameState.CHEST_OPENING);
    });

    it('should allow valid transition from PLAYING to INITIAL', () => {
      stateManager.setState(GameState.PLAYING);
      stateManager.setState(GameState.INITIAL);
      expect(stateManager.getState()).toBe(GameState.INITIAL);
    });

    it('should allow valid transition from CHEST_OPENING to PLAYING', () => {
      stateManager.setState(GameState.PLAYING);
      stateManager.setState(GameState.CHEST_OPENING);
      stateManager.setState(GameState.PLAYING);
      expect(stateManager.getState()).toBe(GameState.PLAYING);
    });

    it('should prevent invalid transition from INITIAL to CHEST_OPENING', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      stateManager.setState(GameState.CHEST_OPENING);

      expect(consoleSpy).toHaveBeenCalled();
      expect(stateManager.getState()).toBe(GameState.INITIAL);

      consoleSpy.mockRestore();
    });

    it('should prevent invalid transition from CHEST_OPENING to CHEST_OPENING', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      stateManager.setState(GameState.PLAYING);
      stateManager.setState(GameState.CHEST_OPENING);
      const currentState = stateManager.getState();
      stateManager.setState(GameState.CHEST_OPENING);

      expect(stateManager.getState()).toBe(currentState);

      consoleSpy.mockRestore();
    });
  });
});
