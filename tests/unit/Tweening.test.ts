import { describe, it, expect } from 'vitest';
import { Tween } from '../../src/utils/Tweening';

describe('Tween', () => {
  describe('easing functions', () => {
    it('easeInOut should return 0 at t=0 and 1 at t=1', () => {
      expect(Tween.easeInOut(0)).toBe(0);
      expect(Tween.easeInOut(1)).toBe(1);
    });

    it('linear should return the input value', () => {
      expect(Tween.linear(0)).toBe(0);
      expect(Tween.linear(0.5)).toBe(0.5);
      expect(Tween.linear(1)).toBe(1);
    });

    it('easeOutCubic should return 0 at t=0 and 1 at t=1', () => {
      expect(Tween.easeOutCubic(0)).toBe(0);
      expect(Tween.easeOutCubic(1)).toBe(1);
    });

    it('easeOutBack should return approximately 0 at t=0 and 1 at t=1', () => {
      expect(Tween.easeOutBack(0)).toBeCloseTo(0, 5);
      expect(Tween.easeOutBack(1)).toBeCloseTo(1, 5);
    });

    it('easeInOutQuint should return 0 at t=0 and 1 at t=1', () => {
      expect(Tween.easeInOutQuint(0)).toBe(0);
      expect(Tween.easeInOutQuint(1)).toBe(1);
    });

    it('easing functions should be monotonically increasing', () => {
      const easings = [Tween.easeInOut, Tween.linear, Tween.easeOutCubic, Tween.easeInOutQuint];

      easings.forEach(easing => {
        const val1 = easing(0.3);
        const val2 = easing(0.7);
        expect(val2).toBeGreaterThan(val1);
      });
    });
  });

  describe('wait', () => {
    it('should resolve after specified duration', async () => {
      const startTime = Date.now();
      await Tween.wait(100);
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(elapsed).toBeLessThan(200);
    });
  });

  describe('to', () => {
    it('should animate object properties', async () => {
      const target = { x: 0, y: 0 };

      const promise = Tween.to(target, 100, { x: 100, y: 50 }, Tween.linear);

      await promise;

      expect(target.x).toBeCloseTo(100, 0);
      expect(target.y).toBeCloseTo(50, 0);
    });

    it('should handle partial property updates', async () => {
      const target = { x: 0, y: 0, z: 100 };

      await Tween.to(target, 100, { x: 50 });

      expect(target.x).toBeCloseTo(50, 0);
      expect(target.y).toBe(0);
      expect(target.z).toBe(100);
    });

    it('should animate from current value to target value', async () => {
      const target = { alpha: 0.5 };

      await Tween.to(target, 100, { alpha: 1 }, Tween.linear);

      expect(target.alpha).toBeCloseTo(1, 1);
    });
  });

  describe('cancel', () => {
    it('should cancel specific tween for target', async () => {
      const target = { x: 0, y: 0 };
      
      void Tween.to(target, 500, { x: 100, y: 100 });
      
      await Tween.wait(50);
      Tween.cancel(target);
      
      const xAfterCancel = target.x;
      await Tween.wait(100);
      
      expect(target.x).toBe(xAfterCancel);
    });

    it('should cancel specific property tween', async () => {
      const target = { x: 0, y: 0 };
      
      void Tween.to(target, 500, { x: 100, y: 100 });
      
      await Tween.wait(50);
      Tween.cancel(target, 'x');
      
      const xAfterCancel = target.x;
      await Tween.wait(100);
      
      expect(target.x).toBe(xAfterCancel);
    });

    it('should handle cancelling non-existent tween', () => {
      const target = { x: 0 };
      
      expect(() => Tween.cancel(target)).not.toThrow();
    });
  });

  describe('cancelAll', () => {
    it('should cancel all active tweens', async () => {
      const target1 = { x: 0 };
      const target2 = { y: 0 };
      
      void Tween.to(target1, 500, { x: 100 });
      void Tween.to(target2, 500, { y: 100 });

      await Tween.wait(50);
      Tween.cancelAll();

      const x1 = target1.x;
      const y2 = target2.y;

      await Tween.wait(100);

      expect(target1.x).toBe(x1);
      expect(target2.y).toBe(y2);
    });

    it('should handle cancelling when no tweens active', () => {
      expect(() => Tween.cancelAll()).not.toThrow();
    });
  });
});
