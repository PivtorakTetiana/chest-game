import { describe, it, expect, beforeEach } from 'vitest';
import { Chest } from '../../../src/entities/Chest';

describe('Chest', () => {
  let chest: Chest;

  beforeEach(() => {
    chest = new Chest(0, 100, 200);
  });

  describe('initialization', () => {
    it('should create chest with correct id and position', () => {
      expect(chest.id).toBe(0);
      expect(chest.x).toBe(100);
      expect(chest.y).toBe(200);
    });

    it('should initialize as closed', () => {
      expect(chest.isOpened).toBe(false);
    });

    it('should initialize as disabled', () => {
      expect(chest.enabled).toBe(false);
    });
  });

  describe('enable/disable', () => {
    it('should enable chest when not opened', () => {
      chest.enable();
      expect(chest.enabled).toBe(true);
      expect(chest.eventMode).toBe('static');
      expect(chest.cursor).toBe('pointer');
    });

    it('should not enable chest when opened', () => {
      chest.setWinState(100);
      chest.enable();
      expect(chest.enabled).toBe(false);
    });

    it('should disable chest', () => {
      chest.enable();
      chest.disable();
      expect(chest.enabled).toBe(false);
      expect(chest.eventMode).toBe('none');
      expect(chest.cursor).toBe('default');
    });
  });

  describe('state changes', () => {
    it('should set lose state', () => {
      chest.setLoseState();
      expect(chest.isOpened).toBe(true);
    });

    it('should set win state with amount', () => {
      chest.setWinState(250);
      expect(chest.isOpened).toBe(true);
    });

    it('should set bonus state', () => {
      chest.setBonusState();
      expect(chest.isOpened).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset chest to initial state', () => {
      chest.enable();
      chest.setWinState(100);

      chest.reset();

      expect(chest.isOpened).toBe(false);
      expect(chest.enabled).toBe(false);
      expect(chest.alpha).toBe(1);
      expect(chest.scale.x).toBe(1);
      expect(chest.scale.y).toBe(1);
    });

    it('should reset position to base Y', () => {
      chest.y = 250;
      chest.reset();
      expect(chest.y).toBe(200);
    });
  });
});
